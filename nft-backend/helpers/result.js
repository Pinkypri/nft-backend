
const httpStatus = require("http-status");
module.exports = {

	getExistsResult: function (result, res) {
		res.status(httpStatus.OK).json({ "status": false, error: result });
	},
	getSuccessResult: function (result, res) {
		let jsonMsg = (result && result.msg) ? { "status": true, data: result, msg: result.msg } : { "status": true, data: result };
		res.status(httpStatus.OK).json(jsonMsg);
	},
	getMessageResult: function (response, msg, res) {
		res.status(httpStatus.OK).json({ "status": true, data: response, msg: msg });
	},
	getNotExistsResult: function (response, res) {
		res.status(httpStatus.OK).json({ "status": false, msg: 'No data found' });
	},
	getBadRequestResult: function (result, res) {
		res.status(httpStatus.BAD_REQUEST).json({ "status": false, msg: 'Bad request found' });
	},
	getErrorResult: function (errResp, res) {
		res.status(httpStatus.OK).json({ "status": false, error: errResp.message ? errResp.message :  errResp});
	},
	getMessageResultPagination: function (response, msg, res) {
		res.status(httpStatus.OK).json({ "status": true, data: response.rows, count:response.count, pages:response.pages, msg: msg ,basePath: response.basePath});
	},
	serverError: function (errResp, res) {
		res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ "status": false, msg: "Internal server error"});
	}
}
