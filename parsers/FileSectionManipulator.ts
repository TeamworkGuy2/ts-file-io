import ReadFile = require("../file-io/ReadFile");
import WriteFile = require("../file-io/WriteFile");

/** A manipulator for a file sections map created by ReadFile.readLinesSections() or similar function
 * @since 2015-8-11
 */
class FileSectionManipulator {
    private filePath: string;
    private fileSections: { [sectionName: string]: string[] } = {};


    constructor(filePath: string) {
        this.filePath = filePath;
    }


    public addSectionLines(sectionName: string, lines: string[], errorIfNotExist = false) {
        var section = this.fileSections[sectionName];
        if (section == null) {
            if (errorIfNotExist) {
                throw new Error("file '" + this.filePath + "' does not contain section named '" + sectionName + "'");
            }
            else {
                this.fileSections[sectionName] = [];
            }
        }
        Array.prototype.push.apply(section, lines);
    }


    public getSections() {
        return this.fileSections;
    }


    public loadFile(filePath: string, sectionStartEndStrs: [string, string][]): void {
        this.filePath = filePath;
        this.fileSections = ReadFile.readLinesSections(ReadFile.readLines(filePath), sectionStartEndStrs, false, FileSectionManipulator.xmlTagExtractor);
    }


    public saveFile(filePath: string = this.filePath) {
        WriteFile.writeFileSections(filePath, this.fileSections);
    }


    public static loadFile(filePath: string, sectionStartEndStrs: [string, string][]): FileSectionManipulator {
        var fsm = new FileSectionManipulator(filePath);
        fsm.loadFile(filePath, sectionStartEndStrs);
        return fsm;
    }


    private static xmlTagExtractor(ln: string) {
        var line = ln.trim();
        var len = line.length;
        line = line.substring(line.charAt(0) === "<" ? 1 : 0, line.charAt(len - 1) === ">" ? len - 1 : len);

        var tag = line.split(' ', 2)[0];
        return tag;
    }

}

export = FileSectionManipulator;
