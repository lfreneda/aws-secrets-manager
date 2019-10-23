const { SecretsManager } = require('../src/')

const run = async () => {
  const secretManager = new SecretsManager({
    region: 'us-east-1'
  })
  const secretValue = await secretManager.getSecretValue('sample/key')
  console.log(JSON.stringify(secretValue, null, 2))
}

run()
