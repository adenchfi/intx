var config = require(configDir+'config.js');
var device = require('./device');
var logger = require('log4js').getLogger('account');
var utils = require('./utils');

/*
 * A function to search content by title, such as program or show name
 * if there is entity returned, make tuneEntity API call.
 * @param - req: request containing access_token, showName
 * @param - res: response
 */

exports.contentSearchByTitle = function(req, res) {

    var access_token = req.session.access_token;
    var showName = encodeURIComponent(req.body.showName);
    var url = config.x1.baseUrl + "/content/programs?q=" + showName + "&range=1-10&includeLinear=true&includeVod=false";
    var options = {
        url: url,
        method: 'GET',
        headers: {
          "Authorization": "Bearer "+access_token
        }
    };

    utils.executeHttpRequest(options, 'account.contentSearchByTitle', function(statusCode, data) {
      try {
          if (statusCode != 200) {
              logger.error('system=foodie-search-tune-reference event=account.contentSearchByTitle status=error statusCode=' + statusCode + ' responseBody=' + data);
              res.render('errorPage', {error: JSON.stringify(data)});
          } else {
              try {
                  var results = JSON.parse(data);
                  logger.info('system=foodie-search-tune-reference event=account.contentSearchByTitle status=success response='+data);
                  if (results && results.results && results.results.count > 0) {
                      var entities = results.results.entities;
                      req.body.entityId = entities[0].id;
                      /* make tuneEntity API call if there is entity returned*/
                      device.tuneEntity(req, res);
                  } else {
                      /* If no entity returned, show the message to user */
                      logger.info('system=foodie-search-tune-reference event=account.contentSearchByTitle response=No entity returned for this show:'+req.body.showName);
                      res.json({
                          results: {
                              statusCode: '404',
                              statusMessage: 'No entity returned for this show:'+req.body.showName
                          }
                      });
                  }

              } catch(e) {
                  logger.error("system=foodie-search-tune-reference event=account.contentSearchByTitle status=error response="+data);
                  res.render('errorPage', {error: JSON.stringify(data)});
              }
          }

      } catch(ex) {
          logger.error('system=foodie-search-tune-reference event=account.contentSearchByTitle status=error responseBody=' + ex);
          res.render('errorPage', {error: ex});
      }
    });
}
