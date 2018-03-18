var testImage = 'data:image/jpeg;base64,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';
// saved main build reference
var mainBldgID;
// reference to custom rightclick menu reference
var poiMenuSelector;
// global state indicating if the map is is Floor Selector mode
var isFloorSelectorEnabled = false;
// tracked references to POI's
var poisInScene = [];
// global lobal state indicating the current sleected floor
var currentFloorId, currentLabelId, ambiarc, fr, parsedJson;

// Creating the right-click menu
$(document).ready(function() {

    var $body = $(document.body);

    var menu = new BootstrapMenu('#bootstrap', {
        actions: [{
            name: 'Label',
            onClick: function() {
                createTextLabel();
                menu.close();
            }
        }, {
            name: 'Icon',
            onClick: function() {
                createIconLabel();
                menu.close();
            }
        }, {
            name: 'Cancel',
            onClick: function() {
                menu.close();
            }
        }],
        menuEvent: 'right-click'
    });
    poiMenuSelector = menu.$menu[0];


    $('#bldg-floor-select').on('change', function(){

        var parsedValue = $(this).val().split('::');
        var buildingId = parsedValue[0];
        var floorId = parsedValue[1];

        ambiarc.focusOnFloor(buildingId, floorId)
    });



    //PANEL ELEMENTS HANDLERS

    $('#import-file').on('change', importFileHandler);

    $('.poi-list-panel').find('.header-button').on('click', function(){
        $('.header-button').removeClass('selected').removeClass('btn-primary').removeClass('btn-selected');
        $(this).addClass('btn-primary').addClass('btn-selected');
    });

    $('.poi-details-panel').find('.back-to-list').on('click', showPoiList);

    $('#undo-actions').on('click', function(){

        if(ambiarc.history.length > 1) {
            var historyLastOp = ambiarc.history.length - 1;
            // ambiarc.poiList[currentLabelId] = ambiarc.history[historyLastOp - 1];
            ambiarc.poiList[currentLabelId] = jQuery.extend({}, ambiarc.history[historyLastOp - 1]);
            ambiarc.history = ambiarc.history.slice(0, -1);
        }

        fillDetails(ambiarc.poiList[currentLabelId]);

        //updating map label
        ambiarc.updateMapLabel(currentLabelId, ambiarc.poiList[currentLabelId].type, ambiarc.poiList[currentLabelId]);
    });


    $('#poi-select-button').on('click', showIconsPanel);


    $('#import-btn').on('click', importData);
    $('#export-btn').on('click', exportData);
    $('#new-scene-btn').on('click', newScene);

    $('#poi-browse-icons').on('click', function(){
        $('#icon-file-hidden').trigger('click');
    });

    $('.icon-sample').on('click', iconImageHandler);

    $('#icon-file-hidden').on('change', importIconHandler);



    //UPDATE POI DATA HANDLERS

    $('#poi-title').on('change', function(){
        updatePoiDetails('label', $(this).val())
    });

    $('#poi-type').on('change', function(){
        updatePoiDetails('type', $(this).val())
    });

    $('#poi-font-size').on('change', function(){
        updatePoiDetails('fontSize', $(this).val())
    });

    $('#poi-bulding-id').on('change', function(){
        updatePoiDetails('buildingId', $(this).val())
    });

    $('#poi-floor-id').on('change', function(){
        updatePoiDetails('floorId', $(this).val())
    });

    $('#poi-label-latitude').on('change', function(){
        updatePoiDetails('latitude', $(this).val())
    });

    $('#poi-label-longitude').on('change', function(){
        updatePoiDetails('longitude', $(this).val())
    });

    $('#poi-tooltip-title').on('change', function(){
        updatePoiDetails('tooltipTitle', $(this).val())
    });

    $('#poi-tooltip-body').on('change', function(){
        updatePoiDetails('tooltipBody', $(this).val())
    });

    $('#poi-tooltips-toggle').on('change', function(){
        updatePoiDetails('showToolTip', $(this).is(':checked'));
    });

    $('body').on('change', '.poi-floor-id', function(){
        updatePoiDetails('floorId', $(this).val());
    })

    $('body').on('change', '#poi-bulding-id', function(){
        updatePoiDetails('floorId', $(this).val());
    })

    $('#poi-delete').on('click', function(){

        ambiarc.destroyMapLabel(currentLabelId);
        deletePoiData(currentLabelId);
        updatePoiList();
        showPoiList();
    });
});


