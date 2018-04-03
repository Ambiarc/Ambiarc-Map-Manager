var iconDefault;
// saved main build reference
var mainBldgID;
// reference to custom rightclick menu reference
var poiMenuSelector;
// global state indicating if the map is is Floor Selector mode
var isFloorSelectorEnabled = false;
// tracked references to POI's
var poisInScene = [];
// current active building
var currentBuildingId;
// key vlue on input field click
var pairFocusKey;
//bootstrap menu
var menu;
var currentLabelId, ambiarc, fr, parsedJson;

//default color values for custom color theme
var colorsInScene = {
    'Wall' : '#01abba',
    'Room' : '#01abba',
    'Restroom' : '#01abba',
    'Walkway' : '#01abba',
    'Stairs' : '#01abba',
    'Elevator' : '#01abba',
    'Escalator' : '#01abba',
    'Ramp' : '#01abba',
    'Non-Public' : '#01abba'
};

//list of mapLabel regular properties (non key-value section pairs vvalues)
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


    $('[data-toggle="tooltip"]').tooltip();

    var $body = $(document.body);

    menu = new BootstrapMenu('#bootstrap', {
        actions: [
            {
                name: 'Label',
                onClick: function () {
                    createTextLabel();
                    menu.close();
                }
            },
            {
                name: 'Icon',
                onClick: function () {
                    createIconLabel();
                    menu.close();
                }
            },
            {
                name: 'Label + Icon',
                onClick: function () {
                    createTextIcon();
                    menu.close();
                }
            },
            {
                name: 'Cancel',
                onClick: function (){
                    menu.close();
                }
            }
        ],
        menuEvent: 'right-click'
    });
    poiMenuSelector = menu.$menu[0];

    initColorPickers();


    $('#bldg-floor-select').on('change', function(){

        if($(this).val() == 'Exterior'){
            ambiarc.viewFloorSelector(mainBldgID, 1000);
            return;
        }

        var parsedValue = $(this).val().split('::');
        var buildingId = parsedValue[0];
        var floorId = parsedValue[1];

        ambiarc.focusOnFloor(buildingId, floorId)
    });



    //PANEL ELEMENTS HANDLERS

    $('.colorpicker_value').on('change', function(){

        var item = $(this).closest('.row');
        var key = $(item).attr('data-key');
        var value = $(this).val();

        colorsInScene[key] = value;

        ambiarc.setColorByCategory(key, value);
    });

    $('.filter-by-location').on('click', sortByLocation);

    $('.filter-by-name').on('click', sortByName);

    $('.filter-by-time').on('click', sortByTime);

    $('.dark-theme-btn').on('click', setDarkTheme);

    $('.light-theme-btn').on('click', setLightTheme);

    $('.custom-theme-btn').on('click', setCustomTheme);

    $('#import-file').on('change', importFileHandler);

    $('.poi-list-panel').find('.header-button').on('click', function(){

        if($(this).attr('id') == 'colors-section-button'){
            showColorsPanel();
        }
        else if($(this).attr('id') == 'points-section-button'){
            showPoiList();
        }

        $('.poi-list-panel').find('.header-button').removeClass('selected').removeClass('btn-primary').removeClass('btn-selected');
        $(this).addClass('btn-primary').addClass('btn-selected');
    });


    // marking/unmarking selected sort buttons
    $('.sort-button').on('click', function(){
        $('.sort-button').removeClass('selected').removeClass('btn-primary').removeClass('btn-selected');
        $(this).addClass('btn-primary').addClass('btn-selected');
    });

    // marking/unmarking selected color theme buttons
    $('.theme-btn').on('click', function(){
        $('.theme-btn').removeClass('selected').removeClass('btn-primary').removeClass('btn-selected');
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
            ambiarc.focusOnFloor(ambiarc.poiList[currentLabelId].buildingId, ambiarc.poiList[currentLabelId].floorId);
        }
    });


    $('#poi-select-button').on('click', showIconsPanel);


    $('#import-btn').on('click', importData);
    $('#export-btn').on('click', exportData);
    $('.confirm-delete-scene').on('click', newScene);

    $('.browse-button,#poi-browse-text').on('click', function(){
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

    $('#poi-creation-show').on('change', function(){
        updatePoiDetails('showOnCreation', $(this).is(':checked'));
    });


    $('body').on('focusin', '.poi-new-key', function(e){
        pairFocusKey = $(this).val();
    });


    $('#poi-add-pair').on('click', addNewPair);

    $('body').on('keyup', '.poi-new-value', function(e){
        console.log("key up!!");
        console.log($(this).val());
        var item = $(this).closest('.pair-key-row');
        var inputVal = $(this).val();

        if($.isNumeric(inputVal) || inputVal == ''){
            $(item).find('.value-to-number').fadeIn();
            $(item).find('.value-to-string').fadeIn();
        }
        else {
            $(item).find('.value-to-number').fadeOut();
            $(item).find('.value-to-string').fadeOut();
            $(item).find('.selected-value-type').removeClass('selected-value-type');
            $(item).find('.value-to-string').addClass('selected-value-type');
            $(item).find('.poi-new-value').attr('data-type','string');
        }
    });


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
});


