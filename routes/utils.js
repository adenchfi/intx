var request = require('request');
var logger = require('log4js').getLogger('utils');

/**
 * A utility function to send an http request
 * @param options   http options
 * @param caller    for logging purpose only
 * @param callback  to handle http response
 */
exports.executeHttpRequest= function(options, caller, callback) {

    var requestStartTime = Date.now();

    request(options, function (error, response, body) {

        var responseTime = (Date.now() - requestStartTime) + 'ms';

        var commonLogInfo = 'system=foodie-search-tune-reference event=executeHttpRequest caller=' + caller + ' requestUrl=' + options.url + ' responseTime=' + responseTime;
        if (error) {
            logger.error(commonLogInfo + 'status=invalidOptions statusCode=-1 error=' + error + ' options=' + JSON.stringify(options));
            callback(-1, null);
        } else {
            var statusCode = response.statusCode;
            if (statusCode!=200) {
                logger.error(commonLogInfo + 'status=error statusCode=' + statusCode  + ' responseBody=' + body);
            } else {
                logger.info(commonLogInfo + 'status=success statusCode=200');
            }
            callback(statusCode, body);
        }
    });
}
