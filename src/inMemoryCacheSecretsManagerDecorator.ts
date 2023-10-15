import NodeCache from 'node-cache';
import { DuplicatedCacheInstanceError } from './errors.js';
import type { SecretsManager } from './secretsManager.js';

export class InMemoryCacheSecretsManagerDecorator {
  public secretsManager: SecretsManager;

  private readonly secretValueCache: NodeCache;

  /**
   * @param secretsManager - The secrets manager instance to decorate
   * @param cacheOptions - The options to pass to the node-cache instance
   */
  public constructor(secretsManager: SecretsManager, cacheOptions?: NodeCache.Options) {
    if (secretsManager.hasInlineCache) {
      throw new DuplicatedCacheInstanceError();
    }

    this.secretsManager = secretsManager;

    this.secretValueCache = new NodeCache(
      cacheOptions ?? {
        stdTTL: 600,
        checkperiod: 300,
        useClones: true,
      },
    );
  }

  /**
   * Get the secret value from the cache or from the secrets manager
   *
   * @param secretId - The secret id to retrieve
   * @returns The secret value
   */
  public async getSecretValue<T>(secretId: string): Promise<T> {
    const secretValueCached = this.secretValueCache.get<T>(`aws:secret:${secretId}`);
    if (secretValueCached) {
      return secretValueCached;
    }

    const secretValue = await this.secretsManager.getSecretValue<T>(secretId, true);
    this.secretValueCache.set(`aws:secret:${secretId}`, secretValue);
    return secretValue;
  }
}