var showPoiList = function(){
    emptyDetailsData();
    $('.poi-details-panel').addClass('invisible');
    $('.poi-list-panel').removeClass('invisible');

    currentLabelId = undefined;
}


// Creates a Text MapLabel on the map where the current mouse position is
var createTextLabel = function() {
    // var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
    // getMapPositionAtCursor is a convenience method that return a map world position where the mouse is on screen XY

    // ambiarc.getMapPositionAtCursor((vector3) => {
    ambiarc.getMapPositionAtCursor(ambiarc.coordType.gps, (latlon) => {

        var mapLabelInfo = {
            buildingId: mainBldgID,
            floorId: currentFloorId,
            latitude: latlon.lat,
            longitude:latlon.lon,
            label: 'Ambiarc Text Label: ' + poisInScene.length,
            fontSize: 24,
            category: 'Label',
            showOnCreation: true,
            type: 'Text',
            showToolTip: false,
            tooltipTitle: '',
            tooltipBody: ''
        };

    // Add the map label to the map
    ambiarc.createMapLabel(ambiarc.mapLabel.Text, mapLabelInfo, (labelId) => {
        // Callback triggered once the label is added
        mapLabelCreatedCallback(labelId, mapLabelInfo.label, mapLabelInfo);
});
});
}

// Creates an Icon MapLabel on the map where the current mouse position is
var createIconLabel = function() {
    // var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;

    // ambiarc.getMapPositionAtCursor((vector3) => {
    ambiarc.getMapPositionAtCursor(ambiarc.coordType.gps, (latlon) => {

        var mapLabelInfo = {
            buildingId: mainBldgID,
            floorId: currentFloorId,
            latitude: latlon.lat,
            longitude:latlon.lon,
            category: 'Label',
            location: 'Default',
            partialPath: 'Information',
            showOnCreation: true,
            type: 'Icon',
            showToolTip: false,
            tooltipTitle: '',
            tooltipBody: '',
            base64: testImage
        };
    ambiarc.createMapLabel(ambiarc.mapLabel.Icon, mapLabelInfo, (labelId) => {
        var mapLabelName = 'Ambiarc Icon Label: ' + poisInScene.length;
    mapLabelCreatedCallback(labelId, mapLabelName, mapLabelInfo);
});
});
}
// Callback thats updates the UI after a POI is created
var mapLabelCreatedCallback = function(labelId, labelName, mapLabelInfo) {
    // push reference of POI to list
    poisInScene.push(labelId);
    ambiarc.poiList[labelId] = mapLabelInfo;
    addElementToPoiList(labelId, labelName, mapLabelInfo);
}

// HTML floor selector clicked action, this method will place the map into floor selector mode when the HTML is active
var dropdownClicked = function() {

    if (!isFloorSelectorEnabled) {
        $("#levels-dropdown").addClass('open');
        $("#levels-dropdown-button").attr('aria-expanded', true);
        isFloorSelectorEnabled = true;
    } else {
        $("#levels-dropdown").removeClass('open');
        $("#levels-dropdown-button").attr('aria-expanded', false);
        isFloorSelectorEnabled = false;
        $("#currentFloor").text("Exterior");
    }
    // var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
    //calling viewFloorSelector when in floor selector mode will exit floor selector mode
    ambiarc.viewFloorSelector(mainBldgID);
};

// subscribe to the AmbiarcSDK loaded event
var iframeLoaded = function() {
    $("#ambiarcIframe")[0].contentWindow.document.addEventListener('AmbiarcAppInitialized', function() {
        onAmbiarcLoaded();
    });
}
// once Ambiarc is loaded, we can use the ambiarc object to call SDK functions
var onAmbiarcLoaded = function() {
    ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
    // Subscribe to various events needed for this application
    ambiarc.registerForEvent(ambiarc.eventLabel.RightMouseDown, onRightMouseDown);
    ambiarc.registerForEvent(ambiarc.eventLabel.FloorSelected, onFloorSelected);
    ambiarc.registerForEvent(ambiarc.eventLabel.FloorSelectorEnabled, onEnteredFloorSelector);
    ambiarc.registerForEvent(ambiarc.eventLabel.FloorSelectorDisabled, onExitedFloorSelector);
    ambiarc.registerForEvent(ambiarc.eventLabel.FloorSelectorFloorFocusChanged, onFloorSelectorFocusChanged);
    ambiarc.registerForEvent(ambiarc.eventLabel.MapLabelSelected, mapLabelClickHandler);
    ambiarc.poiList = {};

    fillBuildingsList();


    // Create our floor selector menu with data fromt the SDK
    ambiarc.getAllBuildings((bldgs) => {
        mainBldgID = bldgs[0];
    ambiarc.getAllFloors(mainBldgID, (floors) => {
        addFloorToFloor(null, mainBldgID, "Exterior");
    for (f in floors) {
        addFloorToFloor(floors[f].id, mainBldgID, floors[f].positionName);
    }
    $('#bootstrap').removeAttr('hidden');
});
});
    $('#controls-section').fadeIn();
}
// creates the right-click menu over the map
var onRightMouseDown = function(event) {

    $(poiMenuSelector).css('top', $(window).height() - event.detail.pixelY + "px");
    $(poiMenuSelector).css('left', event.detail.pixelX + "px");

    if(currentLabelId){


        repositionLabel();
        return;
    }

    if (!isFloorSelectorEnabled) {
        $('#bootstrap').trigger('contextmenu');
    }
    console.log("Ambiarc received a RightMouseDown event");
}

