const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');
const https = require('https')


const cb64 = core.getInput('certb64');
const vaultaddr = core.getInput('vaultaddr')
const role = core.getInput('role')
const path = core.getInput('path')

const cert = Buffer.from(cb64, 'base64').toString('utf-8')

async function fetchjwt() {
    try {
      // Get aud and request token
      const jwt = await core.getIDToken();

      core.setOutput("jwt", jwt);

      console.log('this is the jwt: ' , jwt)
      return jwt
    } catch (error) {
      console.log('something broke in the jwt function')
      core.setFailed(error);
    }
}

    

async function makeRequest() {
    // trusting CA
    https.globalAgent.options.ca = cert;

    const token = await fetchjwt()
    console.log('this is the token: ' , token)
    //Setting up config for requeset to vault
    /*
    const config = {
        method: 'post',
        url: `${vaultaddr}/v1/auth/${path}/login`,
        data: { 
            'jwt': token,
            'role': role 
        }
    }
    
    //Making request to vault with config from prev step
    
    
    axios(config).then(result => console.log(result)).catch(function (error) {
        console.log('vault function')
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
    */
    //process.env['VAULT_TOKEN'] = result.data.somethingsomething
    
}

makeRequest();
