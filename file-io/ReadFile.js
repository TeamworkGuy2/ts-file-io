"use strict";
var fs = require("fs");
/** Methods for reading text/JSON files
 * @since 2015-8-10
 */
var ReadFile;
(function (ReadFile) {
    /** Read a UTF-8 file and optional strip BOM
     */
    function readUtf8File(filePath, stripBom) {
        if (stripBom === void 0) { stripBom = true; }
        //try {
        var src = fs.readFileSync(filePath, "UTF-8");
        if (stripBom)
            src = src.replace(/^\uFEFF/, "");
        return src;
        //} catch (err) {
        //    return err;
        //}
    }
    ReadFile.readUtf8File = readUtf8File;
    /** Read a UTF-8 file, strip BOM, and return the JSON.parse() result
     */
    function loadJsonFile(filePath) {
        //try {
        var src = readUtf8File(filePath, true);
        return JSON.parse(src);
        //} catch (err) {
        //    return err;
        //}
    }
    ReadFile.loadJsonFile = loadJsonFile;
    /** Read a UTF-8 file, split it into lines at '[\r]\n' character sequences and return the resulting array of strings
     */
    function readLines(filePath) {
        var content = fs.readFileSync(filePath, "UTF-8");
        var lines = content.split('\n');
        for (var i = 0, size = lines.length; i < size; i++) {
            var line = lines[i];
            if (line.charAt(line.length - 1) === '\r') {
                lines[i] = line.substr(0, line.length - 1);
            }
        }
        return lines;
    }
    ReadFile.readLines = readLines;
    /** split a set of lines into a matching section and the lines that come before and after that section
     */
    function readLinesSection(lines, sectionStartLine, sectionEndLine, includeStartEndLinesInSection) {
        var sectionEndLineTrimmed = sectionEndLine.trim();
        var sectionStartLineTrimmed = sectionStartLine.trim();
        var beforeLines = [];
        var sectionLines = [];
        var afterLines = [];
        var BEFORE_SECTION = 1;
        var IN_SECTION = 2;
        var AFTER_SECTION = 3;
        var state = BEFORE_SECTION;
        for (var i = 0, size = lines.length; i < size; i++) {
            var line = lines[i];
            if (state === AFTER_SECTION) {
                afterLines.push(line);
            }
            else if (state === IN_SECTION) {
                if (line.trim() === sectionEndLineTrimmed) {
                    state = AFTER_SECTION;
                    if (includeStartEndLinesInSection) {
                        sectionLines.push(line);
                    }
                    else {
                        afterLines.push(line);
                    }
                }
                else {
                    sectionLines.push(line);
                }
            }
            else if (state === BEFORE_SECTION) {
                if (line.trim() === sectionStartLineTrimmed) {
                    state = IN_SECTION;
                    if (includeStartEndLinesInSection) {
                        sectionLines.push(line);
                    }
                    else {
                        beforeLines.push(line);
                    }
                }
                else {
                    beforeLines.push(line);
                }
            }
            else {
                throw new Error("unknown state '" + state + "' while parsing lines sub-section");
            }
        }
        return {
            beforeLines: beforeLines,
            sectionLines: sectionLines,
            afterLines: afterLines,
        };
    }
    ReadFile.readLinesSection = readLinesSection;
    /** split a set of lines into a matching section and the lines that come before and after that section
     */
    function readLinesSections(lines, sectionStartEndLines, includeStartEndLinesInSection, lineTypeDetector) {
        var sectionStartLinesTrimmed = sectionStartEndLines.map(function (strs) { return strs[0].trim(); });
        var sectionEndLinesTrimmed = sectionStartEndLines.map(function (strs) { return strs[1].trim(); });
        var linesSections = {};
        // detect the most common opening XML tab in a list of XML lines where each line has a single opening and closing XML tag
        function detectSectionName(lines) {
            var lineTypes = {};
            for (var i = 0, size = lines.length; i < size; i++) {
                var startStr = lineTypeDetector(lines[i]);
                lineTypes[startStr] = (lineTypes[startStr] || 0) + 1;
            }
            var highestCountProp = null;
            var highestCount = 0;
            var props = Object.keys(lineTypes);
            for (var i = 0, size = props.length; i < size; i++) {
                var value = lineTypes[props[i]];
                if (value > highestCount) {
                    highestCount = value;
                    highestCountProp = props[i];
                }
            }
            return highestCountProp;
        }
        function setupNextSection() {
            var sectionName = detectSectionName(currentSection);
            if (sectionName != null) {
                delete linesSections[currentSectionName];
                linesSections[sectionName] = currentSection;
            }
            sectionNum++;
            currentSectionName = "_" + sectionNum;
            currentSection = (linesSections[currentSectionName] = []);
        }
        var sectionNum = 0;
        var currentSectionName = "_" + sectionNum;
        var currentSection = (linesSections[currentSectionName] = []);
        // initialize the first section
        setupNextSection();
        for (var i = 0, size = lines.length; i < size; i++) {
            var line = lines[i];
            var lineTrimmed = line.trim();
            var isStartLine = sectionStartLinesTrimmed.indexOf(lineTrimmed);
            var isEndLine = sectionEndLinesTrimmed.indexOf(lineTrimmed);
            // add current line to the current section, after/before starting the new section, or before/after ending the current section, depending on the include in section flag
            if (isStartLine) {
                if (!includeStartEndLinesInSection) {
                    currentSection.push(line);
                }
                setupNextSection();
                if (includeStartEndLinesInSection) {
                    currentSection.push(line);
                }
            }
            else if (isEndLine) {
                if (includeStartEndLinesInSection) {
                    currentSection.push(line);
                }
                setupNextSection();
                if (!includeStartEndLinesInSection) {
                    currentSection.push(line);
                }
            }
            else {
                currentSection.push(line);
            }
        }
        return linesSections;
    }
    ReadFile.readLinesSections = readLinesSections;
})(ReadFile || (ReadFile = {}));
module.exports = ReadFile;