var autoSelectFloor = function(){

    // console.log("AUTO SELECTING FLOOR...");

    if(mainBldgID){
        // console.log("MAIN BUILDING ID DEFINED!");
        ambiarc.getAllFloors(mainBldgID, function(floors){
            currentFloorId = floors[0].id;
            ambiarc.registerForEvent(ambiarc.eventLabel.FloorSelected, mainBldgID, floors[0].id);
        })
    }
    else {
        console.log("main building id undefiend....");
    }
}

// closes the floor menu when a floor was selected
var onFloorSelected = function(event) {
    var floorInfo = event.detail;
    currentFloorId = floorInfo.floorId;
    if (isFloorSelectorEnabled) {
        $("#levels-dropdown").removeClass('open');
        $("#levels-dropdown-button").attr('aria-expanded', false);
        isFloorSelectorEnabled = false;
    }
    console.log("Ambiarc received a FloorSelected event with a buildingId of " + floorInfo.buildingId + " and a floorId of " + floorInfo.floorId);
}
// expands the floor menu when the map enter Floor Selector mode
var onEnteredFloorSelector = function(event) {
    var buildingId = event.detail;
    currentFloorId = undefined;
    if (!isFloorSelectorEnabled) {
        isFloorSelectorEnabled = true;
        $("#levels-dropdown").addClass('open');
        $("#levels-dropdown-button").attr('aria-expanded', true);
    }
    console.log("Ambiarc received a FloorSelectorEnabled event with a building of " + buildingId);
}
// closes the floor menu when a floor selector mode was exited
var onExitedFloorSelector = function(event) {
    var buildingId = event.detail;
    currentFloorId = undefined;
    if (isFloorSelectorEnabled) {
        $("#levels-dropdown").removeClass('open');
        $("#levels-dropdown-button").attr('aria-expanded', false);
        isFloorSelectorEnabled = false;
    }
    console.log("Ambiarc received a FloorSelectorEnabled event with a building of " + buildingId);
}
// closes the floor menu when a floor selector mode was exited
var onFloorSelectorFocusChanged = function(event) {
    console.log("Ambiarc received a FloorSelectorFocusChanged event with a building id of: " + event.detail.buildingId +
        " and a new floorId of " + event.detail.newFloorId + " coming from a floor with the id of " + event.detail.oldFloorId);
}


var mapLabelClickHandler = function(event) {

    if(event.detail == currentLabelId){
        return;
    }
    currentLabelId = event.detail;
    var mapLabelInfo = ambiarc.poiList[event.detail];


    //creating clone of mapLabelInfo object - storing operations for undo
    var initialObj = jQuery.extend({}, mapLabelInfo);
    ambiarc.history = [];
    ambiarc.history.push(initialObj);

    fillDetails(mapLabelInfo);
    // ambiarc.focusOnMapLabel(event.detail, event.detail);

    $('.poi-list-panel').addClass('invisible');
    $('.poi-details-panel').removeClass('invisible');

}


// this is called when the user deletes a POI from the list men

    var firstFloorSelected = function(pId) {
        var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
        ambiarc.focusOnFloor(mainBldgID, 'L002');
    };

    var secondFloorSelected = function(pId) {
        var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
        ambiarc.focusOnFloor(mainBldgID, 'L003');
    };