var showColorsPanel = function(){
    console.log("SHOW COLORS PANEL!!");
    $('.poi-details-panel').addClass('invisible');
    $('.icons-list-panel').addClass('invisible');
    $('.poi-list-body').addClass('invisible');
    $('.colors-panel').removeClass('invisible');
}


var showPoiList = function(){
    console.log("SHO POI LIST!");
    emptyDetailsData();
    $('.poi-details-panel').addClass('invisible');
    $('.icons-list-panel').addClass('invisible');
    $('.colors-panel').addClass('invisible');
    $('.poi-list-panel').removeClass('invisible');
    $('.poi-list-body').removeClass('invisible');
    $('.poi-list-panel').find('.header-button.btn-selected').removeClass('btn-selected').removeClass('btn-primary');
    $('.poi-list-panel').find('#points-section-button').addClass('btn-selected').addClass('btn-primary');

    showInactivePoints();

    currentLabelId = undefined;
}


// Creates a Text MapLabel on the map where the current mouse position is
var createTextLabel = function () {
    // var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
    // getMapPositionAtCursor is a convenience method that return a map world position where the mouse is on screen XY

    // ambiarc.getMapPositionAtCursor((vector3) => {
    ambiarc.getMapPositionAtCursor(ambiarc.coordType.gps, (latlon) => {

        var mapLabelInfo = {
            buildingId: mainBldgID,
            floorId: currentFloorId,
            latitude: parseFloat(latlon.lat),
            longitude: parseFloat(latlon.lon),
            label: 'Ambiarc Text Label: ' + poisInScene.length,
            fontSize: 26,
            category: 'Label',
            location: 'Default',
            partialPath: 'Information',
            showOnCreation: true,
            type: ambiarc.mapLabel.Text,
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
var createIconLabel = function () {
    ambiarc.getMapPositionAtCursor(ambiarc.coordType.gps, (latlon) => {

        var mapLabelInfo = {
            buildingId: mainBldgID,
            floorId: currentFloorId,
            latitude: parseFloat(latlon.lat),
            longitude: parseFloat(latlon.lon),
            label: 'Information ',
            fontSize: 26,
            category: 'Label',
            location: 'Default',
            partialPath: 'Information',
            showOnCreation: true,
            type: ambiarc.mapLabel.Icon,
            showToolTip: false,
            tooltipTitle: '',
            tooltipBody: '',
            base64: iconDefault
        };
        ambiarc.createMapLabel(ambiarc.mapLabel.Icon, mapLabelInfo, (labelId) => {
            mapLabelCreatedCallback(labelId, mapLabelInfo.label, mapLabelInfo);
        });
    });
};


// Creates an Text + Icon on the map where the current mouse position is
var createTextIcon = function () {
    ambiarc.getMapPositionAtCursor(ambiarc.coordType.gps, (latlon) => {

        var mapLabelInfo = {
            buildingId: mainBldgID,
            floorId: currentFloorId,
            latitude: parseFloat(latlon.lat),
            longitude: parseFloat(latlon.lon),
            label: 'Information',
            fontSize: 26,
            category: 'Label',
            location: 'Default',
            partialPath: 'Information',
            showOnCreation: true,
            type: ambiarc.mapLabel.IconWithText,
            showToolTip: false,
            tooltipTitle: '',
            tooltipBody: '',
            base64: iconDefault
        };
        ambiarc.createMapLabel(ambiarc.mapLabel.IconWithText, mapLabelInfo, (labelId) => {
            mapLabelCreatedCallback(labelId, mapLabelInfo.label, mapLabelInfo);
        });
    });
};


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
    ambiarc.registerForEvent(ambiarc.eventLabel.CameraMotionCompleted, cameraCompletedHandler);
    ambiarc.registerForEvent(ambiarc.eventLabel.CameraMotionStarted, cameraStartedHandler);

    ambiarc.poiList = {};

    fillBuildingsList();
    $('#bootstrap').removeAttr('hidden');
    $('#controls-section').fadeIn();
    $('.panel-section').removeClass('invisible');

    document.addEventListener("contextmenu", function(e){
        e.preventDefault();
    }, false);
}
// creates the right-click menu over the map
var onRightMouseDown = function(event) {

    console.log("RIGHT MOUSE DOWN:");
    console.log(event);

    if(isFloorSelectorEnabled){
        return;
    }


    $(poiMenuSelector).css('top', $(window).height() - event.detail.pixelY + "px");
    $(poiMenuSelector).css('left', event.detail.pixelX + "px");

    if(currentLabelId){

        repositionLabel();
        return;
    }

    $('#bootstrap').trigger('contextmenu');

    console.log("Ambiarc received a RightMouseDown event");
}

var autoSelectFloor = function(){

    if(mainBldgID){
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

    if(currentFloorId !== null){
        $('#bldg-floor-select').val(currentBuildingId+'::'+currentFloorId);
    }
    else $('#bldg-floor-select').val('Exterior');
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
    currentFloorId = null;
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
    currentFloorId = null;
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

    console.log("map label clicked event:");
    console.log(event);

    if(!ambiarc.poiList[event.detail]){
        ambiarc.viewFloorSelector(mainBldgID);
        return;
    }

    $('.poi-list-panel').addClass('invisible');
    $('.icons-list-body').addClass('invisible');
    $('.colors-panel').addClass('invisible');
    $('.poi-details-panel').removeClass('invisible');
    $('.poi-list-body').addClass('invisible');
    $('.icons-list-panel').addClass('invisible');

    if(event.detail == currentLabelId){
        return;
    }
    currentLabelId = parseInt(event.detail);

    var mapLabelInfo = ambiarc.poiList[currentLabelId];

    //creating clone of mapLabelInfo object - storing operations for undo
    var initialObj = jQuery.extend({}, mapLabelInfo);
    ambiarc.history = [];
    ambiarc.history.push(initialObj);

    hideInactivePoints();
    fillDetails(mapLabelInfo);
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

    if(Object.keys(ambiarc.poiList).length > 0){
        $('.init-poi-text').hide();
        $('.sorting-section').show();
    }
    else {
        $('.init-poi-text').show();
        $('.sorting-section').hide();
    }

    var item = $("#listPoiTemplate").clone();
        $(item).attr('id', mapLabelId);
        $(item).addClass('poi-item-wrapper');
        $(item).appendTo($("#listPoiContainer"));
    var bldg = mapLabelInfo.buildingId;
    var floorNum = mapLabelInfo.floorId;

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
    var fullTime = hours+':'+minutes;

    // checking if set url64 image, if not set default behavior

    if(mapLabelInfo.type == 'Text'){
        var iconSrc = '../css/icons/ic_text_field.png';
    }
    else{
        if(typeof mapLabelInfo.base64 !== 'undefined'){
            if(mapLabelInfo.base64 !== ''){
                var iconSrc = mapLabelInfo.base64;
            }else {
                var iconSrc = mapLabelInfo.type == 'Text' ? '../css/icons/ic_text_field.png' : '../css/icons/ic_admin_info_v2.png';
            }
        }
        else {
            var iconSrc = mapLabelInfo.type == 'Text' ? '../css/icons/ic_text_field.png' : '../css/icons/ic_admin_info_v2.png';
        }
    }

    $(item).find('.list-poi-icon').css('background-image','url(\''+iconSrc+'\')');
    $(item).find('.list-poi-icon').addClass('poi-icon');
    $(item).find('.list-poi-label').html(mapLabelName);
    $(item).find('.list-poi-bldg').html(bldg);
    $(item).find('.list-poi-floor').html(floorNum);
    $(item).find('.list-poi-dtime').html('Added <span date-timestamp="'+timestamp+'" class="addedDate">'+fullDate+'</span> at '+fullTime);


    //setting list item click handler
    $(item).on('click', function(){
        currentLabelId = parseInt(mapLabelId);
        var initState = jQuery.extend({}, ambiarc.poiList[currentLabelId]);
        ambiarc.history = [];
        ambiarc.history.push(initState);

        fillDetails(mapLabelInfo);

        if($(this).find('.list-poi-floor').html() == ''){
            console.log("EMPTY STRING!!");
            ambiarc.focusOnMapLabel(mapLabelId, 100);
        }
        else {
            ambiarc.focusOnMapLabel(mapLabelId);
        }


        showPoiDetails();
    });
};


//refreshing poi list items
var updatePoiList = function(){

    $('#listPoiContainer').html('');

    $.each(ambiarc.poiList, function(id, poiData){
        addElementToPoiList(id, poiData.label, poiData);
    });

    if(Object.keys(ambiarc.poiList).length > 0){
        $('.init-poi-text').hide();
        $('.sorting-section').show();
    }
    else {
        $('.init-poi-text').show();
        $('.sorting-section').hide();
    }
};

//sorting poi list by name, date or location
var sortPoiList = function(array){

    $('#listPoiContainer').html('');

    $.each(array, function(i, el){;
        addElementToPoiList(el.id, el.label, el, el.date);
    });
};


// adds a floor to the HTML floor selector
var addFloorToFloor = function(fID, bID, name) {
    var item = $("#floorListTemplate").clone().removeClass("invisible").appendTo($("#floorContainer"));
    item.children("a.floorName").text("" + name).on("click", function() {
        var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
        console.log( $("#currentFloor"));
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

    console.log("FILL DETAILS!!");
    console.log(mapLabelInfo);

    emptyDetailsData();

    var mapLabelInfo = ambiarc.poiList[currentLabelId];

    if(mapLabelInfo.type == 'Text' || mapLabelInfo.type == 'IconWithText'){
        $('#poi-title').val(mapLabelInfo.label);
        $('#poi-font-size').val(mapLabelInfo.fontSize);
        $('#poi-title').attr("disabled", false);
        // $('#poi-font-size').attr("disabled", false);
        $('#poi-font-size').show();
    }
    else {
        $('#poi-title').val('');
        $('#poi-font-size').val('');
        $('#poi-title').attr("disabled", true);
        // $('#poi-font-size').attr("disabled", true);
        $('#poi-font-size').hide();
    }

    $('#poi-type').val(mapLabelInfo.type);
    $('#poi-bulding-id').val(mapLabelInfo.buildingId);
    $('.poi-floor-id[data-bldgid = "'+mapLabelInfo.buildingId+'"]').val(mapLabelInfo.floorId);
    $('#poi-label-latitude').val(parseFloat(toFixed(mapLabelInfo.latitude, 4)));
    $('#poi-label-longitude').val(parseFloat(toFixed(mapLabelInfo.longitude, 4)));
    $('#poi-tooltips-toggle').prop('checked', mapLabelInfo.showToolTip);
    $('#poi-tooltip-title').val(mapLabelInfo.tooltipTitle);
    $('#poi-tooltip-body').val(mapLabelInfo.tooltipBody);
    $('#poi-icon-image').css('background-image', 'url("'+mapLabelInfo.base64+'")');


    //Fill key/value list
    $.each(mapLabelInfo, function(key, val){

        if(regularFeatures.indexOf(key) == -1){
            addNewPair(key, val);
        }
    });

    if(mapLabelInfo.type !== 'Text'){
        $('#select-icon-group').show();
    }
    else {
        $('#select-icon-group').hide();
    }
};


var labelTypeObj = function(labelString){

    switch (labelString) {
        case 'Text':
            return ambiarc.mapLabel.Text;

        case 'Icon':
            return ambiarc.mapLabel.Icon;

        case 'IconWithText':
            return ambiarc.mapLabel.IconWithText;
    }
};


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
        MapLabelProperties.partialPath = icon;
    }

    return {
        MapLabelProperties: MapLabelProperties,
        MapLabelType: MapLabelType,
    };
};


var fillBuildingsList = function(){

    var bldgListItem = document.createElement('option');
        bldgListItem.clasName = 'bldg-list-item';
        bldgListItem.value = 'Exterior';
        bldgListItem.textContent = 'Exterior';

    $('#poi-bulding-id').append(bldgListItem);
    $('#bldg-floor-select').append(bldgListItem);

    ambiarc.getAllBuildings(function(buildings){
        mainBldgID = buildings[0];
        currentBuildingId = buildings[0];
        currentFloorId = null;


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
        });

    })
}


var deletePoiData = function(){
    delete ambiarc.poiList[currentLabelId];
    emptyDetailsData();

    if(poisInScene.indexOf(currentLabelId) >-1){
        var elIndex = poisInScene.indexOf(currentLabelId);

        poisInScene.splice(elIndex, 1);
    }
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
    $('#poi-key-value-list').html('');
    $('#icon-file-hidden').val('');
    $('#poi-browse-text').val('');


}


var updatePoiDetails = function(changedKey, changedValue){

    console.log("update poi details");

    // If it's pair (longitude and latitude)
    if (typeof changedKey == 'object') {

        for(var i=0; i<changedKey.length; i++){
            ambiarc.poiList[currentLabelId][changedKey[i]] = changedValue[i];
        }

        if(changedKey != 'floorId'){

            ambiarc.poiList[currentLabelId].floorId = currentFloorId;
            var newFloorId = currentFloorId;
        }
    }
    else {

        ambiarc.poiList[currentLabelId][changedKey] = changedValue;

    }

    var labelProperties = ambiarc.poiList[currentLabelId];
    if(newFloorId){
        labelProperties.floorId = newFloorId;
    }

    //storing object clone for undo functionality
    var cloneObj = jQuery.extend({}, labelProperties);
    ambiarc.history.push(cloneObj);

    if($('#poi-type').val() == 'Icon'){
        $('#poi-title').attr("disabled", true);
        $('#poi-title').val(labelProperties.label);
        $('#poi-font-size').fadeOut();
        $('#select-icon-group').fadeIn();
    }
    if($('#poi-type').val() == 'IconWithText'){
        $('#select-icon-group').fadeIn();
        $('#poi-title').attr("disabled", false);
        $('#poi-title').val(labelProperties.label);
        $('#poi-font-size').fadeIn();
        $('#poi-font-size').val(labelProperties.fontSize);
    }
    if($('#poi-type').val() == 'Text'){
        $('#poi-title').attr("disabled", false);
        $('#poi-title').val(labelProperties.label);
        $('#poi-font-size').val(labelProperties.fontSize);
        $('#poi-font-size').fadeIn();
        $('#select-icon-group').fadeOut();
    }

    console.log("before update:");
    console.log(ambiarc.poiList[currentLabelId]);
    console.log(currentFloorId);

    ambiarc.updateMapLabel(currentLabelId, labelProperties.type, labelProperties);

    var listItem = $('#'+currentLabelId);
        $(listItem).find('.list-poi-label').html(labelProperties.label);
        $(listItem).find('.list-poi-bldg').html('Building '+labelProperties.buildingId);
        $(listItem).find('.list-poi-floor').html('Floor '+labelProperties.floorId);

    updatePoiList();
    toggleSaveButton();
    hideInactivePoints();

    if(ambiarc.poiList[currentLabelId].floorId != currentFloorId){
        console.log("FOCUSING!!");
        ambiarc.focusOnFloor(ambiarc.poiList[currentLabelId].buildingId, ambiarc.poiList[currentLabelId].floorId);
    }

};


var addNewPair = function(key, value){

    var item = $("#pairKeyValueTemplate").find('li').clone();
        $(item).appendTo($("#poi-key-value-list"));

    if(key && value){
        $(item).find('.poi-new-key').val(key);
        $(item).find('.poi-new-value').val(value);
        $(item).find('.selected-value-type').removeClass('selected-value-type');

        //if value is number
        if(typeof value == 'number'){
            $(item).find('.value-to-number').addClass('selected-value-type');
            $(item).find('.poi-new-value').attr('data-type', 'number');
            $(item).find('.pair-type').html('(number)');
        }

        //value is string
        else {
            $(item).find('.value-to-string').addClass('selected-value-type');
            $(item).find('.poi-new-value').attr('data-type', 'string');
            $(item).find('.pair-type').html('(string)');
        }
    }
}


var updatePairKey =  function(e){

    var pairItem = $(this).closest('.pair-key-row');
    var key = $(pairItem).find('.poi-new-key').val();
    var value = $(pairItem).find('.poi-new-value').val();
    var dataType = $(pairItem).find('.poi-new-value').attr('data-type');

    delete ambiarc.poiList[currentLabelId][pairFocusKey];

    if(key == ''){
        return;
    }



    if(dataType == 'number'){
        value = parseFloat(value);
    }
    else {
        value = value.toString();
    }
    ambiarc.poiList[currentLabelId][key] = value;
};


var updatePairValue =  function(e){

    var pairItem = $(this).closest('.pair-key-row');
    var key = $(pairItem).find('.poi-new-key').val();
    var value = $(pairItem).find('.poi-new-value').val();
    var dataType = $(pairItem).find('.poi-new-value').attr('data-type');

    if(key == ''){
        return;
    }

    if(dataType == 'number'){
        value = parseFloat(value);
    }
    else {
        value = value.toString();
    }

    ambiarc.poiList[currentLabelId][key] = value;
};


var deletePairValue = function(){

    var pairItem = $(this).closest('.pair-key-row');
    var keyName = $(pairItem).find('.poi-new-key').val();

    delete ambiarc.poiList[currentLabelId][keyName];
    $(pairItem).remove();
}


var valueToNumber = function(){
    var pairItem = $(this).closest('.pair-key-row');
    $(pairItem).find('.poi-new-value').attr('data-type','number');
    $(pairItem).find('.pair-type').html('(number)');
    $(pairItem).find('.selected-value-type').removeClass('selected-value-type');
    $(this).addClass('selected-value-type');
    var key = $(pairItem).find('.poi-new-key').val();
    var value = $(pairItem).find('.poi-new-value').val();

    if(key == '' || value == ''){
        return;
    }

    ambiarc.poiList[currentLabelId][key] = parseFloat(value);
}


var valueToString = function(){
    var pairItem = $(this).closest('.pair-key-row');
    $(pairItem).find('.poi-new-value').attr('data-type','string');
    $(pairItem).find('.pair-type').html('(string)');
    $(pairItem).find('.selected-value-type').removeClass('selected-value-type');
    $(this).addClass('selected-value-type');
    var key = $(pairItem).find('.poi-new-key').val();
    var value = $(pairItem).find('.poi-new-value').val();

    if(key == '' || value == ''){
        return;
    }

    ambiarc.poiList[currentLabelId][key] = value.toString();
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
            currentLabelId = parseInt(labelId);
            fillDetails(newLabel);
            updatePoiList();
        });
    }
};


