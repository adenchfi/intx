require("path/to/twilio-node/lib");

/*
 * render to top3Cuisines.html
 */
exports.goToCuisinesPage = function(req, res) {
    res.render('top3Cuisines');
}

/*
 * render to drinks.html
 */
exports.goToDrinksPage = function(req, res) {
    req.session.cuisines = req.body.cuisines;
    res.render('drinks');
}

/*
 * render to chefs.html
 */
exports.goToChefsPage = function(req, res) {
    req.session.drink = req.body.drink;
    res.render('chefs');
}

/*
 * render to showResults.html, pass in selected chef name and account's devices
 */
exports.goToShowsPage = function(req, res) {
    req.session.chef = req.body.chef;
    res.render('showResults', {
        chef: req.body.chef,
        devices:req.session.devices});
}

exports.goToMyPage = function(req, res) {
    res.render('myPage');
}

exports.sendSMS = function(req, res) {
    var accountSid = 'AC32a3c49700934481addd5ce1659f04d2';
    var authToken = "{{ auth_token }}";
    var client = require('twilio')(accountSid, authToken);

    client.messages.create({
        body: "Jenny please?! I love you <3",
        to: "+2244564700",
        from: "+2244564700"
    }, function(err, message) {
        process.stdout.write(message.sid);
    });
}