var iconDefault;
// saved main build reference
var mainBldgID;
// reference to custom rightclick menu reference
var poiMenuSelector;
// global state indicating if the map is is Floor Selector mode
var isFloorSelectorEnabled = false;
// tracked references to POI's
var poisInScene = [];
// global lobal state indicating the current sleected floor
// var currentFloorId = 'L002';
var currentLabelId, ambiarc, fr, parsedJson;
// key vlue on input field click
var pairFocusKey;
var currentBuildingId;

var regularFeatures = [
    'label',
    'fontSize',
    'base64',
    'buildingId',
    'category',
    'floorId',
    'latitude',
    'longitude',
    'location',
    'partialPath',
    'showOnCreation',
    'showToolTip',
    'tooltipBody',
    'tooltipTitle',
    'type'
];

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

    $('.filter-by-location').on('click', function(){
        console.log("filter by location!");

    });


    $('.filter-by-name').on('click', sortByName);

    $('.filter-by-time').on('click', sortByTime);


    $('#import-file').on('change', importFileHandler);

    $('.poi-list-panel').find('.header-button').on('click', function(){
        $('.header-button').removeClass('selected').removeClass('btn-primary').removeClass('btn-selected');
        $(this).addClass('btn-primary').addClass('btn-selected');
    });

    $('.sort-button').on('click', function(){

        console.log("clicked sort button!");
        $('.sort-button').removeClass('selected').removeClass('btn-primary').removeClass('btn-selected');
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

        if(ambiarc.poiList[currentLabelId].floorId != currentFloorId){
            console.log("FOCUSING!!");
            ambiarc.focusOnFloor(ambiarc.poiList[currentLabelId].buildingId, ambiarc.poiList[currentLabelId].floorId);
        }
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

    $('body').on('focusin', '.poi-new-key', function(e){
        console.log("FOCUS ON KEY...");
        pairFocusKey = $(this).val();
        console.log(pairFocusKey);
    });


    $('#poi-add-pair').on('click', addNewPair);


    $('body').on('change', '.poi-new-key', updatePairKey);
    $('body').on('change', '.poi-new-value', updatePairValue);
    $('body').on('click', '.delete-pair', deletePairValue);

    $('body').on('click', '.value-to-number', valueToNumber);
    $('body').on('click', '.value-to-string', valueToString);


    $('body').on('change', '.poi-floor-id', function(){
        updatePoiDetails('floorId', $(this).val());
        // updateFloorId($(this).val());
    });

    $('body').on('change', '#poi-bulding-id', function(){
        updatePoiDetails('floorId', $(this).val());
    });

    $('#poi-delete').on('click', function(){

        ambiarc.destroyMapLabel(currentLabelId);
        deletePoiData(currentLabelId);
        updatePoiList();
        showPoiList();
    });

    $('#cancel-icon-select').on('click', showPoiDetails);

    $('#save-icon-select').on('click', saveNewIcon);

    iconDefault = $('.selected-icon').attr('src');
    console.log("defautl icon set!!");
    console.log(iconDefault);

});