var cameraCompletedHandler = function(event){



    if(event.detail == 1000){
        ambiarc.focusOnFloor(mainBldgID);
        currentFloorId = null;
        $('#bldg-floor-select').val('Exterior');
        return;
    }

    if(event.detail == 100){
        console.log("CATCHING 100! ");
        $('#bldg-floor-select').val('Exterior');
    }



    if(typeof currentLabelId !== 'undefined'){
        hideInactivePoints(true);
    }
    else {
        showInactivePoints();

        if(currentFloorId !== null && currentFloorId !== undefined){
            //floor
            hideExteriorPoints();
        }
        else {
            //exterior
            showExteriorPoints();
        }

    }
};


var showExteriorPoints = function(){

    console.log("show exterior points!");

    $.each(ambiarc.poiList, function(id, properties){

        if(properties.floorId == null){
            ambiarc.showMapLabel(id);
        }
    });
}


var hideExteriorPoints = function(){

    console.log("hide exterior points!");

    $.each(ambiarc.poiList, function(id, properties){

        console.log("each id:");
        console.log(id);
        console.log("each properties:");
        console.log(properties);

        if(properties.floorId == null){
            ambiarc.hideMapLabel(id);
        }
    });
}


var cameraStartedHandler = function(){
    menu.close();
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

        var properties = {};
        var user_properties = {};
        var geometry = {
            type: 'Point',
            coordinates: []
        };

        $.each(labelInfo, function(key, value){

            if(key == 'longitude'){

                console.log("this is longitude:");
                console.log(value);

                geometry.coordinates[0] = parseFloat(value);
            }
            else if(key == 'latitude'){
                geometry.coordinates[1] = parseFloat(value);
            }
            else if (key == 'base64'){
                properties.base64 = value;
            }
            else if(regularFeatures.indexOf(key) > -1){
                properties[key] = value;
            }
            else {
                user_properties[key] = value;
            }
        });


        var feature = {
            type: "Feature",
            properties: properties,
            geometry: geometry,
            user_properties: user_properties
        };

        exportData.features.push(feature);
    });

    console.log("exported data:");
    console.log(exportData);
    downloadObjectAsJson(exportData, 'geoJSON_'+Date.now());
}