var listPoiClosed = function(mapLabelId) {
    // var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
    // destroys the map label removing it from the map
    ambiarc.destroyMapLabel(mapLabelId);
    // remove the POI from our list
    var index = poisInScene.indexOf(mapLabelId);
    poisInScene.splice(index, 1);
    // remove POI from the UI
    $("#" + mapLabelId).fadeOut(300, function() {
        $("#" + mapLabelId).remove();
    });
};
// adds a POI to the HTML list
var addElementToPoiList = function(mapLabelId, mapLabelName, mapLabelInfo) {

    var item = $("#listPoiTemplate").clone().attr('id', mapLabelId).appendTo($("#listPoiContainer"));
    var bldg = 'Building 1';
    var floorNum = 'Floor 1';
    var timestamp = Date.now(),
        date = new Date(timestamp),
        year = date.getFullYear(),
        month = date.getMonth()+1,
        day = date.getDate(),
        hours = date.getHours(),
        minutes = date.getMinutes();

    var fullDate = year+'/'+month+'/'+day;
    var fullTime = hours+'/'+minutes;
    var icon = mapLabelInfo.type == 'Text' ? 'poi-icon poi-text' : 'poi-icon poi-envelope';

    $(item).find('.list-poi-icon').addClass(icon);
    $(item).find('.list-poi-label').html(mapLabelName);
    $(item).find('.list-poi-bldg').html(bldg);
    $(item).find('.list-poi-floor').html(floorNum);
    $(item).find('.list-poi-dtime').html('Added '+fullDate+' at '+fullTime);


    //setting list item click handler
    $(item).on('click', function(){
        currentLabelId = mapLabelId;

        var initState = jQuery.extend({}, ambiarc.poiList[currentLabelId]);
        ambiarc.history = [];
        ambiarc.history.push(initState);

        fillDetails(mapLabelInfo);
        ambiarc.focusOnMapLabel(mapLabelId, mapLabelId);

        $('.poi-list-panel').addClass('invisible');
        $('.poi-details-panel').removeClass('invisible');
    });
};


//refreshing poi list items
var updatePoiList = function(){

    $('#listPoiContainer').html('');

    $.each(ambiarc.poiList, function(id, poiData){
        addElementToPoiList(id, poiData.label, poiData);
    });
}
// adds a floor to the HTML floor selector
var addFloorToFloor = function(fID, bID, name) {
    var item = $("#floorListTemplate").clone().removeClass("invisible").appendTo($("#floorContainer"));
    item.children("a.floorName").text("" + name).on("click", function() {
        // var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
        // clicking on the floor selector list item will tell Ambiarc to isolate that floor
        if (fID != undefined) {
            ambiarc.focusOnFloor(bID, fID);
            $("#currentFloor").text(name);
        } else {
            ambiarc.viewFloorSelector(bID);
            $("#currentFloor").text(name);
        }
    });
};

var fillDetails = function(mapLabelInfo){

    emptyDetailsData();

    if(mapLabelInfo.type == 'Text' || mapLabelInfo.type == 'TextIcon'){
        $('#poi-title').val(mapLabelInfo.label);
        $('#poi-font-size').val(mapLabelInfo.fontSize);
        $('#poi-title').attr("disabled", false);
        $('#poi-font-size').attr("disabled", false);
    }
    else {
        $('#poi-title').val('');
        $('#poi-font-size').val('');
        $('#poi-title').attr("disabled", true);
        $('#poi-font-size').attr("disabled", true);
    }


    $('#poi-type').val(mapLabelInfo.type);
    $('#poi-bulding-id').val(mapLabelInfo.buildingId);
    $('.poi-floor-id[data-bldgid = "'+mapLabelInfo.buildingId+'"]').val(mapLabelInfo.floorId);
    $('#poi-label-latitude').val(mapLabelInfo.latitude);
    $('#poi-label-longitude').val(mapLabelInfo.longitude);
    $('#poi-tooltips-toggle').prop('checked', mapLabelInfo.showToolTip);
    $('#poi-tooltip-title').val(mapLabelInfo.tooltipTitle);
    $('#poi-tooltip-body').val(mapLabelInfo.tooltipBody);
    $('#poi-icon-image').css('background-image', 'url("'+mapLabelInfo.base64+'")');

}

var labelTypeObj = function(labelString){

    switch (labelString) {
        case 'Text':
            return ambiarc.mapLabel.Text;

        case 'Icon':
            return ambiarc.mapLabel.Icon;

        case 'TextIcon':
            return ambiarc.mapLabel.TextIxon;
    }
}


