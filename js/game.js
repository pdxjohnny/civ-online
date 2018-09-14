var game = {}, grid;

game.then = Date.now();
game.keysDown = {};
game.players = {};
game.path = [];
game.user = {};
game.available_games = {};
game.online_events = {
	other: [],
	updates: [],
	add_players: {},
	add_units: {},
	add_cities: {},
	};
game.turn = 0;
game.year = -4000;
game.can_end_turn = true;
game.running = false;
game.old_tile = false;
game.selected_Tile = false;
game.selected_Unit = false;
game.mouse_over_tile = false;
game.is_mobile_device = false;
game.options = {
	Zoom: 1,
	Unit_Speed: 450,
	Draw_Grid_Lines: false,
	UI_Color: "#213443",
	Background_Color: "#213443",
	Scroll_Speed: 2000,
	Menu_Opacity: 0.7,
	};

game.main = function() {
	if ( game.running ) {
		game.now = Date.now();
		game.delta = game.now - game.then;
		game.modifier = game.delta / 1000;

		game.handle_incoming_events();
		game.update( game.modifier );
		game.draw();

		game.then = Date.now()
		}
	requestAnimationFrame( game.main );
	};

game.update = function( modifier ) {
	for ( var h in grid.Hexes ){
		game.playerShift( grid.Hexes[h], modifier );
		}
	for ( var player in game.players ){
		for ( var unit in game.players[ player ].units ){
			unit = game.players[ player ].units[ unit ];
			game.playerShift( unit, modifier );
			unit.move();
			}
		for ( var city in game.players[ player ].cities ){
			city = game.players[ player ].cities[ city ];
			game.playerShift( city, modifier );
			}
		}
	}

game.draw = function( ) {
	// No zoom on the background fill
	game.ctx.scale(1,1);
	game.ctx.fillStyle = game.options.Background_Color;
	game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);

	// Zoom for anything else
	game.ctx.scale( game.options.Zoom, game.options.Zoom );
	// Grid
	for( var h in grid.Hexes ){
		grid.Hexes[h].draw();
		}
	// Selection and Pathfinding
	if ( game.selected_Tile )
		game.selected_Tile.draw( "purple" );
	if ( game.mouse_over_tile )
		game.mouse_over_tile.draw( "purple" );
	// Units
	for ( var player in game.players ) {
		for ( var tile in game.players[ player ].territories ){
			game.players[ player ].territories[ tile ].draw( false, false, game.players[ player ].color );
			}
		for ( var city in game.players[ player ].cities ){
			game.players[ player ].cities[ city ].draw();
			for ( var unit in game.players[ player ].cities[ city ].units ){
				game.players[ player ].cities[ city ].units[ unit ].draw();
				}
			}
		for ( var unit in game.players[ player ].units ){
			game.players[ player ].units[ unit ].draw();
			}
		}

	// No zoom on the UI
	game.ctx.scale( 1/game.options.Zoom, 1/game.options.Zoom );
	// UI
	ui.draw();
	}

game.terrianPicker = function( tile, grid ) {
	// Poles
	if( tile.row < 2 || tile.row > grid.lastRow-3 ) {
		return game.terrain.types[ "Poles" ]
		}
	// Ocean
	else if( tile.row < 5 || tile.row > grid.lastRow-6 ) {
			return game.terrain.types[ "Ocean" ]
			}
	else {
		var above = grid.GetHexByGridPos( tile.PathCoOrdX, tile.PathCoOrdY-1 ),
			aRight = grid.GetHexByGridPos( tile.PathCoOrdX+1, tile.PathCoOrdY ),
			bRight = grid.GetHexByGridPos( tile.PathCoOrdX+1, tile.PathCoOrdY+1 ),
			below = grid.GetHexByGridPos( tile.PathCoOrdX, tile.PathCoOrdY+1 ),
			bLeft = grid.GetHexByGridPos( tile.PathCoOrdX-1, tile.PathCoOrdY ),
			aLeft = grid.GetHexByGridPos( tile.PathCoOrdX-1, tile.PathCoOrdY-1 );
		var others = [ above, aRight, bRight, below, bLeft, aLeft ];
		chance = Math.round(Math.random()*10) % 7;
		if ( typeof others[chance] !== "undefined" && others[chance] !== false && typeof others[chance].background !== "undefined" ){
			return game.terrain.types[ others[chance]._id ];
			}
		else {
			while ( typeof tile.type === "undefined" ) {
				for ( var i in game.terrain.types ){
					if ( game.terrain.types[i].prob > (Math.random()*100) ) {
						return game.terrain.types[i];
						}
					}
				}
			}
		}
	}

