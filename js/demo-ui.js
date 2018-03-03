 // saved main build reference
 var mainBldgID;
 // reference to custom rightclick menu reference
 var poiMenuSelector;
 // global state indicating if the map is is Floor Selector mode
 var isFloorSelectorEnabled = false;
 // tracked references to POI's
 var poisInScene = [];
 // global lobal state indicating the current sleected floor
 var currentFloorId;

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
 });

 // Creates a Text MapLabel on the map where the current mouse position is
 var createTextLabel = function() {
   var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
   // getMapPositionAtCursor is a convenience method that return a map world position where the mouse is on screen XY
   ambiarc.getMapPositionAtCursor((vector3) => {
     var mapLabelInfo = {
       buildingId: mainBldgID,
       floorId: currentFloorId,
       scenePosition: vector3,
       label: 'Ambiarc Text Label: ' + poisInScene.length,
       fontSize: 24,
       category: 'Label',
       showOnCreation: true
     };
     // Add the map label to the map
     ambiarc.createMapLabel(ambiarc.mapLabel.Text, mapLabelInfo, (labelId) => {
       // Callback triggered once the label is added
       mapLabelCreatedCallback(labelId, mapLabelInfo.label);
     });
   });
 }

 // Creates an Icon MapLabel on the map where the current mouse position is
 var createIconLabel = function() {
   var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
   ambiarc.getMapPositionAtCursor((vector3) => {
     var mapLabelInfo = {
       buildingId: mainBldgID,
       floorId: currentFloorId,
       scenePosition: vector3,
       category: 'Label',
       location: 'Default',
       partialPath: 'Information',
       showOnCreation: true
     };
     ambiarc.createMapLabel(ambiarc.mapLabel.Icon, mapLabelInfo, (labelId) => {
       var mapLabelName = 'Ambiarc Icon Label: ' + poisInScene.length;
       mapLabelCreatedCallback(labelId, mapLabelName);
     });
   });
 }
// Callback thats updates the UI after a POI is created
 var mapLabelCreatedCallback = function(labelId, labelName) {
   // push reference of POI to list
   poisInScene.push(labelId);
   addElementToPoiList(labelId, labelName);
   console.log("Added: " + labelId);
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
   var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
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
   var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
   // Subscribe to various events needed for this application
   ambiarc.registerForEvent(ambiarc.eventLabel.RightMouseDown, onRightMouseDown);
   ambiarc.registerForEvent(ambiarc.eventLabel.FloorSelected, onFloorSelected);
   ambiarc.registerForEvent(ambiarc.eventLabel.FloorSelectorEnabled, onEnteredFloorSelector);
   ambiarc.registerForEvent(ambiarc.eventLabel.FloorSelectorDisabled, onExitedFloorSelector);
   ambiarc.registerForEvent(ambiarc.eventLabel.FloorSelectorFloorFocusChanged, onFloorSelectorFocusChanged);

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

// this is called when the user deletes a POI from the list men
 var listPoiClosed = function(mapLabelId) {
   var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
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
 var addElementToPoiList = function(mapLabelId, mapLabelName) {
   var item = $("#listPoiTemplate").clone().removeClass("invisible").attr('id', mapLabelId).appendTo($("#listPoiContainer"));
  // add a click action
   item.children("span.poiName").text("" + mapLabelName).on("click", function() {
     var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
     // clicking on the POI from the HTM menu will bring the view to it
     ambiarc.focusOnMapLabel(mapLabelId, mapLabelId);
   });
   // add an exit action that will remove the POI from the map and UI
   item.children("span.poiExit").on("click", function() {
     listPoiClosed(mapLabelId)
   });
 };
// adds a floor to the HTML floor selector
 var addFloorToFloor = function(fID, bID, name) {
   var item = $("#floorListTemplate").clone().removeClass("invisible").appendTo($("#floorContainer"));
   item.children("a.floorName").text("" + name).on("click", function() {
     var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
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
