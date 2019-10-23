# aws-secrets-manager

[![Maintainability](https://api.codeclimate.com/v1/badges/05eab62203d074210414/maintainability)](https://codeclimate.com/github/lfreneda/aws-secrets-manager/maintainability)

:key: High level interface (with cache) for AWS Secrets Manager

## Install

```
npm install @lfreneda/aws-secrets-manager --save
```

## How to use

```js
const { SecretsManager } = require('@lfreneda/aws-secrets-manager')
const secretsManager = new SecretsManager({ region: 'us-east-1' })
const secretValue = await secretsManager.getSecretValue('sample/key')
```

There is also a in memory cache implementation as _"[Decorator pattern](https://en.wikipedia.org/wiki/Decorator_pattern)"_
 using `node-cache` package:

```js
const { SecretsManager, InMemoryCacheSecretsManagerDecorator } = require('@lfreneda/aws-secrets-manager')
const secretsManager = new SecretsManager({ region: 'us-east-1' })
const cachedSecretManager = new InMemoryCacheSecretsManagerDecorator(secretsManager) 
const secretValue = await cachedSecretManager.getSecretValue('sample/key')
```

When using `InMemoryCacheSecretsManagerDecorator` results from aws secret manager service will be cached for 5 minutes :)

If you are using secrets for RDS credentials, there is also a helper to convert db settings to connection string: `toConnectionString`

## Running tests

You should have installed jest as global `npm install jest -g` and then just run:

```
npm test
```