var newScene = function(){

    $('#exampleModal').modal('hide')

    destroyAllLabels();
    emptyDetailsData();

    $.each(colorsInScene, function(key, value){
        ambiarc.setColorByCategory(key, value);

        $('.colorpicker-element[data-key="'+key+'"]')
            .find('.colorpicker_value')
            .val(value)
            .trigger('change');
    });

    setLightTheme();
    $('#bldg-floor-select').val('Exterior');

    //1000 is id for setting focus to exterior
    ambiarc.viewFloorSelector(mainBldgID, 1000);
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
     colorsInScene = {
        'Wall' : '#01abba',
        'Room' : '#01abba',
        'Restroom' : '#01abba',
        'Walkway' : '#01abba',
        'Stairs' : '#01abba',
        'Elevator' : '#01abba',
        'Escalator' : '#01abba',
        'Ramp' : '#01abba',
        'Non-Public' : '#01abba'
    };

    updatePoiList();
    showPoiList();
};


var iconImageHandler = function(){
    $('.selected-icon').removeClass('selected-icon');
    $(this).addClass('selected-icon');

    var cloneObj = jQuery.extend({}, ambiarc.poiList[currentLabelId]);

    showTempIcon(cloneObj);
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

    $('#poi-browse-text').html('');

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

            var imagePath = $('#icon-file-hidden').val();
            var imageName = imagePath.split('fakepath\\')[1];
            var base64String = image.srcElement.result;
            var trimmedBase64String = image.srcElement.result.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

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
    $('.colors-panel').addClass('invisible');
    $('.icons-list-panel').removeClass('invisible');
};


