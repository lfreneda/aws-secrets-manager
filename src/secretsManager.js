const aws = require('aws-sdk')

class SecretManager {
  constructor (awsSecretsManagerOptions) {
    this.awsSecretsManager = new aws.SecretsManager(awsSecretsManagerOptions)
  }

  async getScrectValue (secretId) {
    try {
      const data = await this.clientSecretsManager.getSecretValue({
        SecretId: secretId
      }).promise()

      if ('SecretString' in data) {
        const secretValue = JSON.parse(data.SecretString)
        return secretValue
      } else {
        const buffer = Buffer.from(data.SecretBinary, 'base64')
        const decodedBinarySecret = buffer.toString('ascii')
        const secretValue = JSON.parse(decodedBinarySecret)
        return secretValue
      }
    } catch (err) {
      console.log('SecretManager err:', err)
      throw err
    }
  }
}

module.exports = SecretManager
