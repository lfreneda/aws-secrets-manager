import sinon from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryCacheSecretsManagerDecorator } from '../src/inMemoryCacheSecretsManagerDecorator';
import { SecretsManager } from '../src/secretsManager';

describe('InMemoryCacheSecretsManagerDecorator', () => {
  let secretsManager: SecretsManager;
  let cache: InMemoryCacheSecretsManagerDecorator;

  beforeEach(() => {
    secretsManager = new SecretsManager({ region: 'us-east-1' }, false);
    cache = new InMemoryCacheSecretsManagerDecorator(secretsManager);
    sinon.restore();
  });

  it('should return cached value if available', async () => {
    const secretId = 'my-secret';
    const secretValue = { username: 'my-username', password: 'my-password' };
    const getSecretValueStub = sinon.stub(secretsManager, 'getSecretValue').resolves(secretValue);

    // Call getSecretValue twice to ensure that the second call returns the cached value
    const result1 = await cache.getSecretValue(secretId);
    const result2 = await cache.getSecretValue(secretId);

    expect(getSecretValueStub.calledOnce).toBeTruthy();
    expect(result1).toEqual(secretValue);
    expect(result2).toEqual(secretValue);
  });

  it('should call secretsManager.getSecretValue if cached value is not available', async () => {
    const secretId = 'my-secret';
    const secretValue = { username: 'my-username', password: 'my-password' };
    const getSecretValueStub = sinon.stub(secretsManager, 'getSecretValue').resolves(secretValue);

    const result = await cache.getSecretValue(secretId);

    expect(getSecretValueStub.calledOnce).toBeTruthy();
    expect(result).toEqual(secretValue);
  });

  it('Given an secretsManager instance with inline cache, should throw an error', () => {
    const secretsManagerWithCache = new SecretsManager({ region: 'us-east-1' }, true);

    expect(() => {
      new InMemoryCacheSecretsManagerDecorator(secretsManagerWithCache);
    }).toThrowError(
      'The secret manager specified already has an inline cache instance, disable the inline cache or use a different secret manager instance.',
    );
  });
});
