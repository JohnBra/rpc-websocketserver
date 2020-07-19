// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\.ts?$': 'ts-jest',
    },
    testRegex: '(\/src\/__tests__\/.*(test|spec))\.[jt]s?$',
    collectCoverage: true,
    moduleFileExtensions: ['ts', 'js']
}
