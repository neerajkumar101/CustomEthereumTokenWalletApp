var BaseService = require('./BaseService');
var fs = require('fs');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

var Token = '0x804dd6f85a26789f55b77ee3efcb03d147371c0d';
var TokenController = '0x91f0b811b2b677dabedf029acd0630e0adcc800e';

var coinbase = '0x78edc8554640e597214b04e6fc6bcc6bf5647d83';
userService = function(app) {
    this.app = app;
};

userService.prototype = new BaseService();

userService.prototype.home = function(res, callback) {
    res.send('NodeJS demo app by Neeraj Kumar Rajput.');
    callback(null, null);
}

userService.prototype.setUpDeploy = function(res, callback) {
    async.auto({
        TokenSmartContractInstance: function(next) {
            deployExistingSmartContract(next, Token, 'Token', function(error, result){
                if(error != undefined){
                    res.send(error);
                } else {
                    next(null, result);
                }
            });
        },
        TokenControllerSmartContractInstance: ['TokenSmartContractInstance', function(results, next) {
            console.log('results: ' + results);
            var promOb = deployExistingSmartContract(next, TokenController, 'TokenController', function(error, result){
                if(error != undefined){
                    res.send(error);
                } else {
                    next(null, result);                    
                }
            });
        }],
        SetToken: ['TokenControllerSmartContractInstance', function(results, next) {
            setToken(next, results.TokenControllerSmartContractInstance, Token, function(error, result){
                if(error != undefined){
                    res.send(error);
                } else {
                    next(null, result);                    
                }
            });
        }],
        SetMaxSupply: ['SetToken', function(results, next) {
            setMaxSupply(next, results.TokenSmartContractInstance, '1000000000000000000000000000', function(error, result){
                if(error != undefined){
                    res.send(error);
                } else {
                    next(null, result);                    
                }
            });
        }],
        SetPricesForTokensPerEth: ['SetMaxSupply', function(results, next) {
            setPricesForTokensPerEth(next, results.TokenControllerSmartContractInstance, '10000', '10100', function(error, result){
                if(error != undefined){
                    res.send(error);
                } else {
                    next(null, result);                    
                }
            });
        }]

    }, function(err, success) {
        console.log("success", success)
        if (err) {
            console.log("error")
            callback(err, null);
        } else {
            console.log("success")
            callback(null, success);
        }
    });
}
userService.prototype.getTokenBalance = function(req, res, callback) {
    console.log(req.body.address);
    
}
userService.prototype.startFirstICOSale = function(res, callback) {
    // ICOControllerMonolith.deployed().then(function(deployed) { deployed.startFirstSale.sendTransaction(100).then(function(hash) { console.log(hash) }) });
    async.auto({
        ICOControllerMonolithSmartContractInstance: function(next) {
            deployExistingSmartContract(next, ICO, 'ICO');
        },
        StartSale: ['ICOControllerMonolithSmartContractInstance', function(results, next) {
            var deployed = results.ICOControllerMonolithSmartContractInstance;
            // deployed.startFirstSale.call('100');
            // var hash = deployed.startFirstSale.getData('100');
            // console.log(deployed.setAuctionLauncher.getData(icoAddress));
            var transfer = deployed.startFirstSale.call(100)
            next(null, "StartSale done")
        }],
    }, function(err, success) {
        console.log(success, "success")
        if (err) {
            console.log("error")
            callback(err, null);
        } else {
            console.log("success")
            callback(null, success);
        }
    });
}

function setToken(next, deployed, Token, callback) {
    var hash = deployed.setToken.getData(Token);
    var transfer = deployed._eth.sendTransaction({ from: coinbase, to: deployed.address, data: hash })
    var transactionHash = {
        getData: hash,
        sendTransaction: transfer
    }
    callback(null, transactionHash);
}

function setMaxSupply(next, deployed, maxSupply, callback) {
    var hash = deployed.setMaxSupply.getData(maxSupply);
    var transfer = deployed._eth.sendTransaction({ from: coinbase, to: deployed.address, data: hash })
    var transactionHash = {
        getData: hash,
        sendTransaction: transfer
    }
    callback(null, transactionHash);
}

function setPricesForTokensPerEth(next, deployed, sellPrice, buyPrice, callback){
    var hash = deployed.setPricesForTokensPerEth.getData(sellPrice, buyPrice);
    var transfer = deployed._eth.sendTransaction({ from: coinbase, to: deployed.address, data: hash })
    var transactionHash = {
        getData: hash,
        sendTransaction: transfer
    }
    callback(null, transactionHash);
}

function getTokenBalance(next, deployed, accountAddress, callback) {
    var tokenBal = deployed.getTokenBalance(accountAddress);
    callback(null, tokenBal); 
}

