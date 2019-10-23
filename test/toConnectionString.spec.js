/* eslint-disable
    no-undef,
    no-unused-vars,
*/
const toConnectionString = require('./../src/toConnectionString')

describe('Postgres', () => {
  test('Given stored secret for rds credentials and ssl option as true should convert to connectionString', () => {
    const connectionString = toConnectionString({
      username: 'username',
      password: 'shhhhhhhh',
      engine: 'postgres',
      host: 'host.us-east-1.rds.amazonaws.com',
      port: 5432,
      dbname: 'dbname',
      dbInstanceIdentifier: 'dbInstanceIdentifier'
    }, {
      ssl: true
    })
    expect(connectionString).toBe('postgres://username:shhhhhhhh@host.us-east-1.rds.amazonaws.com:5432/dbname?ssl=true')
  })

  test('Given stored secret for rds credentials and ssl option as false should convert to connectionString', () => {
    const connectionString = toConnectionString({
      username: 'username',
      password: 'shhhhhhhh',
      engine: 'postgres',
      host: 'host.us-east-1.rds.amazonaws.com',
      port: 5432,
      dbname: 'dbname',
      dbInstanceIdentifier: 'dbInstanceIdentifier'
    })
    expect(connectionString).toBe('postgres://username:shhhhhhhh@host.us-east-1.rds.amazonaws.com:5432/dbname')
  })
})
