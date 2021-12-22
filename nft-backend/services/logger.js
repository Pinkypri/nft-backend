var bunyan = require('bunyan');
var packageJson = require('../package.json');
var constant = require('../../config/constant.json');

module.exports = {
	enableLogger : enableLogger,
	changeLogger : changeLogger
}
//Every log is call the enableLogger function
function enableLogger (){
	if(!constant.LOGSETUP.log){
		constant.LOGSETUP.log = bunyan.createLogger({
			name: packageJson.name,
			streams: [ {
				level: constant.LOGSETUP.level || "info",
				stream: process.stdout     // log DEBUG and above to stdout
			}],
			serializers: bunyan.stdSerializers
		});
	}
	return constant.LOGSETUP.log;
}

//Change logger servie End Function 
function changeLogger (value , callback){
	if(value){
		constant.LOGSETUP.level = value;
		constant.LOGSETUP.log.level(constant.LOGSETUP.level);
		callback(true);
	}else{
		callback(false);
	}
}