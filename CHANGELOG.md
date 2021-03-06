# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2020-11-01
### Added
- Documentation, more usage examples in README.md, comments in code

### Changed
- BREAKING: MessageHandler process interface to take calling context as first parameter, to handle 'this' in function call properly. This WILL BREAK custom message handler implementations. If you used the provided message handlers, the changes are backwards compatible.

## [1.0.3] - 2020-09-03
### Changed
- fixed main file path in package json

## [1.0.2] - 2020-08-31
### Added
- npm package description
- npm package tags

### Changed
- changed ws from dependency to peer dependency (incl. doc)

## [1.0.1] - 2020-08-30
### Added
- npmignore file

### Removed
- unnecessary files from dist

## [1.0.0] - 2020-08-30
### Added

- WebSocketServer abstract class wrapping wss from the [ws](https://github.com/websockets/ws) package
- interfaces and types for all request/rpc related stuff
- utils including specific type assertions and validation methods
- decorator functions/factories to register methods and params respectively to namespaces
- json rpc 2 interfaces conforming to the [https://www.jsonrpc.org/specification](https://www.jsonrpc.org/specification)
- json rpc 2 error classes including conforming error codes
- json rpc 2 utils (type assertions/validators and object builder functions)
- json rpc 2 message handler
- simple message handler (simplistic message handler, not conforming to any protocol)
- unit tests for all relevant files