var collectPoiData = function(){

    var MapLabelType = labelTypeObj($('#poi-type').val()),
        buildingId = $('#poi-bulding-id').val(),
        floorId = $('#poi-floor-id').val(),
        latitude = parseFloat($('#poi-label-latitude').val()),
        longitude = parseFloat($('#poi-label-longitude').val()),
        showOnCreation = $('#poi-creation-show').is(':checked'),
        showToolTip = $('#poi-tooltips-toggle').is(':checked'),
        tooltipTitle = $('#poi-tooltip-title').val(),
        tooltipBody = $('#poi-tooltip-body').val(),
        fontSize = parseInt($('#poi-font-size').val()) || 24, //if no font set, set default value to 24
        label = $('#poi-title').val();

    var MapLabelProperties = {
        buildingId: buildingId,
        floorId: floorId,
        latitude: latitude,
        longitude: longitude,
        showOnCreation: showOnCreation,
        showToolTip: showToolTip,
        tooltipTitle: tooltipTitle,
        tooltipBody: tooltipBody,
        fontSize: fontSize,
        label: label,
        category: 'Label',
        type: MapLabelType,
        location: 'Default',
        partialPath: 'Information'
    }

    return {
        MapLabelProperties: MapLabelProperties,
        MapLabelType: MapLabelType,
    };
}


var fillBuildingsList = function(){

    ambiarc.getAllBuildings(function(buildings){
        $.each(buildings, function(id, bldgValue){

            var bldgListItem = document.createElement('option');
                bldgListItem.clasName = 'bldg-list-item';
                bldgListItem.value = bldgValue;
                bldgListItem.textContent = bldgValue;

            var floorList = document.createElement('select');
                floorList.className = 'poi-floor-id poi-details-input form-control';
                floorList.setAttribute('data-bldgId', bldgValue);

            $('#poi-bulding-id').append(bldgListItem);
            $('#poi-floor-lists').append(floorList);

            ambiarc.getAllFloors(bldgValue, function(floors){
                $.each(floors, function(i, floorValue){

                    //poi details panel floor dropdown
                    var floorItem = document.createElement('option');
                        floorItem.clasName = 'floor-item';
                        floorItem.value = floorValue.id;
                        floorItem.textContent = floorValue.id;

                    $(floorList).append(floorItem);


                    // main building-floor dropdown
                    var listItem = document.createElement('option');
                        listItem.clasName = 'bldg-floor-item';
                        listItem.value = bldgValue+'::'+floorValue.id;
                        listItem.textContent = bldgValue+': '+floorValue.id;

                    $('#bldg-floor-select').append(listItem);

                });

                //To do: add display/hide list conditioning when more than 1 building....

            });
        })
    })
}


var deletePoiData = function(){
    delete ambiarc.poiList[currentLabelId];
    emptyDetailsData();
}


var emptyDetailsData = function(){
    $('#poi-title').val('');
    $('#poi-font-size').val('');
    $('#poi-type').val('Text');
    $('#poi-bulding-id').val('');
    $('#poi-label-latitude').val('');
    $('#poi-label-longitude').val('');
    $('#poi-floor-id').val('');
    $('#poi-tooltip-title').val('');
    $('#poi-tooltip-body').val('');
    $('#poi-new-key').val('');
    $('#poi-new-value').val('');
    $('#poi-creation-show').prop('checked', true);
    $('#poi-tooltips-toggle').prop('checked', false);


}


var updatePoiDetails = function(changedKey, changedValue){

    //collecting poi details
    var MapLabelData = collectPoiData();
    var labelProperties = MapLabelData.MapLabelProperties;
    var bldgId = $('#poi-bulding-id').val();
    var floorId = $("[data-bldgId="+bldgId+"]").val();
    labelProperties.floorId = floorId;

    //storing object clone for undo functionality
    var cloneObj = jQuery.extend({}, labelProperties);
    ambiarc.history.push(cloneObj);

    if($('#poi-type').val() == 'Icon'){
        $('#poi-title').attr("disabled", true);
        $('#poi-font-size').attr("disabled", true);
    }
    else {
        $('#poi-title').attr("disabled", false);
        $('#poi-font-size').attr("disabled", false);
    }

    //updating map label
    ambiarc.updateMapLabel(currentLabelId, MapLabelData.MapLabelType, labelProperties);

    // If it's pair (longitude and latitude)
    if (typeof changedKey == 'object') {

        for(var i=0; i<changedKey.length; i++){
            ambiarc.poiList[currentLabelId][changedKey[i]] = changedValue[i];
        }
    }
    else {
        //applying changed value to ambiarc.poiList object for current label
        ambiarc.poiList[currentLabelId][changedKey] = changedValue;
    }


    var listItem = $('#'+currentLabelId);
        $(listItem).find('.list-poi-label').html(labelProperties.label);
        $(listItem).find('.list-poi-bldg').html('Building '+labelProperties.buildingId);
        $(listItem).find('.list-poi-floor').html('Floor '+labelProperties.floorId);

    toggleSaveButton();
}


