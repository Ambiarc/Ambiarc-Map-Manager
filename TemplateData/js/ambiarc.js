(function(){
	var setup = function Ambiarc() {
		this.messageQueue = [];
		this.eventLabel = {
			FloorSelectorEnabled: 'FloorSelectorEnabled',
			FloorSelectorDisabled: 'FloorSelectorDisabled',
			FloorSelected: 'FloorSelected',
			FloorSelectorFloorFocusChanged: 'FloorSelectorFloorFocusChanged',
			MapLabelSelected: 'MapLabelSelected',
			BuildingSelected: 'BuildingSelected',
			CameraMotionStarted: 'CameraMotionStarted',
			CameraMotionCompleted: 'CameraMotionCompleted',
			AmbiarcAppInitialized: 'AmbiarcAppInitialized',
			RightMouseDown: 'RightMouseDown'
		};
		this.mapLabel = {
			Icon: "Icon",
			Text: "Text"
		}
		this.mapTheme = {
			dark: "dark",
			light: "light"
		}
		this.getMapPositionAtCursor = function(callback) {
			this.messageQueue.push(callback);
			gameInstance.SendMessage('Ambiarc', 'GetMapPositionAtCursor');
		};
		this.createMapLabel = function(mapLabelType, mabelLabelInfo, idCallback) {
			this.messageQueue.push(idCallback);
			var json = JSON.stringify({ mapLabelType: mapLabelType, mapLabelInfo: mabelLabelInfo });
			gameInstance.SendMessage('Ambiarc', 'CreateMapLabel', json);
		};
		this.updateMapLabel = function(mapLabelId, mapLabelType, mapLabelInfo) {
			var json = JSON.stringify({ mapLabelId: mapLabelId, mapLabelType: mapLabelType, mapLabelInfo: mapLabelInfo });
			gameInstance.SendMessage('Ambiarc', 'UpdateMapLabel', json);
		};
		this.destroyMapLabel = function(mapLabelId) {
			gameInstance.SendMessage('Ambiarc', 'DestroyMapLabel', mapLabelId);
		};
		this.showMapLabel = function(mapLabelId, immediate) {
			var json = JSON.stringify({ mapLabelId: mapLabelId, immediate: immediate });
			gameInstance.SendMessage('Ambiarc', 'ShowMapLabel', json);
		};
		this.hideMapLabel = function(mapLabelId, immediate) {
			var json = JSON.stringify({ mapLabelId: mapLabelId, immediate: immediate });
			gameInstance.SendMessage('Ambiarc', 'HideMapLabel', json);
		};
		this.showMapCallout = function(mapCallout, idCallback) {
			this.messageQueue.push(idCallback);
			var json = JSON.stringify(mapCallout);
			gameInstance.SendMessage('Ambiarc', 'ShowMapCallout', mapCallout);
		};
		this.dismissMapCallout = function(mapLabelId) {
			gameInstance.SendMessage('Ambiarc', 'DismissMapCallout', mapLabelId);
		};
		this.focusOnMapLabel = function(mapLabelId, cameraMotionId) {
			var json = JSON.stringify({mapLabelId: mapLabelId, cameraMotionId: cameraMotionId});
			gameInstance.SendMessage('Ambiarc', 'FocusOnMapLabel', json);
		};
		this.focusOnFloor = function(buildingId, floorId, cameraMotionId, requireFloorFocus, instant) {
			var json = JSON.stringify({buildingId: buildingId, floorId: floorId, cameraMotionId: cameraMotionId, requireFloorFocus: requireFloorFocus, instant: instant});
			gameInstance.SendMessage('Ambiarc', 'FocusOnFloor', json);
		}
		this.viewFloorSelector = function(buildingId, cameraMotionId) {
			var json = JSON.stringify({ buildingId: buildingId, cameraMotionId: cameraMotionId });
			gameInstance.SendMessage('Ambiarc', 'ViewFloorSelector', json);
		};
		this.getAllBuildings = function(cb) {
			this.messageQueue.push(cb);
			gameInstance.SendMessage('Ambiarc', 'GetAllBuildings');
		};
		this.getAllFloors = function(buildingId, cb) {
			this.messageQueue.push(cb);
			gameInstance.SendMessage('Ambiarc', 'GetAllFloors', buildingId);
		};
		this.getCurrentFloor = function(cb) {
			this.messageQueue.push(cb);
			gameInstance.SendMessage('Ambiarc', 'GetCurrentFloor');
		};
		this.setColorByCategory = function(category, color) {
			var json = JSON.stringify({ category: category, colorHex: color });
			gameInstance.SendMessage('Ambiarc', 'SetColorByCategory', json);
		};
		this.setSkyColor = function(skyColor, equatorColor, groundColor) {
			var json = JSON.stringify({ skyColor: skyColor, equatorColor: equatorColor, groundColor: groundColor });
			gameInstance.SendMessage('Ambiarc', 'SetSkyColor', json);
		};
		this.setMapTheme = function(theme) {
			var jsonColorTheme;
			if(theme === this.mapTheme.dark) {
				jsonColorTheme = JSON.stringify(window.AmbiarcThemes.darkTheme);
			} else if (theme === this.mapTheme.light) {
				jsonColorTheme = JSON.stringify(window.AmbiarcThemes.lightTheme);
			}
			gameInstance.SendMessage('Ambiarc', 'SetColorsByTheme', jsonColorTheme);
		};
		this.setGPSCoordinatesOrigin = function(latitude, longitude) {
			var json = JSON.stringify({latitude: latitude, longitude: longitude});
			gameInstance.SendMessage('Ambiarc', 'SetGPSCoordinatesOrigin', json);
		};
		this.createHeatmap = function(coordinates, config) {
			var json = JSON.stringify({coordinates: coordinates, config: config});
			gameInstance.SendMessage('Ambiarc', 'CreateHeatmap', json);
		};
		this.updateHeatmap = function(coordinates, config) {
			var json = JSON.stringify({coordinates: coordinates, config: config});
			gameInstance.SendMessage('Ambiarc', 'UpdateHeatmap', json);
		};
		this.destroyHeatmap = function() {
			gameInstance.SendMessage('Ambiarc', 'DestroyHeatmap');
		}
		this.registerForEvent = function(eventLabel, cb) {
			var validLabel = this.eventLabel.hasOwnProperty(eventLabel);
			if(validLabel === false) {
				throw 'Invalid label. Please use Ambiarc.eventLabel to choose the event to register to.';
			}
			document.addEventListener(eventLabel, cb);
		};
		this.unregisterEvent = function(eventLabel, cb) {
			document.removeEventListener(eventLabel, cb);
		};
	};
	window.Ambiarc = new setup();
})(window);

$(document).ready(function () {
	parent.iframeLoaded();
});