game.playerShift = function( object, modifier ){
	if ( Object.keys(game.keysDown).length > 0 ) {
		if ( 38 in game.keysDown || 87 in game.keysDown ) { // Player holding up
			for ( var prop in object ){
				if ( ( typeof object[prop] === "object" || typeof object[prop] === "array" ) && prop !== "image" &&
					prop !== "background" && prop !== "path" && prop !== "draw_path" ){
					game.playerShift( object[prop], modifier );
					}
				else if ( prop === "y" )
					object[prop] += game.options.Scroll_Speed * modifier;
				}
			}
		else if ( 40 in game.keysDown || 83 in game.keysDown ) { // Player holding down
			for ( var prop in object ){
				if ( ( typeof object[prop] === "object" || typeof object[prop] === "array" ) && prop !== "image" &&
					prop !== "background" && prop !== "path" && prop !== "draw_path" )
					game.playerShift( object[prop], modifier );
				else if ( prop === "y" )
					object[prop] -= game.options.Scroll_Speed * modifier;
				}
			}
		else if ( 37 in game.keysDown || 65 in game.keysDown ) { // Player holding left
			for ( var prop in object ){
				if ( ( typeof object[prop] === "object" || typeof object[prop] === "array" ) && prop !== "image" &&
					prop !== "background" && prop !== "path" && prop !== "draw_path" )
					game.playerShift( object[prop], modifier );
				else if ( prop === "x" )
					object[prop] += game.options.Scroll_Speed * modifier;
				}
			}
		else if ( 39 in game.keysDown || 68 in game.keysDown ) { // Player holding right
			for ( var prop in object ){
				if ( ( typeof object[prop] === "object" || typeof object[prop] === "array" ) && prop !== "image" &&
					prop !== "background" && prop !== "path" && prop !== "draw_path" )
					game.playerShift( object[prop], modifier );
				else if ( prop === "x" )
					object[prop] -= game.options.Scroll_Speed * modifier;
				}
			}
		return true;
		}
	else return false;
	}

game.getMousePos = function( e, no_zoom_fix ) {
	if ( typeof e.originalEvent.changedTouches !== "undefined" ) {
		e.pageX = e.originalEvent.changedTouches[0].pageX;
		e.pageY = e.originalEvent.changedTouches[0].pageY;
		e.clientX = e.originalEvent.changedTouches[0].clientX;
		e.clientY = e.originalEvent.changedTouches[0].clientY;
		e.which = 1;
		}
	var x;
	var y;
	if (e.pageX || e.pageY) {
		x = e.pageX;
		y = e.pageY;
		}
	else {
		x = e.clientX + document.body.scrollLeft +
			document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop +
			document.documentElement.scrollTop;
		}
	var res = {
		x: x * 1/game.options.Zoom,
		y: y * 1/game.options.Zoom,
		incords: function incords( top, bottom ) {
			if ( typeof top !== "undefined" && typeof bottom !== "undefined" &&
				typeof top.x !== "undefined" && typeof top.y !== "undefined" &&
				typeof bottom.x !== "undefined" && typeof bottom.y !== "undefined" &&
				typeof this.x !== "undefined" && typeof this.y !== "undefined" ) {
				if ( bottom.x < top.x && bottom.y < top.y ) return this.inCords( bottom, top );
				else if ( bottom.x > top.x && bottom.y < top.y ) {
					var temp = top.x;
					top.x = bottom.x;
					bottom.x = temp;
					return this.inCords( top, bottom );
					}
				else if ( bottom.x < top.x && bottom.y > top.y ) {
					var temp = top.y;
					top.y = bottom.y;
					bottom.y = temp;
					return this.inCords( top, bottom );
					}
				else if ( top.x <= this.x && top.y <= this.y &&
					bottom.x >= this.x && bottom.y >= this.y ) {
						return true;
					}
				}
			var center = top;
			if ( typeof center !== "undefined" && typeof center.radius !== "undefined" &&
				typeof center.x !== "undefined" && typeof center.y !== "undefined" &&
				typeof this.x !== "undefined" && typeof this.y !== "undefined" ) {
				var distsq = ( this.x - center.x ) * ( this.x - center.x ) + ( this.y - center.y ) * ( this.y - center.y );
				return distsq <= center.radius * center.radius;
				}
			return false;
			}
		};
	if ( typeof no_zoom_fix !== "undefined" && no_zoom_fix ) {
		res = {
			x: res.x / (1/game.options.Zoom),
			y: res.y / (1/game.options.Zoom),
			incords: res.incords
			}
		}
	return res;
	}