var importData = function(){
    $('#import-file').click();
}


var exportData = function(){

    var exportData = {
        type: "FeatureCollection",
        features: []
    };

    $.each(ambiarc.poiList, function(i, labelInfo){

        var properties = {
            buildingId: labelInfo.buildingId,
            category: labelInfo.category,
            floorId: labelInfo.floorId,
            showOnCreation: labelInfo.showOnCreation,
            showToolTip: labelInfo.showToolTip,
            type: labelInfo.type
        };

        var geometry = {
            type: "Point",
            coordinates: [
                labelInfo.longitude,
                labelInfo.latitude
            ]
        };

        if(properties.category !== 'Icon'){
            properties.fontSize = labelInfo.fontSize;
            properties.label = labelInfo.label;
        }

        var feature = {
            type: "Feature",
            properties: properties,
            geometry: geometry
        };
        exportData.features.push(feature);
    });

    downloadObjectAsJson(exportData, 'geoJSON_'+Date.now());
}


var newScene = function(){

    var r = confirm("Creating new scene will remove all points of interest from map and panel!");
    if (r == true) {
        destroyAllLabels();
    }
};


var toggleSaveButton = function(){

    $('.saved-btn').removeClass('invisible');
    setTimeout(function(){
        $('.saved-btn').addClass('invisible');
    }, 3000);
};


var destroyAllLabels = function(){

     $.each(ambiarc.poiList, function(MapLabelID, a){
         ambiarc.destroyMapLabel(parseInt(MapLabelID));
     });

     ambiarc.poiList = {};
     poisInScene = [];

    updatePoiList();
    showPoiList();
};


var iconImageHandler = function(){

    console.log("icon image handler!");
    $('.selected-icon').removeClass('selected-icon');
    $(this).addClass('selected-icon');

}


var importIconHandler = function(){

    $('#poi-browse-text').html();

    if(!input){
        var input = $('#icon-file-hidden')[0];
    }
    var file;

    if (typeof window.FileReader !== 'function') return;

    else if (!input.files) {
        console.log("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else {
        file = input.files[0];
        fr = new FileReader();
        fr.onload = function(image){
            console.log("image loaded!");
            console.log(image);
            var imagePath = $('#icon-file-hidden').val();
            var imageName = imagePath.split('fakepath\\')[1];

            $('#poi-browse-text').html(imageName);
        }
        fr.readAsDataURL(file);
    }
}


var showIconsPanel = function(){
    $('.poi-list-panel').addClass('invisible');
    $('.poi-details-panel').addClass('invisible');
    $('.icons-list-panel').removeClass('invisible');
}


var importFileHandler = function(evt){

    if(!input){
        var input = $('#import-file')[0];
    }
    var file;

    if (typeof window.FileReader !== 'function') return;

    else if (!input.files) {
        console.log("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else {

        file = input.files[0];
        fr = new FileReader();
        fr.onload = function(test){

            var base64result = fr.result.split(',')[1];

            try {
                parsedJson = JSON.parse(window.atob(base64result));
                fillGeoData(parsedJson);
            }
            catch(e){
                alert("Please select valid json file");
                return;
            }
        }

        fr.readAsDataURL(file);
    }
};


var fillGeoData = function(properties){

    $.each(properties.features, function(i, feature){
        var mapLabelInfo = feature.properties;
        mapLabelInfo.longitude = feature.geometry.coordinates[0];
        mapLabelInfo.latitude = feature.geometry.coordinates[1];

        ambiarc.createMapLabel(mapLabelInfo.type, mapLabelInfo,(labelId) => {
            mapLabelCreatedCallback(labelId, mapLabelInfo.label, mapLabelInfo);
        })
    })
};


var downloadObjectAsJson = function (exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
};


var repositionLabel = function(){

    ambiarc.getMapPositionAtCursor(ambiarc.coordType.gps, (latlon) => {

        $('#poi-label-latitude').val(latlon.lat);
        $('#poi-label-longitude').val(latlon.lon);

        updatePoiDetails(['longitude', 'latitude'], [latlon.lat, latlon.lon]);
    });
}