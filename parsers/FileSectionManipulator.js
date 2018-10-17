"use strict";
var Arrays = require("ts-mortar/utils/Arrays");
var Strings = require("ts-mortar/utils/Strings");
var ReadFile = require("../file-io/ReadFile");
var WriteFile = require("../file-io/WriteFile");
/** A manipulator for a file sections map created by ReadFile.readLinesSections() or similar function
 * @since 2015-8-11
 */
var FileSectionManipulator = /** @class */ (function () {
    function FileSectionManipulator(filePath) {
        this.fileSections = {};
        this.filePath = filePath;
    }
    FileSectionManipulator.prototype.addSectionLines = function (sectionName, lines, errorIfNotExist) {
        if (errorIfNotExist === void 0) { errorIfNotExist = false; }
        var section = this.fileSections[sectionName];
        if (section == null) {
            if (errorIfNotExist) {
                throw new Error("file '" + this.filePath + "' does not contain section named '" + sectionName + "'");
            }
            else {
                this.fileSections[sectionName] = [];
            }
        }
        Arrays.addAll(section, lines);
    };
    FileSectionManipulator.prototype.getSections = function () {
        return this.fileSections;
    };
    FileSectionManipulator.prototype.loadFile = function (filePath, sectionStartEndStrs) {
        this.filePath = filePath;
        this.fileSections = ReadFile.readLinesSections(ReadFile.readLines(filePath), sectionStartEndStrs, false, FileSectionManipulator.xmlTagExtractor);
    };
    FileSectionManipulator.prototype.saveFile = function (filePath) {
        if (filePath === void 0) { filePath = this.filePath; }
        WriteFile.writeFileSections(filePath, this.fileSections);
    };
    FileSectionManipulator.loadFile = function (filePath, sectionStartEndStrs) {
        var fsm = new FileSectionManipulator(filePath);
        fsm.loadFile(filePath, sectionStartEndStrs);
        return fsm;
    };
    FileSectionManipulator.xmlTagExtractor = function (ln) {
        var line = Strings.removeLeading(ln.trim(), "<");
        line = Strings.removeTrailing(line, ">");
        var tag = line.split(' ', 2)[0];
        return tag;
    };
    return FileSectionManipulator;
}());
module.exports = FileSectionManipulator;