game.drag_map = function( from, to ) {
	var deltx = to.x - from.x;
	var delty = to.y - from.y;
	for ( var h in grid.Hexes ){
		game.drag_map_move( grid.Hexes[h], deltx, delty );
		}
	for ( var player in game.players ){
		for ( var unit in game.players[ player ].units ){
			unit = game.players[ player ].units[ unit ];
			game.drag_map_move( unit, deltx, delty );
			}
		for ( var city in game.players[ player ].cities ){
			city = game.players[ player ].cities[ city ];
			game.drag_map_move( city, deltx, delty );
			}
		}
	}

game.drag_map_move = function( object, deltx, delty ) {
	for ( var prop in object ) {
		if ( typeof object[prop] === "object" && prop !== "image" &&
			prop !== "background" && prop !== "path" && prop !== "draw_path" )
			game.drag_map_move( object[prop], deltx, delty );
		else if ( prop === "y" )
			object[prop] += delty;
		else if ( prop === "x" )
			object[prop] += deltx;
		}
	}

game.focus_on = function( object ) {
	var start = {
		x: game.canvas.width/2,
		y: game.canvas.height/2
		};
	var end = {
		x: -object.x,
		y: object.y
		};
	console.log(start)
	console.log(end)
	game.drag_map( start, end );
	}

game.start_turn = function( player ) {
	game.turn++;
	game.year += 10;
	ui.top_bar.buttons.turn.text = "Turn " + game.turn;
	if ( game.year.toString()[0] === '-' )
		ui.top_bar.buttons.year.text = "Year " + game.year.toString().slice(1) + " BC";
	else 
		ui.top_bar.buttons.year.text = "Year " + game.year + " AD";
	for ( var unit in game.players[ player ].units ){
		unit = game.players[ player ].units[ unit ];
		unit.moves = unit.base_moves;
		unit.player_moved = false;
		unit.on_move_finish = false;
		unit.moved_this_turn = false;
		}
	for ( var city in game.players[ player ].cities ){
		city = game.players[ player ].cities[ city ];
		city.produce();
		}
	}

game.end_turn = function( player ) {
	game.ready_needed = 0;
	game.ready_count = 0;
	for ( var unit in game.players[ player ].units ){
		unit = game.players[ player ].units[ unit ];
		game.ready_needed++;
		if ( !unit.moved_this_turn && typeof unit.path !== "undefined" && unit.path.length > 0 ){
			unit.player_moved = true;
			unit.on_move_finish = function() {
				game.ready_to_start();
				};
			}
		else game.ready_to_start();
		}
	if ( game.players[ game.username ].units.length == 0 )
		game.start_turn( game.username );
	}

game.ready_to_start = function(  ) {
	game.ready_count++;
	if ( game.ready_count >= game.ready_needed )
		game.start_turn( game.username );
	}

game.selection = function( position ) {
	ui.bottom_bar.unit_actions_clear();
	game.selected_Tile = grid.GetHexAt( position );
	if ( game.selected_Unit != false ) {
		var unit = game.selected_Unit;
		if ( typeof unit[ game.selected_Tile.type ] === "undefined" )
			unit.path = unit.pathFind( unit.tile(), game.selected_Tile );
		/*
		Online: Send new path to other games
		*/
		unit.player_moved = true;
		unit.draw_path = false;
		}
	game.selected_Unit = false;
	game.selected_City = false;
	ui.bottom_bar.unit_actions_clear();
	ui.bottom_bar.city_actions_clear();
	if ( game.selected_Tile != false ) {
		var city = game.selected_Tile.city();
		var civilain = game.selected_Tile.unit( game.username );
		var unit = game.selected_Tile.unit( game.username, "combat" );
		if ( unit != false && unit.player === game.username ) {
			game.selected_Unit = unit;
			unit.options();
			}
		else if( civilain != false && civilain.player === game.username ) {
			game.selected_Unit = civilain;
			civilain.options();
			}
		else if ( city != false && city.player === game.username ) {
			game.selected_City = city;
			city.options();
			}
		}
	game.mouse_over_tile = false;
	}

