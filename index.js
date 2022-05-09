const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');
const https = require('https')

var cb64 = core.getInput('certb64');
   


var vaultaddr = core.getInput('vaultaddr')
var role = core.getInput('role')
var path = core.getInput('path')

var cert = Buffer.from(cb64, 'base64').toString('utf-8')

console.log(cert)

async function jwt() {
    try {
        // Fetching github token
        const jwt = await core.getIDToken();
        core.setOutput("jwt", jwt);
      
      
        // Get the JSON webhook payload for workflow.
        const payload = JSON.stringify(github.context.payload, undefined, 2)
        console.log(`Event JWT obtained maybe?`);

    //Printing error messages.    
    } catch (error) {
        core.setFailed(error.message);
      }    
}

jwt();


// trusting CA
const httpsAgent = new https.Agent({
    ca: cert,
  });

async function makeRequest() {
    // Wait for jwt to be fetched
    await jwt();

    //Setting up config for requeset to vault
    const config = {
        method: 'post',
        url: `${vaultaddr}/v1/auth/${path}/login`,
        data: { 
            'jwt': jwt,
            'role': role 
        }
    }

    //Making request to vault with config from prev step
    axios(config, { httpsAgent: httpsAgent }).then(result => console.log(result))
    
}

makeRequest();

/*
const httpsAgent = new https.Agent({
    ca: ''
  });

async function httpsrequest() {
    const config = {
        method: 'get',
        url: 'https://vg.no',
    }

    axios(config, { httpsAgent }).then(response => console.log(response));
    


}

httpsrequest();
*/