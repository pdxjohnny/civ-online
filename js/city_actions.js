ui.city_actions_resize = function(){
	ui.bottom_bar.city_actions.units.center = {
		x: game.canvas.width/2,
		y: game.canvas.height - 60,
		radius: 22
		};
	}

ui.bottom_bar.city_actions_clear = function() {
	for ( var prop in ui.bottom_bar.city_actions ) {
		ui.bottom_bar.city_actions[ prop ].active = false;
		}
	for ( var prop in ui.bottom_bar.city_units ) {
		ui.bottom_bar.city_units[ prop ].active = false;
		}
	}

ui.bottom_bar.city_actions = {
	units: {
		text: 'Units',
		background: game.options.UI_Color,
		opacity: 0.5,
		textAlign: "center",
		textBaseline: "middle",
		active: false
		},
	};

ui.bottom_bar.city_actions.units.clicked = function() {
	var grid = new ui.grid( 200, 25, 1 ).grid;
	var row = 1;
	for ( var unit in game.players[ game.username ].available_units ) {
		unit = game.players[ game.username ].available_units[ unit ];
		grid[ row ].active = true;
		grid[ row ].opacity = 0.9;
		grid[ row ].background = game.options.UI_Color;
		grid[ row ].text = unit + " " + game.units[ unit ].cost;
		grid[ row ].unit = unit;
		grid[ row ].clicked = function() { game.selected_City.producing( game.units[ this.unit ], "unit" ); };
		row++;
		}
	ui.bottom_bar.city_units = {};
	for ( var unit in grid ) {
		if ( typeof grid[ unit ].text !== "undefined" )
			ui.bottom_bar.city_units[ grid[ unit ].text ] = grid[ unit ];
		}
	}