game.returnSpan = function(say) {
	$('#returnSpan').show();
	$('#returnSpan').html(say);
	$('#returnSpan').delay(9000).fadeOut();
	}

game.inCords = function( start, end, object, object2 ) {
	if ( typeof start.top !== "undefined" && typeof start.bottom !== "undefined" &&
		typeof end.top !== "undefined" && typeof end.bottom !== "undefined" ) {
		return !( end.top.x > start.bottom.x ||
				end.bottom.x < start.top.x ||
				end.top.y > start.bottom.y ||
				end.bottom.y < start.top.y );
				}
	if ( typeof start.x !== "undefined" && typeof start.y !== "undefined" &&
		typeof end.x !== "undefined" && typeof end.y !== "undefined" &&
		typeof object.x !== "undefined" && typeof object.y !== "undefined" ) {
		if ( ( typeof object.image !== "undefined" && ( start.x <= (object.x - object.image.width/2) &&
			start.y <= (object.y - object.image.height/2) &&
			end.x >= (object.x + object.image.width/2) &&
			end.y >= (object.y + object.image.height/2) ) ) ||
			( start.x <= object.x &&
			start.y <= object.y &&
			end.x >= object.x &&
			end.y >= object.y ) ) {
				return true;
			}
		}
	return false;
	}

game.on_mouseup = function(e){
	game.mouse_is_down = false;
	ui.top_bar.buttons.zoom_slider.sliding = false;
	ui.tech_tree.scroll_bar.scroll_slider.sliding = false;
	};

game.on_mousemove = function(e){
	if ( game.mouse_is_down ) {
		var end_drag = game.getMousePos(e);
		game.drag_map( game.mouse_is_down, end_drag );
		game.mouse_is_down = end_drag;
		}
	if ( game.selected_Unit != false )
		var tile = game.selected_Unit.tile();
	if ( game.mouse_over_tile != false ) {
		game.old_tile = game.mouse_over_tile;
		game.mouse_over_tile = false;
		}
	if ( tile != false && game.selected_Unit != false &&
		tile.PathCoOrdY != game.mouse_over_tile.PathCoOrdY &&
		tile.PathCoOrdX != game.mouse_over_tile.PathCoOrdX ) {
		var position = game.getMousePos(e);
		game.mouse_over_tile = grid.GetHexAt( position );
		if ( tile != false && game.mouse_over_tile != false && game.old_tile != false && 

			( game.old_tile.PathCoOrdX != game.mouse_over_tile.PathCoOrdX ||
			game.old_tile.PathCoOrdY != game.mouse_over_tile.PathCoOrdY ||
			tile.PathCoOrdX != game.mouse_over_tile.PathCoOrdX ||
			tile.PathCoOrdY != game.mouse_over_tile.PathCoOrdY ) &&

			typeof game.selected_Unit[ game.mouse_over_tile.type ] === "undefined" ) {

			game.selected_Unit.draw_path = game.selected_Unit.pathFind( tile, game.mouse_over_tile );
			}
		}
	ui.top_bar.buttons.zoom_slider.mousemove(e);
	ui.tech_tree.scroll_bar.scroll_slider.mousemove(e);
	};

game.on_mousedown = function(e){
	game.mouse_is_down = game.getMousePos(e);
	switch (e.which) {
		case 1:
			var position = game.getMousePos(e);
			var ui_click = ui.onclick( position );
			if( typeof grid === "object" && !ui_click )
				game.selection( position );
			else game.mouse_is_down = false;
			break;
		case 2:
			// console.log('Middle Mouse button pressed.');
			break;
		case 3:
			ui.bottom_bar.unit_actions_clear();
			ui.bottom_bar.city_actions_clear();
			if (game.selected_Tile) {
				game.selected_Tile.selected = false;
				game.selected_Tile = false;
				}
			if ( game.selected_Unit ) {
				game.selected_Unit.draw_path = false;
				game.selected_Unit = false;
				}
			if ( game.mouse_over_tile ) {
				game.mouse_over_tile.mouse_over = false;
				game.mouse_over_tile = false;
				game.path = [];
				}
			break;
		}
	};

