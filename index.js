const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

const cb64 = core.getInput(certb64);

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

https.globalAgent.options.ca = cert  // trusting CA

//Fetching variables
const vaultaddr = core.getInput(vaultaddr)
const role = core.getInput(role)
const path = core.getInput(path)

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
    let res = await axios(config)
    

    //Printing result
    console.log(res);
}

makeRequest();
