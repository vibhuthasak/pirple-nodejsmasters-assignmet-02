// This is the configuration file

var environments = {};

// Staging environment
environments.staging = {
  'port': 3000,
  'envName': 'staging',
  'hashingSecret' : 'thisIsMySecret',
  'stripeSkey': 'sk_test_4eC39HqLyjWDarjtT1zdp7dc',
  'mailgun': {
    'username': 'api',
    'password': '675defeb9765847066f37fadeccba5d5-b9c15f4c-c7310b91'
  }
};

environments.production = {
  'port': 8000,
  'envName': 'production',
  'hashingSecret' : 'thisIsMySecret'
};

// Get ENV from process. On default staging
const currentEnv = (typeof (process.env.NODE_ENV) === 'string') ? process.env.NODE_ENV.toLowerCase() : 'staging';
var envToExport = '';

if (typeof (environments[currentEnv]) === 'object') {
  envToExport = environments[currentEnv]
}

module.exports = envToExport;