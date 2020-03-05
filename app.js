/*
Below is an integration flow on how to use Cashfree's payouts SDK. The SDK can be found at: https://github.com/cashfree/cashfree-sdk-nodejs
Please go through the payout docs here: https://dev.cashfree.com/payouts

The following script contains the following functionalities :
    1. Transfers.RequestBatchTransfer -> request a batch transfer
    2. Transfers.GetBatchTransfer -> get the status of the requested batch transfer
*/

const cfSdk = require('cashfree-sdk');
const util = require('util');

const config = {
    Payouts:{
    ClientID: "client_id",
    ClientSecret: "client_secret",
    ENV: "TEST", 
    }
};

const {Payouts} = cfSdk;
const {Transfers} = Payouts;

const BatchTransfer = {
    "batchTransferId" : "Test_Bank_Account_Format_60",
    "batchFormat": "BANK_ACCOUNT",
    "deleteBene" : 1, 
    "batch" : [
        {"transferId" : "PTM_00121244328723", 
        "amount" : "12",
        "phone" : "9999999999",
        "bankAccount" : "00011020001772", 
        "ifsc" : "HDFC0000001",
        "email" : "bahrat@gocashfree.com", 
        "name": "bharat"}
        ]
    };

(async function(){
    try{
        Payouts.Init(config.Payouts);
        try{
            const result = await Transfers.RequestBatchTransfer(BatchTransfer);
            console.log("request batch transfer result:", result);
        }
        catch(err){
            console.log("err caught in requesting batch transfer");
            console.log(err);
            return;
        }
        try{
            const result = await Transfers.GetBatchTransferStatus({
                batchTransferId: BatchTransfer.batchTransferId,
            });
            console.log("get batch transfer status result:", util.inspect(result, {showHidden: false, depth: null}));
            //To print the object un comment below line.
            //console.log("get batch transfer status result:", result);
        }
        catch(err){
            console.log("err caught in getting batch transfer status");
            console.log(err);
            return;
        }
        
        
    }
    catch(err){
        console.log("err caught in main flow");
        console.log(err);
    }

})();
