const toConnectionString = (rdsSecretValue, options) => {
  const isPg = rdsSecretValue.engine && rdsSecretValue.engine === 'postgres'
  if (!isPg) {
    throw new Error(`engine ${rdsSecretValue.engine} supported, check docs and PR are welcome @ https://github.com/lfreneda/aws-secrets-manager`)
  }
  let connectionString = `postgres://${rdsSecretValue.username}`
  connectionString += `:${rdsSecretValue.password}`
  connectionString += `@${rdsSecretValue.host}`
  connectionString += `:${rdsSecretValue.port}`
  connectionString += `/${rdsSecretValue.dbname}`
  if (options && options.ssl) {
    connectionString += '?ssl=true'
  }
  return connectionString
}

module.exports = toConnectionString
