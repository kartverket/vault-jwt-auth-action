const core = require('@github/core');
const axios = require('axios');
const https = require('https');

// Get input values for action
var vaultaddr = core.getInput('vaultaddr');
var role = core.getInput('role');
var path = core.getInput('path');
var cert = '';

//Checking if ca-cert is provided.
var cb64 = core.getInput('certb64');
if (cb64 != '') {
  var cert = Buffer.from(cb64, 'base64').toString('utf-8');
}
   
async function makeRequest() {
    let token;
    try {
      token = await core.getIDToken();
    } catch (error) {
      console.error(error);
      core.setFailed(`Failed to fetch JWT: ${error}`);
      return;
    }

    // Set up config for request to vault
    const config = {
        method: 'post',
        url: `${vaultaddr}/v1/auth/${path}/login`,
        data: { 
            'jwt': token,
            'role': role,
        }
    }

    if (cert) {
      https.globalAgent.options.ca = cert;
    }

    // Make request to vault with config from prev step
    try {
      const result = await axios(config)
      core.exportVariable('VAULT_TOKEN', result.data.auth.client_token);
    } catch (error) {
      core.setFailed('Somthing went wrong in vault request function');
      
      if (error.response) {
        console.error(error.response.data);
        console.error(error.response.status);
        console.error(error.response.headers);
      }
    }
}

makeRequest();
