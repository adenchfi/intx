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