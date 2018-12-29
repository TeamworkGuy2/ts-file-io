"use strict";
var fs = require("fs");
var Q = require("q");
var log = require("fancy-log");
var WriteFile = require("./WriteFile");
/** Methods for transforming template files and splitting and joining lines
 * @author TeamworkGuy2
 */
var TransformFile;
(function (TransformFile) {
    var MatchOperation;
    (function (MatchOperation) {
        MatchOperation[MatchOperation["REPLACE_LINES"] = 0] = "REPLACE_LINES";
        MatchOperation[MatchOperation["REPLACE_MATCHING_PORTION"] = 1] = "REPLACE_MATCHING_PORTION";
        MatchOperation[MatchOperation["DELETE_LINES"] = 2] = "DELETE_LINES";
        MatchOperation[MatchOperation["DELETE_MATCHING_PORTION"] = 3] = "DELETE_MATCHING_PORTION";
        MatchOperation[MatchOperation["RETURN_MATCHING_LINES"] = 4] = "RETURN_MATCHING_LINES";
        MatchOperation[MatchOperation["RETURN_MATCHING_PORTIONS"] = 5] = "RETURN_MATCHING_PORTIONS";
        MatchOperation[MatchOperation["PRINT_LINES"] = 6] = "PRINT_LINES";
    })(MatchOperation = TransformFile.MatchOperation || (TransformFile.MatchOperation = {}));
    /** Split a file's contents into lines at either '\n' or '\r\n'
     * @param fileContent the string to split
     */
    function splitFileLines(fileContent) {
        var lines = fileContent.split(/\n|\r\n/);
        return lines;
    }
    TransformFile.splitFileLines = splitFileLines;
    /** Replace '\n' with '\r\n' and replace '\t' with four spaces '    '
     * @param text
     */
    function joinLinesForFile(text) {
        var res = text.replace(/\n/g, "\r\n").replace(/\t/g, "    ");
        return res;
    }
    TransformFile.joinLinesForFile = joinLinesForFile;
    /** Map a dictionary of variable names and strings/string arrays/replace text variables to a map of variable names and replace text variables
     * using a default 'MatchOperation' to create a replace text variable when a variable name maps to a string or string array
     */
    function mapVarsToOps(op, variableNamesToLines) {
        return Object.keys(variableNamesToLines).reduce(function (vars, k) {
            var varData = variableNamesToLines[k];
            var isStrOrAry = typeof varData === "string" || Array.isArray(varData);
            vars[k] = isStrOrAry ? { op: op, opParam: varData } : varData;
            return vars;
        }, {});
    }
    TransformFile.mapVarsToOps = mapVarsToOps;
    /** Replace lines containing a variable with lines/strings from a map of variable names to string arrays
     * TODO: use StringTemplate v3/v4 to fill in template file
     *
     * @param startMarker: the start marker before all variable names, (for example '$' default for StringTemplate)
     * @param endMarker: the end marker after all variable names, (for example '$' default for StringTemplate)
     * @param transformations: a map of
     * Each transformation is applied to the lines generated by the previous transformation, transformations occur in the Object.keys() iteration order.
     * MatchOperation op: the operation to perform on each matching line, such as removing it from the array of returned lines,
     * replacing it from the 'variableNamesToLines' or replacing just the matching variable name.
     * String | String[] opParam: the parameters to apply to the operation, for example MatchOperation.REPLACE_LINES takes
     * an array of lines and inserts them in place of each matching line, MatchOperation.REPLACE_MATCHIN_PORTION takes a single
     * string and replaces the matching portion of strings
     * variable names to operations and operation parameters to replace them with
     * @return an array of transformed strings
     */
    function transformLines(fileName, lines, startMarker, endMarker, transformations) {
        startMarker = (startMarker == null ? "" : startMarker);
        endMarker = (endMarker == null ? "" : endMarker);
        var newLines = lines;
        var variableNames = Object.keys(transformations);
        var maxLineNumDigits = lines.length.toString().length;
        // if we are only printing matching lines, we don't need array for resulting lines
        if (variableNames != null && variableNames.filter(function (k) { return transformations[k].op === MatchOperation.PRINT_LINES; }).length === variableNames.length) {
            log("Matching lines in: " + fileName);
        }
        var returnNonMatching = true;
        // don't return non-matching strings if any of the transformation operations are 'return' operations
        if (variableNames != null && variableNames.filter(function (k) { return transformations[k].op === MatchOperation.RETURN_MATCHING_LINES || transformations[k].op === MatchOperation.RETURN_MATCHING_PORTIONS; }).length > 0) {
            returnNonMatching = false;
        }
        // variable-by-variable
        for (var ii = 0, sizeI = variableNames.length; ii < sizeI; ii++) {
            newLines = [];
            var variableName = variableNames[ii];
            var varFullName = startMarker + variableName + endMarker;
            var op = transformations[variableName].op;
            var opParam = transformations[variableName].opParam;
            var opParamIsAry = Array.isArray(opParam);
            // line-by-line
            for (var i = 0, size = lines.length; i < size; i++) {
                // if line contains variable name, replace line with variable replacement line
                if (lines[i].indexOf(varFullName) > -1) {
                    switch (op) {
                        case MatchOperation.DELETE_LINES:
                            break;
                        case MatchOperation.PRINT_LINES:
                            log(i + ". " + lines[i]);
                            break;
                        case MatchOperation.REPLACE_LINES:
                            if (opParamIsAry) {
                                addAll(newLines, opParam);
                            }
                            else {
                                newLines.push(opParam);
                            }
                            break;
                        case MatchOperation.DELETE_MATCHING_PORTION:
                            var resLine = lines[i].replace(varFullName, "");
                            newLines.push(resLine);
                            break;
                        case MatchOperation.REPLACE_MATCHING_PORTION:
                            if (opParamIsAry) {
                                var resLine = lines[i].replace(varFullName, opParam[0]);
                                newLines.push(resLine);
                                if (opParam.length > 1) {
                                    addAll(newLines, opParam.slice(1));
                                }
                            }
                            else {
                                var resLine = lines[i].replace(varFullName, opParam);
                                newLines.push(resLine);
                            }
                            break;
                        case MatchOperation.RETURN_MATCHING_PORTIONS:
                            var matchStr = varFullName;
                        case MatchOperation.RETURN_MATCHING_LINES:
                            var matchStr = lines[i];
                            newLines.push(matchStr);
                            break;
                        default:
                            newLines.push(lines[i]);
                            break;
                    }
                }
                else {
                    if (returnNonMatching) {
                        newLines.push(lines[i]);
                    }
                }
            }
            // apply the next transformation to the lines generated by the last transformation
            lines = newLines;
        }
        return newLines || [];
    }
    TransformFile.transformLines = transformLines;
    function transformFile(srcFile, startVarMark, endVarMark, transformations) {
        var fileSrc = fs.readFileSync(srcFile);
        var fileLines = splitFileLines(fileSrc.toString());
        var lines = transformLines(srcFile, fileLines, startVarMark, endVarMark, transformations);
        return lines;
    }
    TransformFile.transformFile = transformFile;
    /** Transform a file's contents and return the original and resulting lines to a callback function
     */
    function transformFileToLines(matchOp, srcFile, startVarMark, endVarMark, variablesNamesToLines) {
        var buf = fs.readFileSync(srcFile);
        var srcLines = splitFileLines(buf.toString());
        var transformedLines = transformLines(srcFile, srcLines, startVarMark, endVarMark, mapVarsToOps(matchOp, variablesNamesToLines));
        return {
            srcLines: srcLines,
            transformedLines: transformedLines
        };
    }
    /** Transform a file's contents and write it to a destination file
     * @return a message about the text written to the file
     */
    function transformFileToFile(matchOp, srcFile, dstFile, startVarMark, endVarMark, variablesNamesToLines) {
        var res = transformFileToLines(matchOp, srcFile, startVarMark, endVarMark, variablesNamesToLines);
        WriteFile.writeFileLines(dstFile, res.transformedLines);
        return res;
    }
    TransformFile.transformFileToFile = transformFileToFile;
    function transformFileToFileAsync(matchOp, srcFile, dstFile, startVarMark, endVarMark, variablesNamesToLines, doneCb, errorCb, postFileWritten) {
        var resLns = transformFileToLines(matchOp, srcFile, startVarMark, endVarMark, variablesNamesToLines);
        WriteFile.writeFileLinesAsync(dstFile, resLns.transformedLines, function (res) {
            doneCb(resLns);
        }, errorCb, postFileWritten);
    }
    TransformFile.transformFileToFileAsync = transformFileToFileAsync;
    /** Transform a file containing template variables
     * @param srcFile: the source file containing text to read
     * @param dstFile: the destination file to write the transformed text to
     * @param variablesNamesToLines: associates template variable names with the text to insert in their place
     * @param postFileWritten: a callback to call after writing the destination file
     * @param successMsg: a success message to pass to the resolved returned promise
     */
    function convertTemplateFile(srcFile, dstFile, variablesNamesToLines, delimiterStart, delimiterEnd) {
        if (delimiterStart === void 0) { delimiterStart = "$"; }
        if (delimiterEnd === void 0) { delimiterEnd = "$"; }
        var msg = transformFileToFile(MatchOperation.REPLACE_MATCHING_PORTION, srcFile, dstFile, delimiterStart, delimiterEnd, variablesNamesToLines);
        return msg;
    }
    TransformFile.convertTemplateFile = convertTemplateFile;
    function convertTemplateFileAsync(srcFile, dstFile, variablesNamesToLines, postFileWritten, successMsg, delimiterStart, delimiterEnd) {
        if (delimiterStart === void 0) { delimiterStart = "$"; }
        if (delimiterEnd === void 0) { delimiterEnd = "$"; }
        var dfd = Q.defer();
        transformFileToFileAsync(MatchOperation.REPLACE_MATCHING_PORTION, srcFile, dstFile, delimiterStart, delimiterEnd, variablesNamesToLines, function (msg) {
            dfd.resolve((successMsg ? successMsg + ": " : "") + msg);
        }, function (err) {
            dfd.reject(err);
        }, postFileWritten);
        return dfd.promise;
    }
    TransformFile.convertTemplateFileAsync = convertTemplateFileAsync;
    // copied from ts-mortar
    function addAll(src, toAdd) {
        if (toAdd != null && toAdd.length > 0) {
            Array.prototype.push.apply(src, toAdd);
        }
        return src;
    }
})(TransformFile || (TransformFile = {}));
module.exports = TransformFile;
