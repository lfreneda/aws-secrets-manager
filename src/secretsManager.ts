import { Buffer } from 'node:buffer';
import {
  SecretsManager as AWSClientSecretsManager,
  type SecretsManagerClientConfig,
} from '@aws-sdk/client-secrets-manager';
import { JsonParseError, SecretManagerError, SecretNotFoundError } from './errors.js';
import { InMemoryCacheSecretsManagerDecorator } from './inMemoryCacheSecretsManagerDecorator.js';

export class SecretsManager {
  public awsSecretsManager: AWSClientSecretsManager;

  private readonly cacheDecorator?: InMemoryCacheSecretsManagerDecorator;

  /**
   * @param awsSecretsManagerOptions - The options to pass to the AWS Secrets Manager client
   * @param inlineCache - Whether to use an inline cache or not
   */
  public constructor(awsSecretsManagerOptions: SecretsManagerClientConfig, inlineCache = true) {
    this.awsSecretsManager = new AWSClientSecretsManager(awsSecretsManagerOptions);

    if (inlineCache) {
      this.cacheDecorator = new InMemoryCacheSecretsManagerDecorator(this);
    }
  }

  /**
   * Whether the secrets manager instance has an inline cache or not
   */
  public get hasInlineCache(): boolean {
    return Boolean(this.cacheDecorator);
  }

  /**
   * Get the secret value from the cache (if inlineCache is enabled) or from the secrets manager
   *
   * @param secretId - The secret id to retrieve
   * @param bypassCache - Whether to bypass the cache or not
   * @returns The secret value
   */
  public async getSecretValue<T>(secretId: string, bypassCache = false): Promise<T> {
    if (this.cacheDecorator && !bypassCache) {
      return this.cacheDecorator.getSecretValue<T>(secretId);
    }

    try {
      const data = await this.awsSecretsManager.getSecretValue({
        SecretId: secretId,
      });

      if (!data?.SecretString && !data.SecretBinary) {
        throw new SecretNotFoundError();
      }

      if (data.SecretString) {
        return this.safeJsonParse(data.SecretString);
      }

      const bufferBinarySecret = Buffer.from(data.SecretBinary!);
      const decodedBinarySecret = bufferBinarySecret.toString('utf8');

      return this.safeJsonParse(decodedBinarySecret);
    } catch (error) {
      const castedErr = error as Error | JsonParseError | SecretNotFoundError;

      if (castedErr.name === 'SecretNotFoundError' || castedErr.name === 'JsonParseError') {
        throw castedErr;
      }

      throw new SecretManagerError(error);
    }
  }

  /**
   * Safely parse a JSON string
   *
   * @param jsonString - String to parse
   * @returns Parsed JSON
   */
  private safeJsonParse<T>(jsonString: string): Awaited<T> {
    try {
      return JSON.parse(jsonString);
    } catch {
      throw new JsonParseError();
    }
  }
}
