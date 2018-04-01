(function(){
	var setup = function AmbiarcThemes() {
        this.lightTheme = {
            colors: [{
                "category": "Obstruction",
                "colorHex": "#F8C6C600"
            }, {
                "category": "Railing",
                "colorHex": "#A7917900"
            },{
                "category": "Elevator",
                "colorHex": "#EAE0CA00"
            },{
                "category": "Escalator",
                "colorHex": "#EAE0CA00"
            },{
                "category": "Ramp",
                "colorHex": "#EAE0CA00"
            },{
                "category": "Stairs",
                "colorHex": "#EAE0CA00"
            }, {
                "category": "Wall",
                "colorHex": "#DDEEFF00"
            }, {
                "category": "Room",
                "colorHex": "#FFFFFF00"
            }, {
                "category": "Walkway",
                "colorHex": "#EAE0CA00"
            }, {
                "category": "Non-Public",
                "colorHex": "#55555500"
            }, {
                "category": "Restroom",
                "colorHex": "#5EA2FF00"
            }],
            lighting: {
                "sky": "#545454",
                "equator": "#B0B0B0",
                "ground": "#0C0B09"
            }
        };
        this.darkTheme = {
            colors: [{
                "category": "Obstruction",
                "colorHex": "#946C6C00"
            }, {
                "category": "Railing",
                "colorHex": "#44444400"
            },{
                "category": "Ramp",
                "colorHex": "#3A3A3A00"
            },{
                "category": "Elevator",
                "colorHex": "#3A3A3A00"
            },{
                "category": "Escalator",
                "colorHex": "#3A3A3A00"
            },{
                "category": "Stairs",
                "colorHex": "#3A3A3A00"
            }, {
                "category": "Wall",
                "colorHex": "#515F8B00"
            }, {
                "category": "Room",
                "colorHex": "#6C738E00"
            }, {
                "category": "Walkway",
                "colorHex": "#3A3A3A00"
            }, {
                "category": "Non-Public",
                "colorHex": "#55555500"
            }, {
                "category": "Restroom",
                "colorHex": "#4D82CC00"
            }],
            lighting: {
                "sky": "#545454",
                "equator": "#B0B0B0",
                "ground": "#0C0B09"
            }
        };
	};
	window.AmbiarcThemes = new setup();
})(window);
