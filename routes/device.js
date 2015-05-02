var config = require(configDir+'config.js');
var utils = require('./utils');
var logger = require('log4js').getLogger('device');
var oauthSuccess = require('./oauthSuccess');

/*
 *  a function to get the account's devices
 *  @param req : request containing access_token
 *  @param res : response render to ultimateFoodie page
 */
exports.lookupDevices = function(req, res) {

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
 * a function to getAccessToken from session if it's still active,
 * if it expired, it will use refresh token to get a new access token
 * After that it will call sendNotificationToTV
 * @param req: request containing access_token
 * @param res: response
 */

exports.checkAccessTokenAndSendNotification = function(req, res) {

    oauthSuccess.getAccessTokenFromSessionOrByRefreshToken(req, res);
}

/*
 * a function to send notification to a device
 * @param req: request containing access_token, deviceId, entityId
 * @param res: response sending out after success, letting ajax know it's complete
 */
exports.sendNotificationToTV = function(req, res) {

    var access_token = req.session.access_token;
    var deviceId = req.body.deviceId;
    var entityId = req.body.entityId;
    var url = config.x1.baseUrl+"/devices/"+deviceId+"/notification";
    var bodyStr = JSON.stringify({
        "messageTitle":"Chef's Show!!!",
        "messageBody":"Click the INFO for More",
        "iconUrl":"http://4.bp.blogspot.com/-ZmpZMxfKhwU/UZGU1QaPNeI/AAAAAAAAAMg/byXmVo14Gxs/s1600/house_icon.jpg",
        "action":"showInfoPage",
        "entityId":entityId,
        "appId":"sportsApp",
        "actionButton": "OK"
    });
    var options = {
        url: url,
        method: 'POST',
        headers: {
            "Authorization": "Bearer "+access_token,
            "Content-Type": "application/json"
        },
        body: bodyStr
    };
    var results;

    utils.executeHttpRequest(options, 'device.sendNotificationToTV', function(statusCode, data) {
        try {
            if (statusCode!==200) {
                logger.error('system=foodie-account-notification-reference event=device.sendNotificationToTV status=error statusCode=' + statusCode + ' responseBody=' + data);
            } else {
                logger.info("system=foodie-account-notification-reference event=device.sendNotificationToTV status=success response="+data);
            }
            try {
                results = JSON.parse(data);
            } catch (e) {
                logger.error("system=foodie-account-notification-reference event=device.sendNotificationToTV status=error response="+data);
                results = {statusCode: '404', statusMessage: data};
            }

        } catch(err) {
            logger.error('system=foodie-account-notification-reference event=device.sendNotificationToTV status=error responseBody=' + err);
            results = {statusCode: '404', statusMessage: err};
        }
        /* after response sending out, ajax call is complete */
        res.json({
            results: results
        });
    });
}
