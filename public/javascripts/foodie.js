var cuisineSelected = 0;

/* After user selects 3 cuisines,
 *  it enters drinks page */
function selectCuisine(e, cuisineName) {

    $('#'+cuisineName).removeClass('displayNone');
    cuisineSelected++;

    if (cuisineSelected == 3) {
        document.forms["cuisineForm"].submit();
    }
}

/* User selects a drink, enters chefs page */
function selectDrink(e, drinkName) {
    $('#'+drinkName).removeClass('displayNone');
    document.forms["drinkForm"].submit();
}

/* User selects a chef, enters showResults page */
function selectChef(chefId, chefName) {
    $('#'+chefId).addClass('chefSelected');
    $("input[name=chef]").val(chefName);
    document.forms["chefsForm"].submit();
}



