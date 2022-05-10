const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');
const https = require('https')


const cb64 = core.getInput('certb64');
const vaultaddr = core.getInput('vaultaddr')
const role = core.getInput('role')
const path = core.getInput('path')

const cert = Buffer.from(cb64, 'base64').toString('utf-8')

async function jwt() {
    try {
      
      // Get aud and request token
      const aud = core.getInput('aud');
      const jwt = await core.getIDToken(aud);
      // core.setOutput("jwt", jwt);
      return jwt
      // Get the JSON webhook payload for the event that triggered the workflow
      const payload = JSON.stringify(github.context.payload, undefined, 2)
      console.log(`The event payload: ${payload}`);
    } catch (error) {
      core.setFailed(error.message);
    }
    }

    

async function makeRequest() {
    // Wait for jwt to be fetched
    // trusting CA
    https.globalAgent.options.ca = cert;
    const token = await jwt()
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
    axios(config).then(result => console.log(result.code)).catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });

    //process.env['VAULT_TOKEN'] = result.data.somethingsomething
    
}

makeRequest();
