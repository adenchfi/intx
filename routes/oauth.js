var config = require(configDir+'config.js');
var logger = require('log4js').getLogger('oauth');

/*
 * This is the first page of the reference app.  We will instantiate a 3-legged oauth request when the app starts.
 */
exports.get = function(req, res){

    /*
     * Grab the XSCD token if there is one.  The XSCD token is an authentication token for a user-device combo.  When an
     * web app is launched from a X1 STB, the XSCD token will automatically be appended as a query string.  An app can
     * choose to use it or not.  An app should append the XSCD token as a query parameter to its oauth request.
     * If a XSCD is presented during the Oauth flow, a user will be auto-signin.
     */
    var xscdToken = req.query.xscd;

    /*
     * Construct the oauth redirect URL to start the oauth flow
     */
    var redirectToAuthorizeUrl = config.authorizeUrl + '?response_type=code&client_id=' + config.clientId + '&redirect_uri=' + encodeURIComponent(config.redirectUri)+ '&scope=' + config.scope;
    if (xscdToken) {
        redirectToAuthorizeUrl += "&xscd=" + xscdToken;
    }

    logger.info("system=foodie-search-tune-reference event=oauth headers="+JSON.stringify(req.headers));
    logger.info("system=foodie-search-tune-reference event=oauth redirectUrl="+redirectToAuthorizeUrl);

    /* Start the 3 legged oauth:
     *   1. An user will be prompted for username/password if XSCD is not presented.
     *   2. The user will be asked to accept permissions (for the app to use the APIs).
     *   3. Once accepted, the user will be redirected to the oauthSuccess page, where the app will obtain the
     *      API access token.
     */
    res.redirect(redirectToAuthorizeUrl);
};