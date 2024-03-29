﻿# Change Log
All notable changes to this project will be documented in this file.
This project 'tries' to adhere to [Semantic Versioning](http://semver.org/).


--------
### [0.5.0](N/A) - 2022-01-02
#### Changed
* Update to TypeScript 4.4


--------
### [0.4.0](https://github.com/TeamworkGuy2/ts-file-io/commit/eae1d9424c5d8caca5fd8bbce925012e8622aea4) - 2021-06-12
#### Changed
* Update to TypeScript 4.3


--------
### [0.3.0](https://github.com/TeamworkGuy2/ts-file-io/commit/be88e311a1ee52f547e3cd4ac205636ea6983550) - 2020-09-04
#### Changed
* Update to TypeScript 4.0


--------
### [0.2.6](https://github.com/TeamworkGuy2/ts-file-io/commit/8f0d6ee6ca7dbcecb304c0d9e555eecb2c864d0a) - 2018-11-08
#### Changed
* Update to TypeScript 3.7


--------
### [0.2.5](https://github.com/TeamworkGuy2/ts-file-io/commit/f268ba4996ebfc712de0a142cf82caa71f5bb5b4) - 2018-07-06
#### Changed
* Update to TypeScript 3.5


--------
### [0.2.4](https://github.com/TeamworkGuy2/ts-file-io/commit/3c4698e7d8cacc868a7c897376c1fac89b89211b) - 2018-05-10
#### Changed
* Fixed `package.json` from devDependencies -> dependencies, updated `@types/node` to `@^12.0.0`


--------
### [0.2.3](https://github.com/TeamworkGuy2/ts-file-io/commit/e5323d5575d6b46777169a32944aa1741947495a) - 2018-12-29
#### Changed
* Update to TypeScript 3.2
* Update dev dependencies and @types

#### Removed
* Remove dependency `ts-mortar`


--------
### [0.2.2](https://github.com/TeamworkGuy2/ts-file-io/commit/2e85fb0869f0f2ae2bdc8440f8ef2a580fb86362) - 2018-11-23
#### Changed
* Update dependency `ts-mortar@0.15.9` (fix for `Functions.lazy()` when initializer returns null)


--------
### [0.2.1](N/A) - 2018-10-20
#### Changed
* Switch `package.json` github dependencies from tag urls to release tarballs to simplify npm install (doesn't require git to npm install tarballs)


--------
### [0.2.0](https://github.com/TeamworkGuy2/ts-file-io/commit/428d9c2d02dd491e55dcdafa984cd9d733ed62ce) - 2018-10-17
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