var config = require(configDir+'config.js');
var utils = require('./utils');
var account = require('./account');
var oauthSuccess = require('./oauthSuccess');
var logger = require('log4js').getLogger('device');
var self = exports;

/*
 * tuneToTV ajax call, it will call contentSearchByTitle API to get the show entityId, then make tuneEntity API call
 */
exports.tuneToTV = function(req, res) {
    logger.info('system=foodie-search-tune-reference event=device.tuneToTV access_token='+req.session.access_token+" showName="+req.body.showName);
    /* get access token from session or get by refresh token if it expired */
    oauthSuccess.getAccessTokenFromSessionOrByRefreshToken(req, res);
}

exports.getDevices = function(req, res) {

    var access_token = req.session.access_token;
    var url = config.x1.baseUrl + "/devices";
    var options = {
        url: url,
        method: 'GET',
        headers: {
            "Authorization": "Bearer "+access_token
        }
    };

    utils.executeHttpRequest(options, 'device.lookUpDevices', function(statusCode, data) {
        try {
            if (statusCode!==200) {
                logger.error('system=foodie-account-notification-reference event=device.lookupDevices status=error statusCode=' + statusCode + ' responseBody=' + data);
                res.render('errorPage', {error: JSON.stringify(data)});
            } else {
                try {
                    var results = JSON.parse(data);
                    logger.info("system=foodie-account-notification-reference event=device.lookupDevices status=success response="+data);

                    /* save the account's devices in session */
                    req.session.devices = results.results.devices;

                    /* render to ultimateFoodie page */
                    res.render('ultimateFoodie',{
                        access_token: req.session.access_token
                    });
                } catch (e) {
                    logger.error("system=foodie-account-notification-reference event=device.lookupDevices status=error response="+data);
                    res.render('errorPage', {error: JSON.stringify(data)});
                }
            }

        } catch(err) {
            logger.error('system=foodie-account-notification-reference event=device.lookUpDevices status=error responseBody=' + err);
            res.render('errorPage', {error: err});
        }
    });
}

/*
 * a function to call tuneEntity API
 * @param - req: request containing access_token, entity_id
 * @param - res: response sending out let Ajax know it's complete
 */
exports.tuneEntity = function(req, res) {
    var access_token = req.session.access_token;
    /*
       This is only for on TV app, deviceId is "me", which is the TV
     */
    var deviceId = 'me';
    deviceId = '7626805574215551739';
    var entity_id = req.body.entityId;
    var url = config.x1.baseUrl+"/devices/"+deviceId+"/tuner";
    var bodyStr = JSON.stringify({
        "entityId": entity_id
        });
    var options = {
        url: url,
        method: 'PUT',
        headers: {
            "Authorization": "Bearer "+access_token,
            "Content-Type": "application/json"
        },
        body: bodyStr
    };

    var results;
    utils.executeHttpRequest(options, 'device.tuneEntity', function(statusCode, data) {
        try {
            if (statusCode!==200) {
                logger.error('system=foodie-search-tune-reference event=device.tuneEntity status=error statusCode=' + statusCode + ' responseBody=' + data);
            } else {
                logger.info("system=foodie-search-tune-reference event=device.tuneEntity status=success response="+data);
            }
            try {
                results = JSON.parse(data);

            } catch (e) {
                logger.error("system=foodie-search-tune-reference event=device.tuneEntity status=error response="+data);
                results = {statusCode: '404', statusMessage: data};
            }

        } catch(err) {
            logger.error('system=foodie-search-tune-reference event=device.tuneEntity status=error responseBody=' + err);
            results = {statusCode: '404', statusMessage: err};
        }
        /* after response sending out, ajax call is complete */
        res.json({
            results: results
        });
    });
}

/*
 * A function to call exitrequest API, this is for on TV only,
 * after Ajax call complete, showing the confirm message, then exit, returning
 * back to TV.
 * @param - req: request containing access_token
 * @param - res: response
 */
exports.exitrequest = function(req, res) {
    var access_token = req.session.access_token;
    /*
     This is only for on TV app, deviceId is "me", which is the TV
     */
    var deviceId = "me";
    var url = config.x1.baseUrl + "/devices/" + deviceId + "/exitrequest";

    var options = {
        url: url,
        method: 'POST',
        headers: {
            "Authorization": "Bearer "+access_token,
            "Content-Type": "application/json"
        }
    }
    utils.executeHttpRequest(options, 'device.exitRequest', function(statusCode, data) {
        try {
            if (statusCode!==200) {
                logger.error('system=foodie-search-tune-reference event=device.exitRequest status=error statusCode=' + statusCode + ' responseBody=' + data);
            } else {
                try {
                    var results = JSON.parse(data);
                    logger.info("system=foodie-search-tune-reference event=device.exitRequest status=success response="+data);
                    res.json({
                        exitResults: results
                    });
                } catch (e) {
                    logger.error("system=foodie-search-tune-reference event=device.exitRequest status=error response="+data);
                    res.render('errorPage', {error: JSON.stringify(data)});
                }
            }

        } catch(err) {
            logger.error('system=foodie-search-tune-reference event=device.exitRequest status=error responseBody=' + err);
            res.render('errorPage', {error: err});
        }
    });
}
