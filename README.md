# aws-secrets-manager

[![Maintainability](https://api.codeclimate.com/v1/badges/05eab62203d074210414/maintainability)](https://codeclimate.com/github/lfreneda/aws-secrets-manager/maintainability)

:key: High level interface (with cache) for AWS Secrets Manager

## Install

```shell
npm install @lfreneda/aws-secrets-manager --save
```

```shell
yarn add @lfreneda/aws-secrets-manager
```

## What's New in Version 1.0.0

This release represents a **MAJOR** version update from `0.0.3`, indicating significant changes to the API. Users of version `^0.0.3` should be aware that this update is not backward-compatible. However, packages using version `^0.0.3` will not be automatically updated to `1.0.0`.

### Major Changes

- **Language Update**: The codebase has been migrated from JavaScript to TypeScript with correct types and JSDOC documentation.
- **Package Updates**: The AWS SDK has been updated to version 3. Node.js 14 and above is now supported (developed in Node.js version 18).
- **Development Tools**: ESLint has been updated to the latest version with the "Neon" standard, and Prettier has been added to the project.
- **Testing**: Unit tests have been added using Vitest for various functions, including `SecretManager`, `toConnectionString`, and `InMemoryCacheSecretsManagerDecorator`.
- **API Changes**: Error handling has been improved with errors now mapped to their own classes. The `SecretManager` has been enhanced to accept an `inlineCache` parameter during instantiation, and the `getSecretValue` method now supports a `bypassCache` parameter.

### Note on Cache

When using the secret manager with `inlineCache`, the secrets will be cached for 10 minutes, if you need to bypass the cache, you can use the `bypassCache` parameter.

If your needs require any changes to the cache, you can implement your own cache by disabling the `inlineCache` and using the `InMemoryCacheSecretsManagerDecorator` decorator, see the [Node-Cache](https://www.npmjs.com/package/node-cache) package for more information on configuration options.

### Utils

If you are using secrets for RDS credentials, there is also a helper to convert database settings to a connection string: `toConnectionString`.

## How to use

Inline cache implementation:

```javascript
const { SecretsManager } = require('@lfreneda/aws-secrets-manager')
const secretsManager = new SecretsManager({ region: 'us-east-1' })
const secretValue = await secretsManager.getSecretValue('sample/key')
```

To use the in-memory cache implementation:

```javascript
const { SecretsManager, InMemoryCacheSecretsManagerDecorator } = require('@lfreneda/aws-secrets-manager')
const secretsManager = new SecretsManager({ region: 'us-east-1' }, false)
const cachedSecretManager = new InMemoryCacheSecretsManagerDecorator(secretsManager)
const secretValue = await cachedSecretManager.getSecretValue('sample/key')
```

To use the `bypassCache` parameter:

```javascript
const { SecretsManager } = require('@lfreneda/aws-secrets-manager')
const secretsManager = new SecretsManager({ region: 'us-east-1' })
const secretValue = await secretsManager.getSecretValue('sample/key', true)
```

## Running tests

Tests were made using [Vitest](https://vitest.dev/) and [Sinon](https://sinonjs.org/)

```shell
npm test
```

## Need Help?

If you have questions or encounter issues while transitioning to version 1.0.0, please feel free to open an issue on GitHub for assistance.

Make sure to adjust the installation, usage, and testing instructions as needed for your project.