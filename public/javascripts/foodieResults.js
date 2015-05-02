/* Get a list of shows of the selected chef from shows.json, which is a static JSON file in Public/
 * Display the list of shows in showResults.html, clicking on each show will pop up devices overlay
 * */
$(document).ready(function() {
    var chefSelected = $("input[name=chefSelected]").val();
    $.getJSON("/shows.json", function(data) {
        for (var i in data) {
            if (chefSelected == data[i].chef) {
                var output = "";
                for (var j in data[i].shows) {
                    output += "<div class='show navigate' style=\"background-image: url('" + data[i].shows[j].icon + "')\" onclick=\"tuneToDevice('" +data[i].shows[j].name+ "')\"></div>";
                }
            }
        }
        $('#resultsHolder').append(output);
        $('.darkOverlay .navigate').not('.noFocus').navigate({
            activeClass: 'retakeHover'
        });
    });

});

/*
 * This method issues ajax call, which is handled in device.js
 * It calls tuneEnity third party API
 * It shows confirmation message to user if success
 * shows error statusMessage to user if fails
 */

function tuneToDevice(showName) {
    $('.darkOverlay .navigate').not('.noFocus').navigate('destroy');

    $.ajax({
        type: "put",
        url: "/tuneToTV",
        data: {showName: showName}
    })
        .done(function(result) {
            $("#confirmOverlay").removeClass('displayNone');
            if (result.results.statusCode == '200') {
                /* tuned successfully, show confirm message */
                $("#tuneTo").html("Tune to " + showName + "!");
                exitRequest();
            } else {
               /* tuneEntity failed, show error message */
                $("#tuneTo").html(result.results.statusMessage);
            }
        });
}

/* This method issues exitrequest third party API call,
 * It returns back to TV and let user see the tuned results
* */
function exitRequest() {
    $.ajax({
        type: "post",
        url: "/exitrequest"
    })
        .done(function(result){});
}