var showPoiDetails = function(){

    ambiarc.updateMapLabel(currentLabelId, ambiarc.poiList[currentLabelId].type, ambiarc.poiList[currentLabelId]);

    $('.poi-details-panel').removeClass('invisible');
    $('.poi-list-panel').addClass('invisible');
    $('.poi-list-body').addClass('invisible');
    $('.colors-panel').addClass('invisible');
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
    var image = document.createElement('img');
        image.src = imgSrc;
    var base64String = getBase64Image(image);

    ambiarc.poiList[currentLabelId].base64 = base64String;
    ambiarc.poiList[currentLabelId].partialPath = imgIcon;
    ambiarc.poiList[currentLabelId].location = 'Default';
    ambiarc.poiList[currentLabelId].label = (ambiarc.poiList[currentLabelId].type == 'Icon') ? imgIcon : ambiarc.poiList[currentLabelId].label;
    $('#poi-icon-image').css('background-image','url("'+base64String+'")');
    $('#poi-icon-image').attr('data-image',imgIcon);
    $('#icon-file-hidden').val('');
    $('#poi-browse-text').html('');
    $('#'+currentLabelId).find('.list-poi-icon').css('background-image', 'url("'+base64String+'")');

    updatePoiDetails('partialPath', imgIcon);
    showPoiDetails();
};


