module.exports = function(app) {
	var controllers = app.controllers,
		views = app.views;

	return {
		"/": [{
			method: "GET",
			action: app.controllers.userController.home,
			middleware: [],
			views: {
				json: views.jsonView
			}
		}],
		"/api/v1/userapi/deploy": [{
			method: "GET",
			action: app.controllers.userController.setUpDeploy,
			middleware: [],
			views: {
				json: views.jsonView
			}
		}],
		"/api/v1/userapi/startFirstICOSale": [{
			method: "GET",
			action: app.controllers.userController.startFirstICOSale,
			middleware: [],
			views: {
				json: views.jsonView
			}
		}],
		"/api/v1/userapi/getSalesCount": [{
			method: "GET",
			action: app.controllers.userController.getSalesCount,
			middleware: [],
			views: {
				json: views.jsonView
			}
		}],
		"/api/v1/userapi/getTokenBalance": [{
			method: "POST",
			action: app.controllers.userController.getTokenBalance,
			middleware: [],
			views: {
				json: views.jsonView
			}
		}]

	};
};