var showPoiList = function(){
    emptyDetailsData();
    $('.poi-details-panel').addClass('invisible');
    $('.icons-list-panel').addClass('invisible');
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
            fontSize: 26,
            category: 'Label',
            location: 'Default',
            partialPath: 'Information',
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
    ambiarc.getMapPositionAtCursor(ambiarc.coordType.gps, (latlon) => {

        var mapLabelInfo = {
            buildingId: mainBldgID,
            floorId: currentFloorId,
            latitude: latlon.lat,
            longitude:latlon.lon,
            label: '',
            category: 'Label',
            location: 'Default',
            partialPath: 'Information',
            showOnCreation: true,
            type: 'Icon',
            showToolTip: false,
            tooltipTitle: '',
            tooltipBody: '',
            base64: iconDefault
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
        currentBuildingId = bldgs[0];
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

    console.log("event details:");
    console.log(event);

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

    console.log("FLOOR IS SELECTED!!!!!!!!!!!");

    var floorInfo = event.detail;
    currentFloorId = floorInfo.floorId;

    $('#bldg-floor-select').val(currentBuildingId+'::'+currentFloorId);
    if (isFloorSelectorEnabled) {
        $("#levels-dropdown").removeClass('open');
        $("#levels-dropdown-button").attr('aria-expanded', false);
        isFloorSelectorEnabled = false;
    }
    console.log("Ambiarc received a FloorSelected event with a buildingId of " + floorInfo.buildingId + " and a floorId of " + floorInfo.floorId);
}
// expands the floor menu when the map enter Floor Selector mode
var onEnteredFloorSelector = function(event) {

    console.log("ENTERED FLOOR!!");

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

    console.log("mab label click handler");
    console.log("event:");
    console.log(event);

    $('.poi-list-panel').addClass('invisible');
    $('.icons-list-panel').addClass('invisible');
    $('.poi-details-panel').removeClass('invisible');

    if(event.detail == currentLabelId){
        return;
    }
    currentLabelId = event.detail;
    var mapLabelInfo = ambiarc.poiList[currentLabelId];

    console.log(mapLabelInfo);


    //creating clone of mapLabelInfo object - storing operations for undo
    var initialObj = jQuery.extend({}, mapLabelInfo);
    ambiarc.history = [];
    ambiarc.history.push(initialObj);

    fillDetails(mapLabelInfo);
    // ambiarc.focusOnMapLabel(event.detail, event.detail);

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
var addElementToPoiList = function(mapLabelId, mapLabelName, mapLabelInfo, timestamp) {

    var item = $("#listPoiTemplate").clone();
        $(item).attr('id', mapLabelId);
        $(item).addClass('poi-item-wrapper');
        $(item).appendTo($("#listPoiContainer"));
    var bldg = 'Building 1';
    var floorNum = 'Floor 1';

    //if no timestamps, take current timestamp. Otherwise, use initial timestamps
    if(!timestamp){
        var timestamp = Date.now();
    };

    var date = new Date(parseInt(timestamp)),
        year = date.getFullYear(),
        month = date.getMonth()+1,
        day = date.getDate(),
        hours = date.getHours(),
        minutes = date.getMinutes();

    var fullDate = year+'/'+month+'/'+day;
    var fullTime = hours+'/'+minutes;

    // checking if set url64 image, if not set default behavior
    if(typeof mapLabelInfo.base64 !== 'undefined'){
        if(mapLabelInfo.base64 !== ''){
            var iconSrc = mapLabelInfo.base64;
        }else {
            var iconSrc = mapLabelInfo.type == 'Text' ? '../css/icons/ic_text_field.png' : '../css/icons/ic_admin_mail.png';
        }
    }
    else {
        var iconSrc = mapLabelInfo.type == 'Text' ? '../css/icons/ic_text_field.png' : '../css/icons/ic_admin_mail.png';
    }

    $(item).find('.list-poi-icon').css('background-image','url(\''+iconSrc+'\')');
    $(item).find('.list-poi-icon').addClass('poi-icon');
    $(item).find('.list-poi-label').html(mapLabelName);
    $(item).find('.list-poi-bldg').html(bldg);
    $(item).find('.list-poi-floor').html(floorNum);
    $(item).find('.list-poi-dtime').html('Added <span date-timestamp="'+timestamp+'" class="addedDate">'+fullDate+'</span> at '+fullTime);


    //setting list item click handler
    $(item).on('click', function(){
        currentLabelId = mapLabelId;

        console.log("CLICKED ITEM!!");
        console.log(ambiarc.poiList[currentLabelId]);

        var initState = jQuery.extend({}, ambiarc.poiList[currentLabelId]);
        ambiarc.history = [];
        ambiarc.history.push(initState);

        console.log("mapLabelInfo:");
        console.log(mapLabelInfo);

        fillDetails(mapLabelInfo);
        ambiarc.focusOnMapLabel(mapLabelId, mapLabelId);

        $('.poi-list-panel').addClass('invisible');
        $('.icons-list-panel').addClass('invisible');
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

//sorting poi list by name, date or location
var sortPoiList = function(array){

    $('#listPoiContainer').html('');

    $.each(array, function(i, el){
        console.log("each sortpoiitem:");
        console.log(i);
        console.log(el);
        addElementToPoiList(el.id, el.label, el, el.date);
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

    emptyDetailsData();

    var mapLabelInfo = ambiarc.poiList[currentLabelId];

    console.log("fill details function...");
    console.log("map label info:");
    console.log(mapLabelInfo)

    if(mapLabelInfo.type == 'Text' || mapLabelInfo.type == 'IconWithText'){
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



    //Fill key/value list
    $.each(mapLabelInfo, function(key, val){
        console.log("each mapabel key:");
        console.log(key);
        console.log("each maplabel val:");
        console.log(val);

        if(regularFeatures.indexOf(key) == -1){
            console.log("NO KEYY!!!!!!!!!!!!!!!");
            addNewPair(key, val);
        }
        else {
            console.log("key found......");
        }

    });

    console.log("check!!!!!!:");
    console.log(regularFeatures);

    if(mapLabelInfo.type !== 'Text'){
        $('#select-icon-group').show();
    }
    else {
        $('#select-icon-group').hide();
    }

    // if(mapLabelInfo.type !== 'Text'){
    //     $('#'+currentLabelId).find('.list-poi-icon').css('background-image', 'url("'+mapLabelInfo.base64+'")');
    // }

}

var labelTypeObj = function(labelString){

    switch (labelString) {
        case 'Text':
            return ambiarc.mapLabel.Text;

        case 'Icon':
            return ambiarc.mapLabel.Icon;

        case 'IconWithText':
            return ambiarc.mapLabel.IconWithText;
    }
}


var collectPoiData = function(){

    console.log("collect poi data");

    var MapLabelType = labelTypeObj($('#poi-type').val()),
        buildingId = $('#poi-bulding-id').val(),
        floorId = $('#poi-floor-id').val(),
        latitude = parseFloat($('#poi-label-latitude').val()),
        longitude = parseFloat($('#poi-label-longitude').val()),
        showOnCreation = $('#poi-creation-show').is(':checked'),
        showToolTip = $('#poi-tooltips-toggle').is(':checked'),
        tooltipTitle = $('#poi-tooltip-title').val(),
        tooltipBody = $('#poi-tooltip-body').val(),
        fontSize = parseInt($('#poi-font-size').val()) || 26, //if no font set, set default value to 26
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
        location: 'Default'
    };

    console.log("adding partialpath in collect data section:");
    var icon = $('#poi-icon-image').attr('data-image');
    if(icon && typeof icon !== 'undefined'){
        console.log("ADED!!");
        MapLabelProperties.partialPath = icon;
    }
    else {
        console.log("NOT FOUND :(");
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

    if(poisInScene.indexOf(currentLabelId) >-1){
        console.log("FOUND ELEMENT IN POISINSCENE!!");
        var elIndex = poisInScene.indexOf(currentLabelId);
        console.log("deleting....");
        poisInScene.splice(elIndex, 1);
    }

    // currentLabelId = undefined;
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

    console.log("changed key:");
    console.log(changedKey);
    console.log("changed value:");
    console.log(changedValue);

    // If it's pair (longitude and latitude)
    if (typeof changedKey == 'object') {

        for(var i=0; i<changedKey.length; i++){
            ambiarc.poiList[currentLabelId][changedKey[i]] = changedValue[i];
        }
    }
    else {
        //applying changed value to ambiarc.poiList object for current label
        console.log("applying changed values:");
        console.log("change key:");
        console.log(changedKey);
        console.log("changedValue");
        console.log(changedValue);

        ambiarc.poiList[currentLabelId][changedKey] = changedValue;
    }

    console.log("data collected");

    var labelProperties = ambiarc.poiList[currentLabelId];

    //storing object clone for undo functionality
    var cloneObj = jQuery.extend({}, labelProperties);
    ambiarc.history.push(cloneObj);

    if($('#poi-type').val() == 'Icon'){
        $('#poi-title').attr("disabled", true);
        $('#poi-font-size').attr("disabled", true);
        $('#select-icon-group').fadeIn();
    }
    if($('#poi-type').val() == 'IconWithText'){
        $('#select-icon-group').fadeIn();
        $('#poi-title').attr("disabled", false);
        $('#poi-font-size').attr("disabled", false);
    }
    if($('#poi-type').val() == 'Text'){
        $('#poi-title').attr("disabled", false);
        $('#poi-font-size').attr("disabled", false);
        $('#select-icon-group').fadeOut();
    }

    ambiarc.updateMapLabel(currentLabelId, labelProperties.type, labelProperties);

    var listItem = $('#'+currentLabelId);
        $(listItem).find('.list-poi-label').html(labelProperties.label);
        $(listItem).find('.list-poi-bldg').html('Building '+labelProperties.buildingId);
        $(listItem).find('.list-poi-floor').html('Floor '+labelProperties.floorId);

    updatePoiList();
    toggleSaveButton();

    if(ambiarc.poiList[currentLabelId].floorId != currentFloorId){
        console.log("FOCUSING!!");
        ambiarc.focusOnFloor(ambiarc.poiList[currentLabelId].buildingId, ambiarc.poiList[currentLabelId].floorId);
    }

};


var addNewPair = function(key, value){
    console.log("ADDING NEW PAIR...");

    var item = $("#pairKeyValueTemplate").find('li').clone()
        $(item).appendTo($("#poi-key-value-list"));

    if(key && value){
        $(item).find('.poi-new-key').val(key);
        $(item).find('.poi-new-value').val(value);
    }
}


var updatePairKey =  function(e){

    console.log("VALUE CHANGED!!");
    console.log("e:");
    console.log(e);

    var pairItem = $(this).closest('.pair-key-row');
    var key = $(pairItem).find('.poi-new-key').val();
    var value = $(pairItem).find('.poi-new-value').val();

    if(key == '' || value == ''){
        return;
    }

    if(pairFocusKey != '') {
        delete ambiarc.poiList[currentLabelId][pairFocusKey];
    }

    ambiarc.poiList[currentLabelId][key] = value;

    console.log("new poi values:");
    console.log(ambiarc.poiList[currentLabelId]);
};


var updatePairValue =  function(e){

    console.log("KEY CHANGED!!");
    console.log("e:");
    console.log(e);

    var pairItem = $(this).closest('.pair-key-row');
    var key = $(pairItem).find('.poi-new-key').val();
    var value = $(pairItem).find('.poi-new-value').val();

    if(key == '' || value == ''){
        return;
    }

    ambiarc.poiList[currentLabelId][key] = value;

    console.log("changing value!!");

};


var deletePairValue = function(){
    console.log("DELETE PAIR VALUE");

    var pairItem = $(this).closest('.pair-key-row');
    var keyName = $(pairItem).find('.poi-new-key').val();

    delete ambiarc.poiList[currentLabelId][keyName];
    $(pairItem).remove();
}


var valueToNumber = function(){
    var pairItem = $(this).closest('.pair-key-row');
    $(pairItem).find('.poi-new-value').attr('data-type','number');
    $(pairItem).find('.pair-type').html('(number)');
}


var valueToString = function(){
    var pairItem = $(this).closest('.pair-key-row');
    $(pairItem).find('.poi-new-value').attr('data-type','string');
    $(pairItem).find('.pair-type').html('(string)');
}


var updateFloorId = function(floorId){

    var newLabel = ambiarc.poiList[currentLabelId];
        newLabel.floorId = floorId;

    ambiarc.destroyMapLabel(currentLabelId);

    if(currentFloorId !== floorId){
        ambiarc.registerForEvent(ambiarc.eventLabel.CameraMotionCompleted, cameraCompletedHandler);
        ambiarc.focusOnFloor(newLabel.buildingId, newLabel.floorId, 1000);
    }
    else {
        ambiarc.createMapLabel(newLabel.type, newLabel, function(labelId){
            mapLabelCreatedCallback(labelId, newLabel.label, newLabel);
            deletePoiData(currentLabelId);
            currentLabelId = labelId;
            fillDetails(newLabel);
            updatePoiList();
        });
    }
};


var cameraCompletedHandler = function(event){

    var newLabel = ambiarc.poiList[currentLabelId];

    //1000 is mark for updating floor id camera movement
    if(event.detail == 1000){
        ambiarc.unregisterEvent(ambiarc.eventLabel.CameraMotionCompleted, cameraCompletedHandler);
        var buildingId = newLabel.buildingId;
        var floorId = newLabel.floorId;
        var buildingFloorValue = buildingId+'::'+floorId;
        $('#bldg-floor-select').val(buildingFloorValue);
        console.log("BLDG - FLOOR VALUE:");
        console.log(buildingFloorValue);

        ambiarc.createMapLabel(newLabel.type, newLabel, function(labelId){
            mapLabelCreatedCallback(labelId, newLabel.label, newLabel);
            deletePoiData(currentLabelId);
            currentLabelId = labelId;
            fillDetails(newLabel);
            updatePoiList();
        });
    }
};


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

        if(labelInfo.base64){
            properties.icon = labelInfo.base64;
        }
        if(labelInfo.location){
            properties.location = labelInfo.location;
        }
        if(labelInfo.partialPath){
            properties.partialPath = labelInfo.partialPath;
        }
        if(labelInfo.tooltipBody){
            properties.tooltipBody = labelInfo.tooltipBody;
        }
        if(labelInfo.tooltipTitle){
            properties.tooltipTitle = labelInfo.tooltipTitle;
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
    $('.selected-icon').removeClass('selected-icon');
    $(this).addClass('selected-icon');
};


var getBase64Image = function(img) {
    var canvas = document.createElement("canvas");

    canvas.width = img.width;
    canvas.height = img.height;
    canvas.id='test_canvas';
    // $('body').append(canvas);
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL();
    // return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    return dataURL;
};


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
            // console.log(image.srcElement.result);

            var imagePath = $('#icon-file-hidden').val();
            var imageName = imagePath.split('fakepath\\')[1];
            var base64String = image.srcElement.result;
            var trimmedBase64String = image.srcElement.result.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

            console.log("BASE64!");
            console.log(base64String);
            console.log("trimmed 64!");
            console.log(trimmedBase64String);

            $('#poi-browse-text').html(imageName);
            $('#poi-icon-image').css('background-image','url("'+base64String+'")');
            $('#poi-icon-image').removeAttr('data-image');
            $('#'+currentLabelId).find('.list-poi-icon').css('background-image', 'url("'+base64String+'")');


            ambiarc.poiList[currentLabelId].partialPath = trimmedBase64String;
            ambiarc.poiList[currentLabelId].base64 = base64String;
            ambiarc.poiList[currentLabelId].location = 'Base64';

            updatePoiDetails('partialPath', trimmedBase64String);
            showPoiDetails();
        }
        fr.readAsDataURL(file);
    }
};


var showIconsPanel = function(){
    $('.poi-list-panel').addClass('invisible');
    $('.poi-details-panel').addClass('invisible');
    $('.icons-list-panel').removeClass('invisible');
};


var showPoiDetails = function(){
    $('.poi-details-panel').removeClass('invisible');
    $('.poi-list-panel').addClass('invisible');
    $('.icons-list-panel').addClass('invisible');

    if(ambiarc.poiList[currentLabelId].type !== 'Text'){
        $('#select-icon-group').show();
    }
    else {
        $('#select-icon-group').hide();
    }
};

var saveNewIcon = function(){

    var imgSrc = $('.selected-icon').attr('src');
    var imgIcon = $('.selected-icon').attr('data-image');
    console.log("imgIcon:");
    console.log(imgIcon);
    var image = document.createElement('img');
        image.src = imgSrc;
    var base64String = getBase64Image(image);

    ambiarc.poiList[currentLabelId].base64 = base64String;
    ambiarc.poiList[currentLabelId].partialPath = imgIcon;
    ambiarc.poiList[currentLabelId].location = 'Default';
    $('#poi-icon-image').css('background-image','url("'+base64String+'")');
    $('#poi-icon-image').attr('data-image',imgIcon);
    $('#icon-file-hidden').val('');
    $('#poi-browse-text').html('');
    $('#'+currentLabelId).find('.list-poi-icon').css('background-image', 'url("'+base64String+'")');

    updatePoiDetails('partialPath', imgIcon);
    showPoiDetails();
};


var sortByName = function(){

    var sortingArray = [];

    $.each(ambiarc.poiList,function(i, el){
        var cloneObj = jQuery.extend({}, el);
        cloneObj.date = $('#'+i).find('.addedDate').attr('date-timestamp');
        cloneObj.id = i;

        sortingArray.push(cloneObj);
    });

    sortingArray = sortingArray.sort(function(a,b){
        if(a.label < b.label) return -1;
        if(a.label > b.label) return 1;
    });

    sortPoiList(sortingArray);
};


var sortByTime = function(){

    var sortingArray = [];

    $.each(ambiarc.poiList,function(i, el){
        var cloneObj = jQuery.extend({}, el);
        cloneObj.date = $('#'+i).find('.addedDate').attr('date-timestamp');
        cloneObj.id = i;

        sortingArray.push(cloneObj);
    });

    sortingArray = sortingArray.sort(function(a,b){
        if(a.date < b.date) return -1;
        if(a.date > b.date) return 1;
    });

    sortPoiList(sortingArray);
};


var importFileHandler = function(evt){

    console.log("import file handler!!");

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

            console.log("fr loaded!!");
            console.log("test:");
            console.log(test);

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

    console.log("fill geo data!!");
    console.log(properties);

    $.each(properties.features, function(i, feature){

        console.log("each key:");
        console.log(i);

        console.log("each feature:");
        console.log(feature);

        var mapLabelInfo = feature.properties;
        mapLabelInfo.longitude = feature.geometry.coordinates[0];
        mapLabelInfo.latitude = feature.geometry.coordinates[1];

        console.log("creating map label...");

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

    console.log("reposition label:");


    ambiarc.getMapPositionAtCursor(ambiarc.coordType.gps, (latlon) => {

        $('#poi-label-latitude').val(latlon.lat);
        $('#poi-label-longitude').val(latlon.lon);

        console.log(latlon)

        updatePoiDetails(['longitude', 'latitude'], [latlon.lon, latlon.lat]);
    });
}
