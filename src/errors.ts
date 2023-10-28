/**
 * Error thrown when the engine is not supported by the toConnectionString function
 */
export class EngineNotSupportedError extends Error {
  public constructor(engine: string) {
    super(`Engine ${engine} supported, check docs and PR are welcome @lfreneda/aws-secrets-manager`);
    this.name = 'EngineNotSupportedError';
  }
}

/**
 * Error thrown when there is an error fetching the secret from AWS Secrets Manager
 */
export class SecretManagerError extends Error {
  public constructor(err: any) {
    super('There was an error fetching the secret from AWS Secrets Manager.', err);
    this.name = 'SecretManagerError';
  }
}

/**
 * Error thrown when the requested secret was not found
 */
export class SecretNotFoundError extends Error {
  public constructor() {
    super('The requested secret was not found.');
    this.name = 'SecretNotFoundError';
  }
}

/**
 * Error thrown when there is an error parsing the JSON string from the secret
 */
export class JsonParseError extends Error {
  public constructor() {
    super('There was an error parsing the JSON string from the secret.');
    this.name = 'JsonParseError';
  }
}

/**
 * Error thrown when instantiating a new InMemoryCacheSecretsManagerDecorator with an secretsManager instance that already has an inline cache
 */
export class DuplicatedCacheInstanceError extends Error {
  public constructor() {
    super(
      'The secret manager specified already has an inline cache instance, disable the inline cache or use a different secret manager instance.',
    );
    this.name = 'DuplicatedCacheInstanceError';
  }
}
