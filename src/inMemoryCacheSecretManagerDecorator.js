const NodeCache = require('node-cache')
const secretValueCache = new NodeCache({
  stdTTL: 300,
  useClones: true
})

class InMemoryCacheSecretManagerDecorator {
  constructor (secretsManager) {
    this.secretsManager = secretsManager
  }

  async getScrectValue (secretId) {
    let secretValue = secretValueCache.get(`aws:secret:${secretId}`)
    if (secretValue) {
      return secretValue
    }
    secretValue = await this.secretsManager.getSecret(secretId)
    secretValueCache.set(`aws:secret:${secretId}`, secretValue)
    return secretValue
  }
}

module.exports = InMemoryCacheSecretManagerDecorator