function setAsTest(next, deployed, icoAddress) {
    var transfer = deployed.setAsTest.sendTransaction({ from: coinbase });
    var setAsTest = {
        getData: transfer
    }
    next(null, setAsTest)
}

function setController(next, deployed, icoAddress) {
    var hash = deployed.setController.getData(icoAddress);
    var transfer = deployed._eth.sendTransaction({ from: coinbase, to: deployed.address, data: hash })
    var setController = {
        getData: hash,
        sendTransaction: transfer
    }
    next(null, setController)
}

function setFirstSaleLauncher(next, deployed, icoAddress) {
    var hash = deployed.setFirstSaleLauncher.getData(icoAddress);
    var transfer = deployed._eth.sendTransaction({ from: coinbase, to: deployed.address, data: hash })
    var setFirstSaleLauncher = {
        getData: hash,
        sendTransaction: transfer
    }
    next(null, setFirstSaleLauncher)
}

function setAuctionLauncher(next, deployed, icoAddress) {
    var hash = deployed.setAuctionLauncher.getData(icoAddress);
    var transfer = deployed._eth.sendTransaction({ from: coinbase, to: deployed.address, data: hash })
    var setAuctionLauncher = {
        getData: hash,
        sendTransaction: transfer
    }
    next(null, setAuctionLauncher)
}

function setAdvisor(next, deployed, icoAddress) {
    var hash = deployed.setAdvisor.getData(icoAddress);
    var transfer = deployed._eth.sendTransaction({ from: coinbase, to: deployed.address, data: hash })
    var setAdvisor = {
        getData: hash,
        sendTransaction: transfer
    }
    next(null, setAdvisor)
}

function sendTransaction(next, from, to, smartContractAddress, contractInstance) {
    async.auto({
        getData: function(nextAgain) {
            getData(nextAgain, smartContractAddress);
        },
        tranfer: ['getData', function(results, nextAgain) {
            tranfer(nextAgain, from, to, smartContractAddress, contractInstance, results.getData);
        }]

    }, function(err, success) {
        console.log("success", success)
        if (err) {
            console.log("error")
            next(err, null);
        } else {
            console.log("success")
            next(null, success);
        }
    });
}

function setFakeTime(next, deployed) {
    var transfer = deployed.setFakeTime.call('1');
    var setFakeTime = {
        sendTransaction: transfer
    }
    next(null, setFakeTime);
}

function getData(nextAgain, smartContractAddress, contractInstance) {
    var hash = contractInstance.getData(smartContractAddress)
    console.log(hash, "getData")
    nextAgain(null, hash)
}

function tranfer(next, from, to, smartContractAddress, contractInstance, data) {
    var hash = nextAgain._eth.sendTransaction({ from: from, to: to, data: data })
    console.log(hash, "tranfer")
    nextAgain(null, hash)
}

var unlockAccount = function(owner, password) {
    return new Promise((resolve, reject) => {
        var unlockFlag = web3.personal.unlockAccount(owner, password);
        if (unlockFlag) {
            resolve(unlockFlag);
        } else {
            reject(unlockFlag);
        }
    });
}

var deployExistingSmartContract = (next, smartContractAddress, contractName, callback) => {
    var promOb = new Promise((resolve, reject) => {
        // fs.readFile(__dirname + '/../contractsJson/' + contractName + '.json', 'utf8', function(error, abiRetrieved) {
        fs.readFile(__dirname + '/../../../build/contracts/' + contractName + '.json', 'utf8', function(error, abiRetrieved) {            
            if (error) {
                console.log("error in reading abi file: ", error);
                reject(error);
                // next(error, null);
            } else {
                console.log(abiRetrieved, "abiRetrieved")
                    // var unlockProm = unlockAccount('0x7de3e5981305f6c8871b8ed0fcefafc2787db074', '12345');
                    // unlockProm.then(() => {

                //     // callback(null, contractInstance);
                //     resolve(contractInstance);
                //     next(null, contractInstance)
                // }).catch((error) => {
                //     console.log('unlock inside deployexistingcontract error is here');
                //     console.log(error);
                //     return;
                // });

                var abiJson = JSON.parse(abiRetrieved);
                myContract = web3.eth.contract(abiJson.abi);
                var contractInstance = myContract.at(smartContractAddress);
                
                console.log('===============================================================');
                console.log(contractInstance);
                console.log('===============================================================');
                
                resolve(null, contractInstance); // useful only when someone handles the promise itself
                callback(null, contractInstance); // we are only handling through callbacks
            }
        });
    });
    return promOb;
}

module.exports = function(app) {
    return new userService(app);
};