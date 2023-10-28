import { describe, expect, it } from 'vitest';
import { toConnectionString } from '../src/toConnectionString.js';

describe('Postgres', () => {
  it('Given stored secret for rds credentials and ssl option as true should convert to connectionString', () => {
    const connectionString = toConnectionString(
      {
        username: 'username',
        password: 'shhhhhhhh',
        engine: 'postgres',
        host: 'host.us-east-1.rds.amazonaws.com',
        port: 5_432,
        dbname: 'dbname',
        dbInstanceIdentifier: 'dbInstanceIdentifier',
      },
      {
        ssl: true,
      },
    );
    expect(connectionString).toBe(
      'postgres://username:shhhhhhhh@host.us-east-1.rds.amazonaws.com:5432/dbname?ssl=true',
    );
  });

  it('Given stored secret for rds credentials and ssl option as false should convert to connectionString', () => {
    const connectionString = toConnectionString({
      username: 'username',
      password: 'shhhhhhhh',
      engine: 'postgres',
      host: 'host.us-east-1.rds.amazonaws.com',
      port: 5_432,
      dbname: 'dbname',
      dbInstanceIdentifier: 'dbInstanceIdentifier',
    });
    expect(connectionString).toBe('postgres://username:shhhhhhhh@host.us-east-1.rds.amazonaws.com:5432/dbname');
  });

  it('Given stored secret for rds credentials without password and ssl option as true should convert to connectionString', () => {
    const connectionString = toConnectionString(
      {
        username: 'username',
        engine: 'postgres',
        host: 'host.us-east-1.rds.amazonaws.com',
        port: 5_432,
        dbname: 'dbname',
        dbInstanceIdentifier: 'dbInstanceIdentifier',
      },
      {
        ssl: true,
      },
    );
    expect(connectionString).toBe('postgres://username@host.us-east-1.rds.amazonaws.com:5432/dbname?ssl=true');
  });

  it('Given stored secret for mysql credentials and ssl option as true should throw an error', () => {
    expect(() => {
      toConnectionString(
        {
          username: 'username',
          password: 'shhhhhhhh',
          engine: 'mysql',
          host: 'host.us-east-1.rds.amazonaws.com',
          port: 3_306,
          dbname: 'dbname',
          dbInstanceIdentifier: 'dbInstanceIdentifier',
        },
        {
          ssl: true,
        },
      );
    }).toThrow('Engine mysql supported, check docs and PR are welcome @lfreneda/aws-secrets-manager');
  });
});
