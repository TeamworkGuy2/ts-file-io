# Change Log
All notable changes to this project will be documented in this file.
This project 'tries' to adhere to [Semantic Versioning](http://semver.org/).


--------
### [0.1.3](N/A) - 2018-04-02
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