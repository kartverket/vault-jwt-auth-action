const core = require('@actions/core');
const github = require('@actions/github');
const request = require('request');

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; //Testing purposes only

async function jwt() {
    try {
        // Fetching github token
        const jwt = await core.getIDToken();
        core.setOutput("jwt", jwt);
      
      
        // Get the JSON webhook payload for workflow.
        const payload = JSON.stringify(github.context.payload, undefined, 2)
        console.log(`Event JWT obtained maybe?`);
    } catch (error) {
        core.setFailed(error.message);
      }    
}



async function httpsreq() {
    const vaultaddr = core.getInput('vaultaddr')

    await jwt();

    request(vaultaddr, { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        console.log(body.url);
        console.log(body.explanation);
      });
}

httpsreq();