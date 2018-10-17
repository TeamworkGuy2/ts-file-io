# Change Log
All notable changes to this project will be documented in this file.
This project 'tries' to adhere to [Semantic Versioning](http://semver.org/).


--------
### [0.2.0](N/A) - 2018-10-16
#### Changed
* Update to TypeScript 3.1
* Update dev dependencies and @types
* Enable `tsconfig.json` `strict` and fix compile errors
* Removed compiled bin tarball in favor of git tags
* `FileSectionManipulator.addSectionLines()` adds a section if one does not exist rather than throwing an error.  For the old behavior of throwing an error, pass true as the 3rd argument


--------
### [0.1.4](https://github.com/TeamworkGuy2/ts-file-io/commit/8f4759f57920c63c28d47bd5d0f395e2336a2422) - 2018-04-14
#### Changed
* Setup ts-mortar as a proper npm node_modules dependency
* Added release tarball and npm script `build-package` to package.json referencing external process to generate tarball


--------
### [0.1.3](https://github.com/TeamworkGuy2/ts-file-io/commit/6aa9186dee829ec8a3c751f4d4aadad9985c1080) - 2018-04-02
#### Changed
* Update to TypeScript 2.8
* Update dependencies: @types/mocha, @types/node, @types/q
* Update tsconfig.json with `noImplicitReturns: true` and `forceConsistentCasingInFileNames: true`


--------
### [0.1.2](https://github.com/TeamworkGuy2/ts-file-io/commit/c79419f77f8bf2014339408142ff8bf23d463570) - 2018-03-01
#### Changed
* Update to TypeScript 2.7
* Update dependencies: mocha, @types/chai, @types/mocha, @types/node, @types/q
* Enable tsconfig.json `noImplicitAny`


--------
### [0.1.1](N/A) - 2017-11-19
#### Added
* `package.json` added `strictNullChecks` support and updated code to support null types


--------
### [0.1.0](https://github.com/TeamworkGuy2/ts-file-io/commit/09dd4f111766466feb526327123544847ebcb79c) - 2017-10-10
#### Added
Initial commit of existing code refactored out of `ts-code-generator` library into this new project, including:
* package.json, tsconfig.json
* file-io/: ReadFile.ts, TransformFile.ts, WriteFile.ts
* parsers/: FileSectionManipulator.ts
* parsers/vs-proj/: VsProjManipulator.ts
* test/TransformFileTest.ts