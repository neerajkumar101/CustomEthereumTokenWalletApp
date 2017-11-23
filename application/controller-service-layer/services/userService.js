var BaseService = require('./BaseService');
var fs = require('fs');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

var Token = '0x3a92df72b8cc3f4350fa95b84b0b932cc2c40138';
var TokenController = '0x5a4d91ef417c4c3c16ae340f9430767353bb544a';

userService = function(app) {
    this.app = app;
};

userService.prototype = new BaseService();

userService.prototype.setUpDeploy = function(res, callback) {
    async.auto({
        TokenSmartContractInstance: function(next) {
            deployExistingSmartContract(next, Token, 'Token');
        },
        TokenControllerSmartContractInstance: ['TokenSmartContractInstance', function(results, next) {
            deployExistingSmartContract(next, TokenController, 'TokenController');
        }],
        setToken: ['TokenControllerSmartContractInstance', function(results, next) {
            setToken(next, results.TokenControllerSmartContractInstance, Token);
        }]
        // ICOControllerMonolithSmartContractInstance: function(next) {
        //     deployExistingSmartContract(next, ICOControllerMonolith, 'ICOControllerMonolith');
        // },
        // ICOSmartContractInstance: ['ICOControllerMonolithSmartContractInstance', function(results, next) {
        //     deployExistingSmartContract(next, ICO, 'ICO');
        // }],
        // TokenSmartContractInstance: ['ICOSmartContractInstance', function(results, next) {
        //     deployExistingSmartContract(next, Token, 'Token');
        // }],
        // setICO: ['TokenSmartContractInstance', function(results, next) {
        //     setICO(next, results.ICOControllerMonolithSmartContractInstance, ICO);
        // }],
        // setAsTest: ['TokenSmartContractInstance', function(results, next) {
        //     setAsTest(next, results.ICOSmartContractInstance, ICO);
        // }],
        // setController: ['setAsTest', function(results, next) {
        //     setController(next, results.ICOSmartContractInstance, ICOControllerMonolith);
        // }],
        // setICO1: ['setController', function(results, next) {
        //     setICO(next, results.TokenSmartContractInstance, ICO);
        // }],
        // setController1: ['setICO1', function(results, next) {
        //     setController(next, results.TokenSmartContractInstance, ICOControllerMonolith);
        // }],
        // setToken: ['setController1', function(results, next) {
        //     setToken(next, results.ICOSmartContractInstance, Token);
        // }],
        // setFirstSaleLauncher: ['setToken', function(results, next) {
        //     setFirstSaleLauncher(next, results.ICOControllerMonolithSmartContractInstance, FirstSaleLauncher);
        // }],
        // setAuctionLauncher: ['setFirstSaleLauncher', function(results, next) {
        //     setAuctionLauncher(next, results.ICOControllerMonolithSmartContractInstance, AuctionLauncher);
        // }],
        // setAdvisor: ['setAuctionLauncher', function(results, next) {
        //     setAdvisor(next, results.ICOControllerMonolithSmartContractInstance, Advisor);
        // }],
        // setFakeTime: ['setAdvisor', function(results, next) {
        //     setFakeTime(next, results.ICOSmartContractInstance);
        // }]
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

userService.prototype.getSalesCount = function(res, callback) {
//  async.auto({
//      ICOSmartContractInstance: function(next) {
//          deployExistingSmartContract(next, ICOControllerMonolith, 'ICOControllerMonolith');
//      },
//      SalesCount: ['ICOSmartContractInstance', function(results, next) {
//          var deployed = results.ICOSmartContractInstance;
//          var transfer = deployed.numSales.call();
//          console.log(transfer)
//          next(null, transfer)
//      }],
//  }, function(err, success) {
//      console.log(success, "success")
//      if (err) {
//          console.log("error")
//          callback(err, null);
//      } else {
//          console.log("success")
//          callback(null, success);
//      }
//  });
callback(null,null);
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

function setToken(next, deployed, Token) {
    var hash = deployed.setToken.getData(Token);
    var transfer = deployed._eth.sendTransaction({ from: coinbase, to: deployed.address, data: hash })
    var setToken = {
        getData: hash,
        sendTransaction: transfer
    }
    next(null, setToken)
}

function setMaxSupply(next, deployed, maxSupply) {
    var hash = deployed.setICO.getData(maxSupply);
    var transfer = deployed._eth.sendTransaction({ from: coinbase, to: deployed.address, data: hash })
    var setICO = {
        getData: hash,
        sendTransaction: transfer
    }
    next(null, setICO)
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

var deployExistingSmartContract = (next, smartContractAddress, contractName) => {
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
                
                
                resolve(null, contractInstance);
            }
        });
    });
    promOb.then(function(contractInstance){
        next(null, contractInstance);
    }).catch(function(error){
        console.log('error occured: ' + error);
    });
}

module.exports = function(app) {
    return new userService(app);
};