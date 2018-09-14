ui.unit_actions_resize = function(){
	ui.bottom_bar.unit_actions.found_city.center = {
		x: game.canvas.width/2,
		y: game.canvas.height - 60,
		radius: 20
		};
	}

ui.bottom_bar.unit_actions_clear = function() {
	for ( var prop in ui.bottom_bar.unit_actions ) {
		ui.bottom_bar.unit_actions[ prop ].active = false;
		}
	}

ui.bottom_bar.unit_actions = {
	found_city: {
		text: 'City',
		background: '#297ACC',
		opacity: 0.5,
		textAlign: "center",
		textBaseline: "middle",
		active: false
		},
	attack: {
		text: 'Attack',
		background: '#297ACC',
		opacity: 0.5,
		textAlign: "center",
		textBaseline: "middle",
		active: false
		},
	};

ui.bottom_bar.unit_actions.found_city.clicked = function() {
	var tile = game.selected_Unit.tile();
	var new_city = new city( "city", game.selected_Unit.player, { x: tile.PathCoOrdX, y: tile.PathCoOrdY } );
	if ( !game.players[ game.selected_Unit.player ].cities[ new_city.Id ] )
		game.players[ game.selected_Unit.player ].cities[ new_city.Id ] = new_city;
	var delete_unit = { player: game.selected_Unit.player, delete_item: 'units', Id: game.selected_Unit.Id };
	game.emmit( delete_unit );
	game.selected_Unit.delete();
	delete game.selected_Unit;
	game.selected_Unit = false;
	ui.bottom_bar.unit_actions_clear();
	}