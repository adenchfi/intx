module.exports = {
    x1: {
        baseUrl: 'https://secure.api.comcast.net/X1/api/v1'
    },

    authorizeUrl: 'https://secure.api.comcast.net/X1/oauth2/authorize',
    /* Put oauth redirectUri, which is from portal application*/
    redirectUri: 'https://intxtonyadam.azurewebsites.net/oauthSuccess',
    /* Put clientId, which is from portal application*/
    clientId: '8n8u9sk6k8dhdt4mpg6jbc8c',
    /* Put clientSecret, which is from portal application*/
    clientSecret: 'CgAN3j3Z',
    scope: 'devices.lookup content.search devices.tune devices.send_notification',

    getAccessToken: {
        baseUrl: 'https://secure.api.comcast.net/X1/oauth2/token'
    },

    port: 3000
}