var showTempIcon = function(clonedObj){

    var imgSrc = $('.selected-icon').attr('src');
    var imgIcon = $('.selected-icon').attr('data-image');
    var image = document.createElement('img');
        image.src = imgSrc;
    var base64String = getBase64Image(image);

    clonedObj.base64 = base64String;
    clonedObj.partialPath = imgIcon;
    clonedObj.location = 'Default';

    ambiarc.updateMapLabel(currentLabelId, clonedObj.type, clonedObj);
};

var sortByLocation = function(){

    var sortingArray = [];

    $.each(ambiarc.poiList,function(i, el){
        var cloneObj = jQuery.extend({}, el);
        cloneObj.id = i;
        cloneObj.date = $('#'+i).find('.addedDate').attr('date-timestamp');
        sortingArray.push(cloneObj);
    });

    sortingArray = sortingArray.sort(function(a,b){
        if(a.buildingId < b.buildingId) return -1;
        if(a.buildingId > b.buildingId) return 1;

        if(a.floorId < b.floorId) return -1;
        if(a.floorId > b.floorId) return 1;

        return 0;
    });

    sortPoiList(sortingArray);
}


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

    sortingArray = sortingArray.reverse();

    sortPoiList(sortingArray);
};


var setDarkTheme = function(){
    $('#custom-theme-list').addClass('invisible');
    ambiarc.setMapTheme(ambiarc.mapTheme.dark);
};