game.start = function() {
	// Get starting conditions
	document.getElementById('main').style.display = 'none';
	game.username = document.getElementById('username').value;
	game.user_nation = document.getElementById('nation').value;
	game.user_color = document.getElementById('color').value;
	map_height = document.getElementById('map_height').value * HT.Hexagon.Static.HEIGHT * 1.1;
	map_width = document.getElementById('map_width').value * HT.Hexagon.Static.WIDTH * 1.8;
	if ( !game.game_name )
		game.game_name = document.getElementById('game_name').value;
	document.getElementById('toggleRegister').remove();
	document.getElementById('toggleLogin').remove();
	document.getElementById('registerdiv').remove();
	document.getElementById('logindiv').remove();

	// Make the ui
	ui.resize();
	ui.unit_actions_resize();
	ui.city_actions_resize();
	ui.tech_tree.resize();

	// Grid creation
	var start_width = -(map_width/2),
		start_height = -(map_height/2),
		end_width = map_width,
		end_height = map_height;
	db.getTerrain( function(){
		if ( game.grid ) {
			grid = game.grid;
			}
		else {
			grid = new HT.Grid(start_width, start_height, end_width, end_height);
			}
		game.emmit( { available_game: game.game_name, grid: grid } );
		game.options.Scroll_Speed = 2000 + grid.Hexes.length;
		game.running = true;
		game.players[ game.username ] = new player( game.username, game.user_nation, game.user_color );
		db.getUnits( function(){
			var new_unit = new unit( "Settler", game.username );
			game.players[ game.username ].units[ new_unit.Id ] = new_unit;
			game.start_turn( game.username );
			//game.focus_on( game.players[ game.username ].units[0] )
			game.main();
			});
		});
	
	// Event listeners
	addEventListener("keydown", function (e) {
		game.keysDown[e.keyCode] = true;
		}, false);
	
	addEventListener("keyup", function (e) {
		delete game.keysDown[e.keyCode];
		}, false);
	
	if ( game.is_mobile_device ) {
		$(game.canvas).on( "touchstart.game.start", game.on_mousedown );
		$(game.canvas).on( "touchmove.game.start", game.on_mousemove );
		$(game.canvas).on( "touchend.game.start", game.on_mouseup );
		}
	else {
		$(game.canvas).on( "mousedown.game.start", game.on_mousedown );
		$(game.canvas).on( "mousemove.game.start", game.on_mousemove );
		$(game.canvas).on( "mouseup.game.start", game.on_mouseup );
		}

	window.onresize = function(){
		game.canvas.height = window.innerHeight;
		game.canvas.width = window.innerWidth;
		ui.resize();
		ui.unit_actions_resize();
		ui.city_actions_resize();
		ui.tech_tree.resize();
		}

	if (window.DeviceOrientationEvent) {
		window.addEventListener('deviceorientation', function(eventData) {
			// gamma is the left-to-right tilt in degrees, where right is positive
			var tiltLR = eventData.gamma;

			// beta is the front-to-back tilt in degrees, where front is positive
			var tiltFB = eventData.beta;
			if ( typeof game.original_tiltFB === "undefined" )
				game.original_tiltFB = eventData.beta;

			// alpha is the compass direction the device is facing in degrees
			var dir = eventData.alpha
			game.deviceOrientationHandler(tiltLR, tiltFB, dir);
			}, false);
		}

	var w = window;
	requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame || function( callback ){ window.setTimeout(callback, 1000 / 60); };
	}

Element.prototype.remove = function() {
	this.parentElement.removeChild(this);
	}

game.clean = function( array, deleteValue ) {
	for (var i = 0; i < array.length; i++) {
		if (array[i] == deleteValue) {         
			array.splice(i, 1);
			i--;
			}
		}
	return array;
	};

game.deviceOrientationHandler = function(tiltLR, tiltFB, dir) {
	for ( key in game.keysDown ) {
		delete game.keysDown[ key ];
		}
	// left
	if ( tiltLR < -5 )
		game.keysDown[37] = true;
	// right
	else if ( tiltLR > 5 )
		game.keysDown[39] = true;
	// up
	else if ( ( tiltFB - game.original_tiltFB ) < -5 )
		game.keysDown[38] = true;
	// down
	else if ( ( tiltFB - game.original_tiltFB ) > 5 )
		game.keysDown[40] = true;
	}

