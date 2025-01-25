import { readFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { pathsToModuleNameMapper } from 'ts-jest'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const { compilerOptions } = JSON.parse(
  readFileSync(resolve(__dirname, './tsconfig.json'), 'utf8'),
)

export default {
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  modulePaths: ['<rootDir>'],
  preset: 'ts-jest',
  rootDir: '.',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
}
