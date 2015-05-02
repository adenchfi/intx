module.exports = {
    x1: {
        baseUrl: 'https://secure.api.comcast.net/X1/api/v1'
    },

    authorizeUrl: 'https://secure.api.comcast.net/X1/oauth2/authorize',
    /*
     The registered callback URL set in portal
     */
    redirectUri: 'https://intxadamtony.azurewebsites.net/oauthSuccess',
    /* The registered client id set in portal */
    clientId: '8n8u9sk6k8dhdt4mpg6jbc8c',
    /* The registered client secret set in portal */
    clientSecret: 'CgAN3j3Z',
    scope: 'content.search devices.tune',

    getAccessToken: {
        baseUrl: 'https://secure.api.comcast.net/X1/oauth2/token'
    },

    port: 8080
}
