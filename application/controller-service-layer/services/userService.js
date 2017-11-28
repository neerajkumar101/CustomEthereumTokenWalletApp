var BaseService = require('./BaseService');
var fs = require('fs');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

var Token = '0xfe4030191bd8501613b7bb1cdc839d82a1cede8b';
var TokenController = '0x9d6e5e7bc029464fc0031234fa7cc086a3157eca';

var coinbase = '0x0f6650512d6d4580ef0c9eb683d01ff7367b6d5c';
userService = function(app) {
    this.app = app;
};

userService.prototype = new BaseService();

userService.prototype.home = function(res, callback) {
    res.send('NodeJS demo app by Neeraj Kumar Rajput.');
    callback(null, null);
}
global.TokenContract;
global.TokenControllerContract;

userService.prototype.setUpDeploy = function(res, callback) {
    async.auto({
        TokenSmartContractInstance: function(next) {
            deployExistingSmartContract(next, Token, 'Token', function(error, result){
                if(error != undefined){
                    res.send(error);
                } else {
                    global.TokenContract = result;
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
                    global.TokenControllerContract = result;                    
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

userService.prototype.setMaxSupply = function(req, res, callback) {
    setMaxSupply(global.TokenContract, req.body.maxSupply, function(error, result){
        if(error != undefined){
            res.send(error);
        } else {
            res.send('Successfully set the maxSupply' + result);
        }
    });
}

userService.prototype.setPricesForTokensPerEth = function(req, res, callback) {
    setPricesForTokensPerEth(global.TokenControllerContract, req.body.sellPrice, req.body.buyPrice, function(error, result){
        if(error != undefined){
            res.send(error);
        } else {
            res.send('Successfully set the buy price and sell price ' + result);
        }
    });
}

userService.prototype.getTokenBalance = function(req, res, callback) {
    getTokenBalance(global.TokenContract, req.body.address, function(error, result){
        if(error != undefined){
            res.send(error);
        } else {
            res.send('Token balance of account address {'+ req.body.address+ '} is: ' + result);
        }
    });
}

userService.prototype.getEtherBalance = function(req, res, callback) {
    getEtherBalance(req.body.address, function(error, result){
        if(error != undefined){
            res.send(error);
        } else {
            res.send('Ether balance of account address {'+ req.body.address+ '} is: ' + (result / 1000000000000000000) + ' Ether' );
        }
    });
}

userService.prototype.buyTokensThroughEthers = function(req, res, callback) {
    buyTokensThroughEthers(global.TokenControllerContract, req.body.sourceAccount, req.body.ethers, function(error, result){
        if(error != undefined){
            res.send(error);
        } else {
            res.send('Successfull hash: ' + result);
        }
    });
}

userService.prototype.payEthersToContract = function(req, res, callback) {
    payEthersToContract(global.TokenControllerContract, req.body.sourceAccount, req.body.ethers, function(error, result){
        if(error != undefined){
            res.send(error);
        } else {
            res.send('Successfull hash: ' + result);
        }
    });
}

userService.prototype.sellTokensFrom = function(req, res, callback) {
    sellTokensFrom(global.TokenControllerContract, req.body.sourceAccount, req.body.tokens, function(error, result){
        if(error != undefined){
            res.send(error);
        } else {
            res.send('Successfull hash: ' + result);
        }
    });
}

userService.prototype.sendTokens = function(req, res, callback) {
    sendTokens(global.TokenContract, req.body.sourceAccount, req.body.targetAccount, req.body.tokens, function(error, result){
        if(error != undefined){
            res.send(error);
        } else {
            res.send('Successfull hash: ' + result);
        }
    });
}

userService.prototype.mint = function(req, res, callback) {
    mint(global.TokenContract, req.body.targetAccount, req.body.amount, function(error, result){
        if(error != undefined){
            res.send(error);
        } else {
            res.send('Successfull hash: ' + result);
        }
    });
}

userService.prototype.transferTokens = function(req, res, callback) {
    transferTokens(global.TokenContract, req.body.targetAccount, req.body.amount, function(error, result){
        if(error != undefined){
            res.send(error);
        } else {
            res.send('Successfull hash: ' + result);
        }
    });
}

userService.prototype.approve = function(req, res, callback) {
    approve(global.TokenContract, req.body.spenderContract, req.body.limitToSpend, function(error, result){
        if(error != undefined){
            res.send(error);
        } else {
            res.send('Successfull hash: ' + result);
        }
    });
}

userService.prototype.increaseApproval = function(req, res, callback) {
    increaseApproval(global.TokenContract, req.body.spenderContract, req.body.addedLimitToSpend, function(error, result){
        if(error != undefined){
            res.send(error);
        } else {
            res.send('Successfull hash: ' + result);
        }
    });
}

userService.prototype.decreaseApproval = function(req, res, callback) {
    decreaseApproval(global.TokenContract, req.body.spenderContract, req.body.reducedLimitToSpend, function(error, result){
        if(error != undefined){
            res.send(error);
        } else {
            res.send('Successfull hash: ' + result);
        }
    });
}

userService.prototype.allowance = function(req, res, callback) {
    allowance(global.TokenContract, req.body.ownerAccount, req.body.spenderContract, function(error, result){
        if(error != undefined){
            res.send(error);
        } else {
            res.send('Successfull hash: ' + result);
        }
    });
}

userService.prototype.transferTokensFrom = function(req, res, callback) {
    transferTokensFrom(global.TokenContract, req.body.sourceAccount, req.body.targetAccount, req.body.amount, function(error, result){
        if(error != undefined){
            res.send(error);
        } else {
            res.send('Successfull hash: ' + result);
        }
    });
}

userService.prototype.burn = function(req, res, callback) {
    burn(global.TokenContract, req.body.sourceAccount, req.body.amountToBurn, function(error, result){
        if(error != undefined){
            res.send(error);
        } else {
            res.send('Successfull hash: ' + result);
        }
    });
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

function setMaxSupply(deployed, maxSupply, callback) {
    var hash = deployed.setMaxSupply.getData(maxSupply);
    var transfer = deployed._eth.sendTransaction({ from: coinbase, to: deployed.address, data: hash })
    var transactionHash = {
        getData: hash,
        sendTransaction: transfer
    }
    callback(null, transactionHash);
}

function setPricesForTokensPerEth(deployed, sellPrice, buyPrice, callback){
    var hash = deployed.setPricesForTokensPerEth.getData(sellPrice, buyPrice);
    var transfer = deployed._eth.sendTransaction({ from: coinbase, to: deployed.address, data: hash })
    var transactionHash = {
        getData: hash,
        sendTransaction: transfer
    }
    callback(null, transactionHash);
}

function buyTokensThroughEthers(deployed, fromAccount, ethers, callback){
    var transactionHash = deployed.buyTokens.sendTransaction({ from: fromAccount, value: ethers});
    callback(null, transactionHash);
}

function payEthersToContract(deployed, fromAccount, ethers, callback){
    var hash = deployed.payEthersToContract.getData(fromAccount, ethers);
    var transfer = deployed._eth.sendTransaction({ from: coinbase, to: deployed.address, data: hash })
    var transactionHash = {
        getData: hash,
        sendTransaction: transfer
    }
    callback(null, transactionHash);
}

function sellTokensFrom(deployed, fromAccount, tokens, callback){
    var transactionHash = deployed.sell.sendTransaction({ from: fromAccount, value: tokens});
    callback(null, transactionHash);
}

function sendTokens(deployed, fromAccount, targetAccount, tokens, callback){
    var hash = deployed.sendTokens.getData(fromAccount, targetAccount, tokens);
    var transfer = deployed._eth.sendTransaction({from: coinbase, to: deployed.address, data: hash});
    var transactionHash = {
        getData: hash,
        sendTransaction: transfer
    }
    callback(null, transactionHash);
}

function mint(deployed, targetAccount, amount, callback){
    var hash = deployed.mint.getData(targetAccount, amount);
    var transfer = deployed._eth.sendTransaction({from: coinbase, to: deployed.address, data: hash});
    var transactionHash = {
        getData: hash,
        sendTransaction: transfer
    }
    callback(null, transactionHash);
}

function transferTokens(deployed, targetAccount, amount, callback){
    var hash = deployed.transfer.getData(targetAccount, amount);
    var transfer = deployed._eth.sendTransaction({from: coinbase, to: deployed.address, data: hash});
    var transactionHash = {
        getData: hash,
        sendTransaction: transfer
    }
    callback(null, transactionHash);
}

function approve(deployed, spenderContract, limitToSpend, callback){
    var hash = deployed.approve.getData(spenderContract, limitToSpend);
    var transfer = deployed._eth.sendTransaction({from: coinbase, to: deployed.address, data: hash});
    var transactionHash = {
        getData: hash,
        sendTransaction: transfer
    }
    callback(null, transactionHash);
}

function increaseApproval(deployed, spenderContract, addedLimitToSpend, callback){
    var hash = deployed.increaseApproval.getData(spenderContract, addedLimitToSpend);
    var transfer = deployed._eth.sendTransaction({from: coinbase, to: deployed.address, data: hash});
    var transactionHash = {
        getData: hash,
        sendTransaction: transfer
    }
    callback(null, transactionHash);
}

function decreaseApproval(deployed, spenderContract, reducedLimitToSpend, callback){
    var hash = deployed.decreaseApproval.getData(spenderContract, reducedLimitToSpend);
    var transfer = deployed._eth.sendTransaction({from: coinbase, to: deployed.address, data: hash});
    var transactionHash = {
        getData: hash,
        sendTransaction: transfer
    }
    callback(null, transactionHash);
}

function transferTokensFrom(deployed, sourceAccount, targetAccount, amount, callback){
    var hash = deployed.transferFrom.getData(sourceAccount, targetAccount, amount);
    var transfer = deployed._eth.sendTransaction({from: coinbase, to: deployed.address, data: hash});
    var transactionHash = {
        getData: hash,
        sendTransaction: transfer
    }
    callback(null, transactionHash);
}

function allowance(deployed, ownerAccount, spenderContract, callback){
    var remainingAllowance = deployed.allowance.call(ownerAccount, spenderContract);
    // var transfer = deployed._eth.sendTransaction({from: coinbase, to: deployed.address, data: hash});
    // var transactionHash = {
    //     getData: hash,
    //     sendTransaction: transfer
    // }
    callback(null, remainingAllowance);
}

function burn(deployed, sourceAccount, amountToBurn, callback){
    var hash = deployed.burn.getData(sourceAccount, amountToBurn);
    var transfer = deployed._eth.sendTransaction({from: coinbase, to: deployed.address, data: hash});
    var transactionHash = {
        getData: hash,
        sendTransaction: transfer
    }
    callback(null, transactionHash);
}

function getTokenBalance(deployed, accountAddress, callback) {
    var tokenBal = deployed.getTokenBalance(accountAddress);
    callback(null, tokenBal); 
}

function getEtherBalance(accountAddress, callback) {
    if(accountAddress != 0x0) {
        var tokenBal = web3.eth.getBalance(accountAddress);
        callback(null, tokenBal); 
    }
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