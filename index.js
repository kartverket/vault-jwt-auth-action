const core = require('@actions/core');
const github = require('@actions/github');
const request = require('request');

const certb64 = 'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURoakNDQW02Z0F3SUJBZ0lRSHhRNCszNDQ1TFJDazN6ZlVUUENPekFOQmdrcWhraUc5dzBCQVFzRkFEQkwKTVJJd0VBWUtDWkltaVpQeUxHUUJHUllDYm04eEdEQVdCZ29Ka2lhSmsvSXNaQUVaRmdoemRHRjBhMkZ5ZERFYgpNQmtHQTFVRUF4TVNTMkZ5ZEhabGNtdGxkQ0JTYjI5MElFTkJNQjRYRFRFMk1ETXlNakUwTURJek0xb1hEVFEyCk1ETXlNakUwTVRJek0xb3dTekVTTUJBR0NnbVNKb21UOGl4a0FSa1dBbTV2TVJnd0ZnWUtDWkltaVpQeUxHUUIKR1JZSWMzUmhkR3RoY25ReEd6QVpCZ05WQkFNVEVrdGhjblIyWlhKclpYUWdVbTl2ZENCRFFUQ0NBU0l3RFFZSgpLb1pJaHZjTkFRRUJCUUFEZ2dFUEFEQ0NBUW9DZ2dFQkFKSjBaMWExNEpYblkxSUptaDgweGgwSFhKZmZZZ2lXCjVFRGtxOUVFUXRPYk1SUlVDbm16aUlDQ3lPM3hLQUdqWEJ1aFowL21vVUJnUXFwbWtDSlIvQ1pubnNJMVZ6QVkKMHNPbWlRaFVNSVdCUzhDRkltVWNoTmJOREM1SzZYVStwNGZodWxFN0lPL3FTZDd3V2dNSFZLdUE5eVBvVFJsMwowaVpZdG5IcUlCb3dZS3dJVHBBSmpwME5hTmNIalY2TWVOdlBrR1RURk45S1MxcG53QjhZVnFVYUZXdDJGVDh1CjBSTE9kUUgyeFFva1l4YW1RRWNqaEFBSnlzVDdkK25YemRzYUEwYXQrYlNwUExxTURVOW5JZFpuRGc1TlgyY0oKcnNlRm5tWTJ3Q2NLL2tMUUpVSWxSQVQ0UHI5Y08rZDRvSytRTFFOaGZpVmxUa0RaZU1ISHhia0NBd0VBQWFObQpNR1F3RXdZSkt3WUJCQUdDTnhRQ0JBWWVCQUJEQUVFd0N3WURWUjBQQkFRREFnR0dNQThHQTFVZEV3RUIvd1FGCk1BTUJBZjh3SFFZRFZSME9CQllFRk5xNUhyME9mV3kzbWMvckxXUEZrMHpmSWhlck1CQUdDU3NHQVFRQmdqY1YKQVFRREFnRUFNQTBHQ1NxR1NJYjNEUUVCQ3dVQUE0SUJBUUJkdHFVbDdvWFFTYWxIWjh6Y2dRZllvZWVxTGNwRQp5RjhFUngwdnFQc0hmY2VnL0ZXZEhFUVh4TWtPN1JER1Fzb2NmTVZvR0FBT1R3VlFPTHZCNmg4MnhCRVozSjBqCjBGMWkvcSs0WEd2NjdvOW43Z2NLNUFGOVNhcy9MVFB4N3dqQjV2dS85TkxyRkE1eXgyUG1iRnpNNFZRcXkwZnQKd2loaTdxMlhoQlVYUGo0SEdhTVE2aE1CYkRhSVl0Z0ovWWlkTFpSeGZWQVpGVEN4UDlPcDZVR3d0Zi9DeHdPSQo5ZkxtaWIwUDZCWG9sR3h1eU5XdHU2K0Vxc1JtMGtvcE5jcDkyZWpiOGsyb3R4VWdRcGNoVzRwd2RLMWZ3azhECndVblY5emhTc2k5eVZGMVVRUDZRcEJCeFNDZE5PT3JSSEg0N1djZmF0VUg0SWhuQW9PS0VyUVpBCi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K';

var cert = Buffer.from(certb64, 'base64').toString('utf-8');

console.log(cert)

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
    const options = {
        uri: vaultaddr,
        ca: cert
    }
    request(options, { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        console.log(body.url);
        console.log(body);
      });
}

httpsreq();