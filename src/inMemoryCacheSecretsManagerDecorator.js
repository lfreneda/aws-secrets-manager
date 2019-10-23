const NodeCache = require('node-cache')
const secretValueCache = new NodeCache({
  stdTTL: 300,
  useClones: true
})

class InMemoryCacheSecretsManagerDecorator {
  constructor (secretsManager) {
    this.secretsManager = secretsManager
  }

  async getSecretValue (secretId) {
    let secretValue = secretValueCache.get(`aws:secret:${secretId}`)
    if (secretValue) {
      return secretValue
    }
    secretValue = await this.secretsManager.getSecretValue(secretId)
    secretValueCache.set(`aws:secret:${secretId}`, secretValue)
    return secretValue
  }
}

module.exports = InMemoryCacheSecretsManagerDecorator
