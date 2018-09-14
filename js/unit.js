var unit_count = 0;

var unit = function( type, player, p, id, send ){
	for ( prop in game.units[ type ] )
		this[prop] = game.units[ type ][prop];
	this.moves = this.base_moves;
	this.player_moved = false;
	this.Id = unit_count;
	this.unit_type = type;
	if ( typeof id !== 'undefined' ) {
		this.Id = id;
		}
	this.player = player;
	if ( typeof p !== "undefined" )
		this.palce( p.x, p.y );
	else this.palce();
	unit_count++;
	if ( send != false && game.online ) {
		game.emmit( this.emmit('new') );
		}
	return this;
	}

unit.prototype.draw = function() {
	if( this.draw_path ) {
		for ( var tile in this.draw_path ) {
			this.draw_path[ tile ].draw(  "purple", Number(tile)+1 );
			}
		}
	if(this.image) {
		game.ctx.drawImage(this.image, this.x-this.image.width/2, this.y-this.image.height/2);
		}
	};

unit.prototype.palce = function( x, y ){
	var current_tile = this.tile();
	if ( current_tile != false ) {
		current_tile[ this.type+"_Id" ] = false;
		current_tile[ this.type+"_player" ] = false;
		}
	while ( true ){
		if ( typeof x !== "undefined" && typeof y !== "undefined" ) {
			tile = grid.GetHexByGridPos( x, y );
			if ( tile && typeof this[ tile.type ] === "undefined" &&
				typeof this[ tile.type ] != false ) {
				tile[ this.type+"_Id" ] = this.Id;
				tile[ this.type+"_player" ] = this.player;
				this.tile_Id = tile.Id;
				this.x = tile.x+HT.Hexagon.Static.WIDTH/2;
				this.y = tile.y+HT.Hexagon.Static.HEIGHT/2;
				return true;
				}
			}
		x = Math.round(Math.random()*100) % grid.lastRow;
		y = Math.round(Math.random()*100) % grid.lastColumn;
		}
	}

unit.prototype.tile = function(){
	var tile = grid.GetHexById( this.tile_Id );
	if ( tile != false )
		return tile;
	else 
		return false;
	}

unit.prototype.move = function() {
	if ( this.player_moved && this.moves > 0 && typeof this.path !== "undefined" && this.path.length > 0 ) {
		var des = {
			x: this.path[0].x+HT.Hexagon.Static.WIDTH/2,
			y: this.path[0].y+HT.Hexagon.Static.HEIGHT/2
			};
		var deltx = des.x - this.x;
		var delty = des.y - this.y;
		var theta = Math.atan( delty/deltx );
		this.angle = theta * (180/Math.PI);
		var yspeed = game.options.Unit_Speed * Math.sin( theta );
		var xspeed = game.options.Unit_Speed * Math.cos( theta );
		if ( des.x >= this.x ) {
			this.x += xspeed * game.modifier;
			this.y += yspeed * game.modifier;
			}
		else if ( des.x <= this.x ){
			this.x -= xspeed * game.modifier;
			this.y -= yspeed * game.modifier;
			this.angle += 180;
			}
		if ( game.inCords( { x: des.x - 4, y: des.y - 4 }, 
			{ x: des.x + 4, y: des.y + 4 }, this ) ){
				this.palce( this.path[0].PathCoOrdX, this.path[0].PathCoOrdY );
				this.path = this.path.splice(1);
				this.moves--;
				this.moved_this_turn = true;
				if ( typeof this.on_move_finish !== "undefined" && this.on_move_finish && this.moves <= 0 )
					this.on_move_finish();
				return { x: this.x, y: this.y };
				}
		}
	return false;
	}

unit.prototype.pathFind = function( start_tile, end_tile ) {
	var path = [],
	dontGo = [];
	while ( typeof path[ path.length - 1 ] === "undefined" || path[ path.length - 1 ].PathCoOrdX != end_tile.PathCoOrdX ||
		path[ path.length - 1 ].PathCoOrdY != end_tile.PathCoOrdY ) {
		var around = [ grid.GetHexByGridPos( start_tile.PathCoOrdX, start_tile.PathCoOrdY-1 ),
			grid.GetHexByGridPos( start_tile.PathCoOrdX+1, start_tile.PathCoOrdY ),
			grid.GetHexByGridPos( start_tile.PathCoOrdX+1, start_tile.PathCoOrdY+1 ),
			grid.GetHexByGridPos( start_tile.PathCoOrdX, start_tile.PathCoOrdY+1 ),
			grid.GetHexByGridPos( start_tile.PathCoOrdX-1, start_tile.PathCoOrdY ),
			grid.GetHexByGridPos( start_tile.PathCoOrdX-1, start_tile.PathCoOrdY-1 ) ];
		var distances = [];
		for ( tile in around ) {
			if( typeof around[tile] !== "undefined" && typeof end_tile !== "undefined" &&
				around[tile] !== false && end_tile !== false ) 
				var option = {
					distance: grid.GetHexDistance( around[tile], end_tile ),
					tile: around[tile]
					};
				var in_dontGo = false;
				for ( id in dontGo ) {
					if ( option.tile.Id === dontGo[id] ) 
						in_dontGo = true;
					}
				if ( !in_dontGo && typeof option !== "undefined" && typeof this[ option.tile.type ] === "undefined" &&
					typeof this[ option.tile.type ] != false ) {
					distances.push( option );
					}
			}
		if ( distances.length == 0 )
			return path;
		if ( path.length > 20 )
			return path;
		var shortest = distances[0];
		for ( tile in distances ) {
			if ( distances[tile].distance < shortest.distance )
				shortest = distances[tile];
			}
		for ( var i = 0; i < path.length; i++ ) {
			if ( typeof path[i+2] !== "undefined" && path[i].Id === path[i+2].Id ) {
				dontGo.push( path[i+1].Id );
				path = path.splice( path.length-3, 2);
				return path;
				break;
				}
			}
		path.push( shortest.tile );
		start_tile = shortest.tile;
		}
	return path;
	}

unit.prototype.delete = function(  ) {
	for ( var unit in game.players[ this.player ].units ) {
		if ( game.players[ this.player ].units[unit].Id === this.Id )
			delete game.players[ this.player ].units[unit];
		}
	game.players[ this.player ].units = game.clean( game.players[ this.player ].units, undefined )
	}

unit.prototype.options = function() {
	if ( typeof this.unit_actions !== "undefined" && this.unit_actions.length > 0 ) {
		ui.bottom_bar.unit_actions_clear();
		for ( var option in this.unit_actions ) {
			ui.bottom_bar.unit_actions[ this.unit_actions[option] ].active = true;
			}
		}
	return true;
	}

unit.prototype.emmit = function( isnew ) {
	if ( isnew === 'new' )
		return { new_unit: this.unit_type, player: this.player, position: { x: this.tile().PathCoOrdX, y: this.tile().PathCoOrdY }, id: this.Id };
	else
		return { update: 'units', player: this.player, position: { x: this.tile().PathCoOrdX, y: this.tile().PathCoOrdY }, id: this.Id, path: this.path };
	}