const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');
const https = require('https')


//Fetching input values from action

var vaultaddr = core.getInput('vaultaddr')
var role = core.getInput('role')
var path = core.getInput('path')
var cert = ''

//Checking if ca-cert is provided.
var cb64 = core.getInput('certb64');
if (cb64 != '') {
var cert = Buffer.from(cb64, 'base64').toString('utf-8')
}


async function fetchjwt() {
    try {
      // Request token
      const jwt = await core.getIDToken();

      return jwt
    } catch (error) {
      console.log('Something broke in the jwt function')
      core.setFailed(error);
    }
}

const tokenpromise = fetchjwt();
   

async function makeRequest() {

    // trusting CA if provided.
    if (cert) {
    https.globalAgent.options.ca = cert;
    }
    const token = await tokenpromise;

    //Setting up config for requeset to vault
    const config = {
        method: 'post',
        url: `${vaultaddr}/v1/auth/${path}/login`,
        data: { 
            'jwt': token,
            'role': role 
        }
    }
    
    //Making request to vault with config from prev step
    try {
      const result = await axios(config)
      process.env.VAULT_TOKEN = result.data.auth.client_token
      console.log(result)
    } catch (error) {
      console.log('Somthing went wrong in vault request function')
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    }
}

makeRequest();
