var config = require(configDir+'config.js');
var logger = require('log4js').getLogger('oauthSuccess');
var utils = require('./utils');
var account = require('./account');

/*
 * A function to call getAccessToken if there is authorization code
 * if user declined in permission page, enter accessDenied page */
exports.get = function(req, res){

    if (req.query.code){
        /*
         * We've received a code. Lets use it to obtain an oauth access token
         */
        getAccessToken(req, res);
    } else if(req.query.error == "access_denied") {
        res.render('accessDenied');
    }
};

/*
 * A function to get access_token
 * @param - req: request containing code
 * @param - res: response
 */

function getAccessToken(req, res) {
    var accessToken;
    var code = req.query.code;
    try {

        var bodyString =  "client_id=" + config.clientId + "&client_secret=" + config.clientSecret + "&grant_type=authorization_code&redirect_uri=" + encodeURIComponent(config.redirectUri) + "&code=" + code;

        var options = {
            url: config.getAccessToken.baseUrl,
            body: bodyString,
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        };
        logger.info("system=foodie-search-tune-reference event=oauthSuccess.getAccessToken bodyString: " + bodyString);

        utils.executeHttpRequest(options, 'oauthSuccess.getAccessToken', function(statusCode, data) {
            try {
                if (statusCode!==200) {
                    logger.error('system=foodie-search-tune-reference event=oauthSuccess.getAccessToken status=error statusCode=' + statusCode + ' responseBody=' + data);
                    res.render('errorPage', {error: JSON.stringify(data)});
                } else {
                    try {
                        accessToken = JSON.parse(data);
                        logger.info('system=foodie-search-tune-reference event=oauthSuccess.getAccessToken status=success data='+data);
                    } catch(err) {
                        logger.error('system=foodie-search-tune-reference event=oauthSuccess.getAccessToken status=error responseBody=' + data);
                        res.render('errorPage', {error: JSON.stringify(data)});
                    }
                    logger.info('system=foodie-search-tune-reference event=oauthSuccess.getAccessToken status=success access_token=' + accessToken.access_token + ' expires=' + accessToken.expires_in);

                    /* save access_token in session */
                    req.session.access_token = accessToken.access_token;
                    req.session.refresh_token = accessToken.refresh_token;
                    req.session.access_token_start_time = new Date().getTime();

                    /* render to ultimateFoodie page */
                    res.render('myPage',{
                        access_token: req.session.access_token
                    });

                }
            } catch(err) {
                logger.error('system=foodie-search-tune-reference event=oauthSuccess.getAccessToken status=error responseBody=' + err);
                res.render('errorPage', {error: err});
            }
        });
    } catch(err) {
        logger.error('system=foodie-search-tune-reference event=oauthSuccess.getAccessToken status=error responseBody=' + err);
        res.render('errorPage', {error: err});
    }
}

/*
 * A function to get access_token by Refresh token if it expired
 * if not expired, just use the access_token stored in session to make content search API call
 * @param - req: request containing refresh_token
 * @param - res: response
 */
exports.getAccessTokenFromSessionOrByRefreshToken = function(req, res) {

    var now_time = new Date().getTime();
    var access_token_start_time = req.session.access_token_start_time;
    var diff = now_time - access_token_start_time;

    /* The access_token stored in session is active for 60 minutes;
     * if longer than 60 minutes, use refresh token to make API call to get new access token */
    if (Math.round(diff/60000) >= 60) {
        try {
            var bodyString = "client_id=" + config.clientId + "&client_secret=" + config.clientSecret + "&grant_type=refresh_token&redirect_uri=" + encodeURIComponent(config.redirectUri) + "&refresh_token=" + req.session.refresh_token;

            var options = {
                url: config.getAccessToken.baseUrl,
                body: bodyString,
                method: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            };
            logger.info("system=foodie-account-notification-reference event=oauthSuccess.getAccessTokenByRefreshToken bodyString: " + bodyString);

            utils.executeHttpRequest(options, 'oauthSuccess.getAccessTokenByRefreshToken', function (statusCode, data) {
                try {
                    if (statusCode !== 200) {
                        logger.error('system=foodie-account-notification-reference event=oauthSuccess.getAccessTokenByRefreshToken status=error statusCode=' + statusCode + ' responseBody=' + data);
                        res.render('errorPage', {error: JSON.stringify(data)});
                    } else {
                        try {
                            var accessToken = JSON.parse(data);
                            logger.info('system=foodie-account-notification-reference event=oauthSuccess.getAccessTokenByRefreshToken status=success data=' + data);

                            /* save access_token in session */
                            req.session.access_token = accessToken.access_token;
                            req.session.refresh_token = accessToken.refresh_token;
                            req.session.access_token_start_time = new Date().getTime();

                        } catch (err) {
                            logger.error('system=foodie-account-notification-reference event=oauthSuccess.getAccessTokenByRefreshToken status=error responseBody=' + data);
                            res.render('errorPage', {error: JSON.stringify(data)});
                        }
                        logger.info('system=foodie-account-notification-reference event=oauthSuccess.getAccessTokenByRefreshToken status=success access_token=' + accessToken.access_token + ' expires=' + accessToken.expires_in);
                    }
                } catch (err) {
                    logger.error('system=foodie-account-notification-reference event=oauthSuccess.getAccessTokenByRefreshToken status=error responseBody=' + err);
                    res.render('errorPage', {error: err});
                }
            });
        } catch (err) {
            logger.error('system=foodie-account-notification-reference event=oauthSuccess.getAccessTokenByRefreshToken status=error responseBody=' + err);
            res.render('errorPage', {error: err});
        }
    }
    /* issue search content API call*/
    account.contentSearchByTitle(req, res);
}

