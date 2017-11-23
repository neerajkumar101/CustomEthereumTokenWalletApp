module.exports = function() {
    var setUpDeploy = function(req, res, callback) {
        this.services.userService.setUpDeploy(res, callback);
    }

    var setUpDeploy1 = function(req, res, callback) {
        this.services.userService.setUpDeploy1(res, callback);
    }

    var startFirstICOSale = function(req, res, callback) {
        this.services.userService.startFirstICOSale(res, callback);
    }

    var getSalesCount = function(req, res, callback) {
    //    callback(null, null);
        this.services.userService.getSalesCount(res, callback);
    }

    return {
        setUpDeploy: setUpDeploy,
        setUpDeploy1: setUpDeploy1,
        startFirstICOSale: startFirstICOSale,
        getSalesCount: getSalesCount
    }
};
