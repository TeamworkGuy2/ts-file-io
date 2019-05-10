Node.js File I/O Utils
==============

Dependencies:
- fancy-log (for TransformFile)
- Q (for TransformFile)

Some common file read/write/manipulate operations I've found useful in Node.js in previous projects.
See the `test/` directory for example usage of the functions in this project.


#### file-io/
Utilities for reading/writing and manipulating files.
 - `ReadFile` contains methods for reading text files (raw or split into lines) and JSON files. As well as `readLinesSection()` and `readLinesSections()` for splitting an array of lines (strings) into groups.
 - `WriteFile` contains methods for writing lines to a text file, replacing '\n' with '\r\n', and writing groups of lines read by ReadFile.
 - `TransformFile` for transforming template files (see `test/TransformFileTest` for example)

#### parsers/
Parent directory for simple file type parsers/manipulators.
Currently contains a manipulator for VS `.csproj` files.
