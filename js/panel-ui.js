// saved main build reference
var mainBldgID;
// reference to custom rightclick menu reference
var poiMenuSelector;
// global state indicating if the map is is Floor Selector mode
var isFloorSelectorEnabled = false;
// tracked references to POI's
var poisInScene = [];
// global lobal state indicating the current sleected floor
var currentFloorId, currentLabelId, ambiarc;

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


    $('.poi-list-panel').find('.header-button').on('click', function(){
        $('.header-button').removeClass('selected').removeClass('btn-primary').removeClass('btn-selected');
        $(this).addClass('btn-primary').addClass('btn-selected');
    });

    $('.poi-details-panel').find('.back-to-list').on('click', function(){

      console.log("back to list!!");
        $('.poi-details-panel').addClass('invisible');
        $('.poi-list-panel').removeClass('invisible');

        currentLabelId = undefined;

    });

    $('#import-btn').on('click', importData);
    $('#export-btn').on('click', exportData);
    $('#new-scene-btn').on('click', newScene);


    //UPDATE POI DATA HANDLERS

    $('#poi-title').on('change', function(){
        updatePoiDetails('label', $(this).val())})
});

// Creates a Text MapLabel on the map where the current mouse position is
var createTextLabel = function() {
    // var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
    // getMapPositionAtCursor is a convenience method that return a map world position where the mouse is on screen XY

    // ambiarc.getMapPositionAtCursor((vector3) => {
    ambiarc.getMapPositionAtCursor(ambiarc.coordType.gps, (latlon) => {

        var mapLabelInfo = {
            buildingId: mainBldgID,
            floorId: currentFloorId,
            // scenePosition: vector3,
            latitude: latlon.lat,
            longitude:latlon.lon,
            label: 'Ambiarc Text Label: ' + poisInScene.length,
            fontSize: 24,
            category: 'Label',
            showOnCreation: true,
            type: 'Text'
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
            // scenePosition: vector3,
            latitude: latlon.lat,
            longitude:latlon.lon,
            category: 'Label',
            location: 'Default',
            partialPath: 'Information',
            showOnCreation: true,
            type: 'icon'
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

    // autoSelectFloor();

    ambiarc.poiList = {};

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
}
// creates the right-click menu over the map
var onRightMouseDown = function(event) {

    $(poiMenuSelector).css('top', $(window).height() - event.detail.pixelY + "px");
    $(poiMenuSelector).css('left', event.detail.pixelX + "px");
    if (!isFloorSelectorEnabled) {
        $('#bootstrap').trigger('contextmenu');
    }
    console.log("Ambiarc received a RightMouseDown event");
}

var autoSelectFloor = function(){

    console.log("AUTO SELECTING FLOOR...");

    if(mainBldgID){
        console.log("MAIN BUILDING ID DEFINED!");
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
    currentLabelId = event.detail;
    var mapLabelInfo = ambiarc.poiList[event.detail];

    fillDetails(mapLabelInfo);
    ambiarc.focusOnMapLabel(event.detail, event.detail);

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

    $(item).on('click', function(){
        currentLabelId = mapLabelId;

        fillDetails(mapLabelInfo);

        ambiarc.focusOnMapLabel(mapLabelId, mapLabelId);

        $('.poi-list-panel').addClass('invisible');
        $('.poi-details-panel').removeClass('invisible');

    });
};
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
    $('#poi-label-latitude').val(mapLabelInfo.latitude);
    $('#poi-label-longitude').val(mapLabelInfo.longitude);

    $('#poi-floor-id').val(mapLabelInfo.floorId);

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
        fontSize = parseInt($('#poi-font-size').val()),
        label = $('#poi-title').val();

    var MapLabelProperties = {
        buildingId: buildingId,
        floorId: floorId,
        latitude: latitude,
        longitude: longitude,
        showOnCreation: showOnCreation,
        // showToolTip: showToolTip,
        // tooltipTitle: tooltipTitle,
        fontSize: fontSize,
        label: label,
        category: 'Label',
        type: MapLabelType
    }

    return {
        MapLabelProperties: MapLabelProperties,
        MapLabelType: MapLabelType,
    };

}


var updatePoiDetails = function(changedKey, changedValue){

    var MapLabelData = collectPoiData();
    var labelProperties = MapLabelData.MapLabelProperties;

    ambiarc.updateMapLabel(currentLabelId, MapLabelData.MapLabelType, labelProperties);

    //applying changed value to ambiarc.poiList object for current label
    ambiarc.poiList[currentLabelId][changedKey] = changedValue;

    var listItem = $('#'+currentLabelId);
    $(listItem).find('.list-poi-label').html(labelProperties.label);
    $(listItem).find('.list-poi-bldg').html('Building '+labelProperties.buildingId);
    $(listItem).find('.list-poi-floor').html('Floor '+labelProperties.floorId);
}


var importData = function(){
    console.log("Import data");
}

var exportData = function(){
    console.log("Export data");
}

var newScene = function(){
    console.log("New scene");
}