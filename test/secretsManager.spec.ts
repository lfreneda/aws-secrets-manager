import { TextEncoder } from 'node:util';
import { SecretsManager as AWSClientSecretsManager } from '@aws-sdk/client-secrets-manager';
import sinon from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import { JsonParseError, SecretManagerError, SecretNotFoundError } from '../src/errors.js';
import { SecretsManager } from '../src/secretsManager.js';

describe('SecretsManager', () => {
  beforeEach(() => {
    sinon.restore();
  });

  it('Given secretId should return secret value', async () => {
    const awsStub = sinon.stub(AWSClientSecretsManager.prototype, 'getSecretValue').resolves({
      SecretString: JSON.stringify({ username: 'username', password: 'password' }),
    });

    const secretsManager = new SecretsManager({ region: 'us-east-1' }, false);

    const secretValue = await secretsManager.getSecretValue('secretId');

    expect(awsStub.calledOnce).toBe(true);
    expect(secretValue).toEqual({ username: 'username', password: 'password' });
  });

  it('Given secretId and cache enabled should return secret value', async () => {
    const awsStub = sinon.stub(AWSClientSecretsManager.prototype, 'getSecretValue').resolves({
      SecretString: JSON.stringify({ username: 'username', password: 'password' }),
    });

    const secretsManager = new SecretsManager({ region: 'us-east-1' }, true);

    const secretValue = await secretsManager.getSecretValue('secretId');

    expect(awsStub.calledOnce).toBe(true);
    expect(secretValue).toEqual({ username: 'username', password: 'password' });
  });

  it('Given secretId and cache enabled on second call should return secret value from cache', async () => {
    const awsStub = sinon.stub(AWSClientSecretsManager.prototype, 'getSecretValue').resolves({
      SecretString: JSON.stringify({ username: 'username', password: 'password' }),
    });

    const secretsManager = new SecretsManager({ region: 'us-east-1' }, true);

    const secretOne = await secretsManager.getSecretValue('secretId');
    const secretTwo = await secretsManager.getSecretValue('secretId');

    expect(awsStub.calledOnce).toBe(true);
    expect(secretOne).toEqual({ username: 'username', password: 'password' });
    expect(secretTwo).toEqual({ username: 'username', password: 'password' });
  });

  it('Given secretId and cache enabled on second call with bypassCache should return secret value from aws', async () => {
    const awsStub = sinon.stub(AWSClientSecretsManager.prototype, 'getSecretValue').resolves({
      SecretString: JSON.stringify({ username: 'username', password: 'password' }),
    });

    const secretsManager = new SecretsManager({ region: 'us-east-1' }, true);

    const secretOne = await secretsManager.getSecretValue('secretId');
    const secretTwo = await secretsManager.getSecretValue('secretId', true);

    expect(awsStub.calledTwice).toBe(true);
    expect(secretOne).toEqual({ username: 'username', password: 'password' });
    expect(secretTwo).toEqual({ username: 'username', password: 'password' });
  });

  it('Given an binary secret should return secret value', async () => {
    const uint8Array = new TextEncoder().encode(JSON.stringify({ username: 'username', password: 'password' }));
    const awsStub = sinon.stub(AWSClientSecretsManager.prototype, 'getSecretValue').resolves({
      SecretBinary: uint8Array,
    });

    const secretsManager = new SecretsManager({ region: 'us-east-1' }, false);

    const secretValue = await secretsManager.getSecretValue('secretId');

    expect(awsStub.calledOnce).toBe(true);
    expect(secretValue).toEqual({ username: 'username', password: 'password' });
  });

  it('Given an non existing secretId should throw an error', async () => {
    const awsStub = sinon.stub(AWSClientSecretsManager.prototype, 'getSecretValue').resolves({});

    const secretsManager = new SecretsManager({ region: 'us-east-1' }, false);

    await expect(secretsManager.getSecretValue('secretId')).rejects.toBeInstanceOf(SecretNotFoundError);

    expect(awsStub.calledOnce).toBe(true);
  });

  it('Given an error from aws should throw an error', async () => {
    const awsStub = sinon.stub(AWSClientSecretsManager.prototype, 'getSecretValue').throws(new Error('error'));

    const secretsManager = new SecretsManager({ region: 'us-east-1' }, false);

    await expect(secretsManager.getSecretValue('secretId')).rejects.toBeInstanceOf(SecretManagerError);

    expect(awsStub.calledOnce).toBe(true);
  });

  it('Given an invalid json from aws should throw an error', async () => {
    const awsStub = sinon.stub(AWSClientSecretsManager.prototype, 'getSecretValue').resolves({
      SecretString: '{',
    });

    const secretsManager = new SecretsManager({ region: 'us-east-1' }, false);

    await expect(secretsManager.getSecretValue('secretId')).rejects.toBeInstanceOf(JsonParseError);

    expect(awsStub.calledOnce).toBe(true);
  });
});