var setLightTheme = function(){
    $('#custom-theme-list').addClass('invisible');
    ambiarc.setMapTheme(ambiarc.mapTheme.light);
};


var setCustomTheme = function(){

    $('#custom-theme-list').removeClass('invisible');

    $.each(colorsInScene, function(key, value){
        ambiarc.setColorByCategory(key, value);
    });
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
            $('#import-file').val('');
        }

        fr.readAsDataURL(file);
    }
};


var fillGeoData = function(properties){

    $.each(properties.features, function(i, feature){
        var mapLabelInfo = feature.properties;
        mapLabelInfo.longitude = parseFloat(feature.geometry.coordinates[0]);
        mapLabelInfo.latitude = parseFloat(feature.geometry.coordinates[1]);

        $.each(feature.user_properties, function(prop, val){
                mapLabelInfo[prop] = val;
        });

        console.log("READY FOR IMPORT:");
        console.log(mapLabelInfo);

        ambiarc.createMapLabel(mapLabelInfo.type, mapLabelInfo,(labelId) => {
            mapLabelCreatedCallback(labelId, mapLabelInfo.label, mapLabelInfo);
        })
    })
};

// function for setting number of decimal places (longitude and latitude)
var toFixed = function(num, fixed) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}


var downloadObjectAsJson = function (exportObj, exportName){
    var dataStr = "data:data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 4));
    var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", exportName + ".json");
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
};


