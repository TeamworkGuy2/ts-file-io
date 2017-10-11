# Change Log
All notable changes to this project will be documented in this file.
This project 'tries' to adhere to [Semantic Versioning](http://semver.org/).


--------
### [0.1.0](N/A) - 2017-10-10
#### Added
Initial commit of existing code refactored out of `ts-code-generator` library into this new project, including:
* package.json, tsconfig.json
* file-io/: ReadFile.ts, TransformFile.ts, WriteFile.ts
* parsers/: FileSectionManipulator.ts
* parsers/vs-proj/: VsProjManipulator.ts
* test/TransformFileTest.ts