import { EngineNotSupportedError } from './errors.js';

export interface RdsSecretValue {
  dbInstanceIdentifier?: string;
  dbname: string;
  engine: string;
  host: string;
  password?: string;
  port?: number;
  username: string;
}

export interface ToConnectionStringOptions {
  ssl?: boolean;
}

/**
 * Utility function to convert a RDS secret value to a connection string.
 *
 * @param rdsSecretValue - The secret value returned by AWS Secrets Manager.
 * @param options - Options to be passed to the connection string.
 * @returns The connection string.
 */
export function toConnectionString(rdsSecretValue: RdsSecretValue, options?: ToConnectionStringOptions): string {
  const isPg = rdsSecretValue.engine && rdsSecretValue.engine === 'postgres';
  if (!isPg) {
    throw new EngineNotSupportedError(rdsSecretValue.engine);
  }

  const connectionString = [`postgres://${rdsSecretValue.username}`];

  if (rdsSecretValue.password) {
    connectionString.push(`:${rdsSecretValue.password}`);
  }

  connectionString.push(`@${rdsSecretValue.host}`);

  if (rdsSecretValue.port) {
    connectionString.push(`:${rdsSecretValue.port}`);
  }

  connectionString.push(`/${rdsSecretValue.dbname}`);

  if (options?.ssl) {
    connectionString.push('?ssl=true');
  }

  return connectionString.join('');
}
