
/**
 * Module dependencies.
 */
//configDir='/opt/csv/etc/conf/thirdptysampleapp/';
configDir=process.cwd()+'/';
var express = require('express');
var oauth = require('./routes/oauth');
var oauthSuccess = require('./routes/oauthSuccess');
var http = require('http');
var path = require('path');
var account = require('./routes/account');
var device = require('./routes/device');
var foodieController = require('./routes/foodieController');
var config = require(configDir+'config.js');
var app = express();

// all environments
app.set('port', process.env.PORT || config.port);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/www', express.static(__dirname + '/www'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//handle requests
//the first page will be handled in oauth.get
app.get('/', oauth.get);
app.get('/oauth', oauth.get);
app.get('/oauthSuccess', oauthSuccess.get);
app.post('/contentSearchByTitle', account.contentSearchByTitle);
app.post('/tuneEntity', device.tuneEntity);
app.post('/goToCuisinesPage', foodieController.goToCuisinesPage);
app.post('/retakeQuiz', foodieController.goToCuisinesPage);
app.post('/goToDrinksPage', foodieController.goToDrinksPage);
app.post('/goToChefsPage', foodieController.goToChefsPage);
app.post('/goToShowsPage', foodieController.goToShowsPage);
app.post('/goToMyPage', foodieController.goToMyPage);
app.put('/tuneToTV', device.tuneToTV);
app.post('/exitrequest', device.exitrequest);
app.get('/devices', device.getDevices);
app.post('/sendSMS', foodieController.sendSMS);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
