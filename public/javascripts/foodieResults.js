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
                    output += "<div class='show navigate' style=\"background-image: url('" + data[i].shows[j].icon + "')\" onclick=\"displayDevices('" +data[i].shows[j].entityId+ "')\"></div>";
                }
            }
        }
        $('#resultsHolder').append(output);
        $('.darkOverlay .navigate').not('.noFocus').navigate({
            activeClass: 'retakeHover'
        });
    });

});

/* This method issues ajax call, which is handled in device.js
 * it calls sendNotification thirdparty API
  * it shows confirmation message to user if success
   * it shows error statusMessage to user if fails */
 function selectDeviceToSendNotification(deviceId, deviceName) {

    var entityId = $("input[name=entityId]").val();
    closeDevicesOverlay();
    $('.darkOverlay .navigate').not('.noFocus').navigate('destroy');

    $.ajax({
        type: "post",
        url: "/checkAccessTokenAndSendNotification",
        data: {deviceId:deviceId, deviceName:deviceName, entityId: entityId}
    })
    .done(function(result) {
        $("#confirmOverlay").removeClass('displayNone');
        if (result.results.statusCode == '200') {
            /* notification sent successfully, show confirm message */
            $("#sentToName").html(deviceName + " TV!");
        } else {
            /* notification sent failed, show error message */
            $("#notificationStatus").html(result.results.statusMessage);
        }
    });
}

/* open devices overlay, remove shows key navigation,
 * add key navigation inside devices overlay */
function displayDevices(entityId) {
    $("input[name=entityId]").val(entityId);
    $('#devicesOverlay').removeClass('displayNone');
    $('.darkOverlay .navigate').not('.noFocus').navigate('destroy');
    $('#devicesOverlay .deviceBar').navigate({
        activeClass: 'deviceBarHover'
    });
}

/* after sendNotificationToTV ajax call, close devices overlay,
 * remove key navigation inside devices overlay,
*  put back shows navigation*/
function closeDevicesOverlay() {
    $('#devicesOverlay').addClass('displayNone');
    $('#devicesOverlay .deviceBar').navigate('destroy');
    $('.darkOverlay .navigate').not('.noFocus').navigate({
        activeClass: 'retakeHover'
    });
}