game.online_handler = function( data ) {
	try {
		data = JSON.parse( data );
		}
	catch (error) {
		console.log( "Failed to parse", error, data )
		}
	if ( data.connection_closed ) {
		game.online = false;
		console.log('Connection closed');
		}
	else if ( data.get_games && game.game_name && grid ) {
		game.emmit( { available_game: game.game_name, grid: grid } );
		}
	else if ( data.available_game ) {
		var online_div = $('#online_games_div_contents');
		game.available_games[ data.available_game ] = data.grid;
		online_div.append('<button onclick="game.load_grid(this);game.start();" value="' + data.available_game + '" >' + data.available_game + '</button><br>');
		}
	else if ( data.get_players ) {
		console.log('server requested get_players');
		var exicute_later = function() {
			console.log('sending player info');
			// Emmit player and all units + cities
			game.emmit( game.players[ game.username ].emmit('new') );
			for ( var unit in game.players[ game.username ].units ) {
				game.emmit( game.players[ game.username ].units[ unit ].emmit('new') );
				}
			for ( var city in game.players[ game.username ].cities ) {
				game.emmit( game.players[ game.username ].cities[ city ].emmit('new') );
				}
			};
		game.online_events.other.push( exicute_later );
		}
	else if ( data.new_player ) {
		console.log('new_player');
		game.online_events.add_players[ data.new_player ] = function() {
			if ( !game.players[ data.new_player ] )
				game.players[ data.new_player ] = new player( data.new_player, data.nation, data.color, false );
			};
		}
	else if ( data.new_city ) {
		console.log('new_city');
		game.online_events.add_cities[ data.player+data.id ] = function() {
			var new_city = new city( data.new_city, data.player, data.position, data.city_name, data.id, false );
			if ( !game.players[ data.player ].cities[ new_city.Id ] )
				game.players[ data.player ].cities[ new_city.Id ] = new_city;
			};
		}
	else if ( data.new_unit ) {
		console.log('new_unit');
		game.online_events.add_units[ data.player+data.id ] = function() {
			var new_unit = new unit( data.new_unit, data.player, data.position, data.id, false );
			if ( !game.players[ data.player ].units[ new_unit.Id ] )
				game.players[ data.player ].units[ new_unit.Id ] = new_unit;
			};
		}
	else if ( data.update ) {
		console.log('update');
		}
	else if ( data.delete_item ) {
		console.log('delete_item');
		try {
			delete game.players[ data.player ][ data.delete_item ][ data.Id ];
			}
		catch (error) {}
		}
	else {
		console.log( "don't know what to do with message" )
		}
	console.log( "RECIVED", data );
	}

game.emmit = function( message_object ) {
	if ( game.online ) {
		try {
			message_object.game = game.game_name;
			console.log( "SENDING", message_object );
			game.online.send( JSON.stringify( message_object ) );
			}
		catch (error) {
			console.log( 'Failed to send', message_object )
			}
		}
	}

game.load_grid = function( element ) {
	game.grid = new HT.Grid( false, false, false, false, game.available_games[ $(element).val() ] );
	game.game_name = $(element).val();
	}

game.options.Multiplayer_Server = 'https://' + document.domain + ':1234/sock';
try {
	game.online = new SockJS( game.options.Multiplayer_Server );
	}
catch (error) {}
if ( typeof game.online === "undefined" )
	game.online = false;
if ( game.online ) {
	game.online.onopen   = function() {
		var exicute_later = function() {
			game.emmit( { get_players: true } );
			}
		game.online_events.other.push( exicute_later );
		game.emmit( { get_games: true } );
		};
	game.online.onmessage = function(e) { game.online_handler(e.data); };
	game.online.onclose   = function()  { game.online_handler( { connection_closed: 'closed' } ); };
	}

game.handle_incoming_events = function() {
	for ( var func in game.online_events.other ) {
		game.online_events.other[ func ]();
		delete game.online_events.other[ func ];
		}
	for ( var func in game.online_events.add_players ) {
		game.online_events.add_players[ func ]();
		delete game.online_events.add_players[ func ];
		}
	for ( var func in game.online_events.add_units ) {
		game.online_events.add_units[ func ]();
		delete game.online_events.add_units[ func ];
		}
	for ( var func in game.online_events.add_cities ) {
		game.online_events.add_cities[ func ]();
		delete game.online_events.add_cities[ func ];
		}
	for ( var func in game.online_events.updates ) {
		game.online_events.updates[ func ]();
		delete game.online_events.updates[ func ];
		}
	}