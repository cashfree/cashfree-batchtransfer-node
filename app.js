/*
Below is an integration flow on how to use Cashfree's payouts.
Please go through the payout docs here: https://docs.cashfree.com/docs/payout/guide/

The following script contains the following functionalities :
    1.getToken() -> to get auth token to be used in all following calls. 


All the data used by the script can be found in the config.ini file. This includes the clientId, clientSecret, Beneficiary object, Transaction Object.
You can change keep changing the values in the config file and running the script.
Please enter your clientId and clientSecret, along with the appropriate enviornment, beneficiary details and request details
*/

const util = require('util');
const request = require("request");

const postAsync = util.promisify(request.post);
const getAsync = util.promisify(request.get);

const config = require('./config.json');

const {env, url, clientId, clientSecret} = config;
const baseUrl = config["baseUrl"][env];
const headers = {
    "X-Client-Id": clientId,
    "X-Client-Secret": clientSecret
}

//helper function to create the options that will be passed to the https/request library
function createOptions(action, headers, json){
    const finalUrl = baseUrl + url[action];
    json = json? json: {};
    return {url: finalUrl, headers, json};
}

function createHeader(token){
    return {...headers, 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token};
}

async function getToken(){
    try{
        const r = await postAsync(createOptions('auth', headers));
        const {status, subCode, message} = r.body;
        if(status !== 'SUCCESS' || subCode !== '200') throw {name: "incorectResponseError", message: "incorrect response recieved: " + message};
        const {data: {token}} = r.body;
        return token;
    }
    catch(err){
        console.log("err in getting token");
        throw err;
    }
}

async function requestBatchTransfer(token){
    try{
        const {BatchTransfer} = config;
        if(!BatchTransfer) {throw {name: "validation error", message: "Batch transfer details missing"}};
        const r = await postAsync(createOptions('requestBatchTransfer', createHeader(token) , BatchTransfer));
        const {status, subCode, message} = r.body;
        if(status !== 'SUCCESS' || subCode !== '200') throw {name: "incorectResponseError", message: "incorrect response recieved: " + message};
    }
    catch(err){
        console.log("err in requesting batch transfer");
        throw err;
    }
}

async function getBatchTransferStatus(token){
    try {
        const {BatchTransfer: {batchTransferId}} = config;
        if(!batchTransferId){ throw {name: "validation error", message: "batch transfer id missing"}};
        const finalUrl = baseUrl + url['getBatchTransferStatus'] + batchTransferId;
        const r = await getAsync(finalUrl, {headers: createHeader(token)});
        const {status, subCode, message} = JSON.parse(r.body);
        if(status !== 'SUCCESS' || subCode !== '200') throw {name: "incorectResponseError", message: "incorrect response recieved: " + message};
        console.log(JSON.parse(r.body));
    } 
    catch(err){
        console.log("err in getting batch transfer status");
        throw err;
    }
}


//main execution loop
(async () => {
    try{
        const token = await getToken();
        await requestBatchTransfer(token);
        await getBatchTransferStatus(token);
    }
    catch(err){
        console.log("err caught in main loop");
        console.log(err);
    }
})();