var repositionLabel = function(){

    console.log("REPOSITION LABEL!!");

    ambiarc.getMapPositionAtCursor(ambiarc.coordType.gps, (latlon) => {

        var latitude = parseFloat(latlon.lat);
        var longitude = parseFloat(latlon.lon);

        $('#poi-label-latitude').val(parseFloat(toFixed(latlon.lat, 4)));
        $('#poi-label-longitude').val(parseFloat(toFixed(latlon.lon, 4)));

        updatePoiDetails(['longitude', 'latitude'], [longitude, latitude]);
        updatePoiDetails('floorId', currentFloorId);
        fillDetails(ambiarc.poiList[currentLabelId]);
    });
}


var hideInactivePoints = function(immediate){
if(!immediate)var immediate = false;
    $.each(ambiarc.poiList, function(id, obj){
        if(id != currentLabelId) {
            ambiarc.hideMapLabel(id, immediate);
        }
        else {
            if(obj.floorId == currentFloorId){
                ambiarc.showMapLabel(id, immediate)
            }
        }
    });
    if(ambiarc.poiList[currentLabelId].floorId !== currentFloorId){
        ambiarc.hideMapLabel(currentLabelId);
    }
    else {
        ambiarc.showMapLabel(currentLabelId);
    }
}


var showInactivePoints = function(){
    $.each(ambiarc.poiList, function(id, obj){
        if(obj.floorId == currentFloorId){
            ambiarc.showMapLabel(id, false);
        }
    });
}

var initColorPickers = function(){
    $('.colorpicker_field').each(function(i, el){
        $(el).colorpicker();
    });
};