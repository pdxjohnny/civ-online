var city_count = 0;

var city = function( type, player, p, city_name, id, send ){
	this.Id = city_count;
	this.player = player;
	this.population = 0;
	this.production = 0;
	this.producting_item = false;
	this.working_tiles = {};
	this.units = [];
	this.city_name = this.getName();
	this.city_type = type;
	if ( typeof p !== "undefined" )
		this.palce( p.x, p.y );
	else this.palce();
	this.textBaseline = "middle";
	this.textAlign = "center";
	this.changePopulation( 1000 );
	if ( typeof city_name !== 'undefined' ) {
		this.city_name = city_name;
		}
	if ( typeof id !== 'undefined' ) {
		this.Id = id;
		}
	city_count++;
	if ( send != false && game.online ) {
		game.emmit( this.emmit('new') );
		}
	return this;
	}

city.prototype.draw = function() {
	if( this.city_image.length > 0 ) {
		for ( var building in this.city_image ) {
			building = this.city_image[ building ];
			game.ctx.fillStyle = building.color;
			game.ctx.beginPath();
			if ( typeof building.top !== "undefined" && typeof building.bottom !== "undefined" ) {
				game.ctx.moveTo( building.top.x, building.top.y);
				game.ctx.lineTo( building.bottom.x, building.top.y );
				game.ctx.lineTo( building.bottom.x, building.bottom.y );
				game.ctx.lineTo( building.top.x, building.bottom.y );
				game.ctx.lineTo( building.top.x, building.top.y );
				game.ctx.closePath();
				}
			if ( typeof building.center !== "undefined"  && typeof building.center.radius !== "undefined" ) {
				game.ctx.arc( building.center.x, building.center.y, building.center.radius, 0, 2 * Math.PI, false );
				}
			game.ctx.fill();
			if( typeof building.no_border === "undefined" ) {
				game.ctx.strokeStyle = "white";
				game.ctx.lineWidth = 1;
				game.ctx.stroke();
				}
			}
		}

	if(this.image) {
		game.ctx.drawImage(this.image, this.top.x-this.bottom.x-this.image.width/2, this.top.y-this.bottom.y-this.image.height/2);
		}
	
	if(this.city_name && this.display_population) {
		var text_height = 14;
		game.ctx.font = "bolder "+ text_height+"pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
		game.ctx.textAlign = "left";
		game.ctx.textBaseline = "bottom";
		if(this.textAlign)
			game.ctx.textAlign = this.textAlign;
		if(this.textBaseline)
			game.ctx.textBaseline = this.textBaseline;
		if( typeof this.production_text !== "undefined" && this.production_text !== "undefined 0" && this.production_text != false )
			var text = this.production_text + " " + this.city_name + " " + this.display_population;
		else
			var text = this.city_name + " " + this.display_population;
		var text_stats = game.ctx.measureText(text);
		game.ctx.fillStyle = game.options.UI_Color;
		game.ctx.fillRect( this.x - (text_stats.width+2)/2, this.y - HT.Hexagon.Static.HEIGHT/2 - (text_height+2)/2,
			this.x + (text_stats.width+2)/2 - (this.x - (text_stats.width+2)/2), this.y - HT.Hexagon.Static.HEIGHT/2 + (text_height+2)/2 - (this.y - HT.Hexagon.Static.HEIGHT/2 - (text_height+2)/2) );
		game.ctx.fillStyle = "gold"
		game.ctx.fillText( text, this.x, this.y - HT.Hexagon.Static.HEIGHT/2 );
		}
	};

city.prototype.randomColor = function() {
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++ ) {
		color += letters[Math.floor(Math.random() * 16)];
		}
	return "#916C47";
	}

city.prototype.getName = function() {
	for ( var i = 0; i < game.nations[ game.players[ this.player ].nation ].city_names.length ; i++ ) {
		var chosen_previously = true;
		while ( chosen_previously ) {
			chosen_previously = false;
			var my_name = this.randomName();
			for ( var other_name in game.players[ this.player ].cities ) {
				if ( game.players[ this.player ].cities[ other_name ].city_name === my_name ) {
					chosen_previously = true;
					}
				}
			}
		return my_name;
		}
	}

city.prototype.randomName = function() {
	for ( var nation in game.nations[ game.players[ this.player ].nation ] ) {
		nation = game.nations[ game.players[ this.player ].nation ];
		num = Math.round(Math.random() * 100) % nation.city_names.length;
		while ( typeof nation.city_names[ num ] === "undefined" ) {
			num = Math.round(Math.random() * 100) % nation.city_names.length;
			}
		return nation.city_names[ num ];
		}
	}

city.prototype.create_city_image = function() {
	this.city_image = [];
	this.distance_from_center = 1;
	for ( var i = 0; i < this.population/50; i++ ) {
		var overlaping = true;
		while ( overlaping ) {
			overlaping = false;
			var building = this.building_image();
			for ( var other_building in this.city_image ) {
				if ( game.inCords( building.top, building.bottom, 
					this.city_image[ other_building ].top, 
					this.city_image[ other_building ].bottom ) ) {
					overlaping = true;
					this.distance_from_center++;
					}
				}
			}
		this.city_image.push( building );
		}
	};

city.prototype.building_image = function() {
	var top = {};
	if ( Math.random() > 0.6 )
		top.x = this.x + Math.random() * this.distance_from_center;
	else
		top.x = this.x - Math.random() * this.distance_from_center;
	if ( Math.random() > 0.5 )
		top.y = this.y + Math.random() * this.distance_from_center;
	else
		top.y = this.y - Math.random() * this.distance_from_center;
	var bottom = {
		x: top.x + (Math.random() * 20),
		y: top.y + (Math.random() * 20)
		};
	return { top: top, bottom: bottom, color: this.randomColor() };
	};

city.prototype.palce = function( x, y ){
	var current_tile = this.tile();
	if ( current_tile != false ) {
		current_tile.city_Id = false;
		current_tile.city__player = this.player;
		}
	while ( true ){
		if ( typeof x !== "undefined" && typeof y !== "undefined" ) {
			var tile = grid.GetHexByGridPos( x, y );
			if ( tile && typeof this[ tile.type ] === "undefined" &&
				typeof this[ tile.type ] != false ) {
				tile.city_Id = this.Id;
				tile.city__player = this.player;
				this.tile_Id = tile.Id;
				this.x = tile.x+HT.Hexagon.Static.WIDTH/2;
				this.y = tile.y+HT.Hexagon.Static.HEIGHT/2;
				var tile = this.tile();
				var around = [ grid.GetHexByGridPos( tile.PathCoOrdX, tile.PathCoOrdY-1 ),
					grid.GetHexByGridPos( tile.PathCoOrdX+1, tile.PathCoOrdY ),
					grid.GetHexByGridPos( tile.PathCoOrdX+1, tile.PathCoOrdY+1 ),
					grid.GetHexByGridPos( tile.PathCoOrdX, tile.PathCoOrdY+1 ),
					grid.GetHexByGridPos( tile.PathCoOrdX-1, tile.PathCoOrdY ),
					grid.GetHexByGridPos( tile.PathCoOrdX-1, tile.PathCoOrdY-1 ) ];
				for ( tile in around ) { 
					if ( around[tile] ) {
						around[tile].owner = this.player;
						game.players[ this.player ].territories.push( around[tile] );
						}
					}
				game.players[ this.player ].territory_change();
				return true;
				}
			}
		x = Math.round(Math.random()*100) % grid.lastRow;
		y = Math.round(Math.random()*100) % grid.lastColumn;
		}
	}

city.prototype.tile = function(){
	return grid.GetHexById( this.tile_Id );
	}

city.prototype.changePopulation = function( population ){
	this.population += population;
	this.create_city_image();
	this.tiles_worked( Math.round(this.population/1000) );
	this.display_population = population.toString();
	if ( this.display_population.length <= 4 )
		this.display_population = this.population.toString()[0] + "K";
	else if ( this.display_population.length <= 5 )
		this.display_population = this.population.toString().slice(0,2) + "K";
	else if ( this.display_population.length <= 6 )
		this.display_population = this.population.toString().slice(0,3) + "K";
	else if ( this.display_population.length >= 7 )
		this.display_population = this.population.toString()[0] + "M";
	else if ( this.display_population.length <= 8 )
		this.display_population = this.population.toString().slice(0,2) + "M";
	else if ( this.display_population.length <= 9 )
		this.display_population = this.population.toString().slice(0,3) + "M";
	}

city.prototype.tiles_worked = function( number_worked ) {
	var working = {};
	var tile = this.tile();
	while ( working.length < number_worked ) {
		var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
		var x = Math.round(Math.random()*10) * plusOrMinus;
		var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
		var y = Math.round(Math.random()*10) * plusOrMinus;
		var add = grid.GetHexByGridPos( tile.PathCoOrdX + x, tile.PathCoOrdY + y );
		var place_at = {
			x: add.PathCoOrdX,
			y: add.PathCoOrdY
			};
		if ( add && game.players[ this.player ].in_territory( add.Id ) ) {
			var new_unit = new unit( "City Worker", this.player, place_at )
			working[ new_unit.Id ] = new_unit;
			}
		}
	this.units = working;
	}


city.prototype.options = function() {
	ui.bottom_bar.city_actions_clear();
	ui.bottom_bar.unit_actions_clear();
	for ( var unit in game.players[ this.player ].available_units ) {

		}
	for ( var option in ui.bottom_bar.city_actions ) {
		ui.bottom_bar.city_actions[ option ].active = true;
		}
	return true;
	}

city.prototype.producing = function( item, type ) {
	this.producting_item = item;
	this.production_text = item._id;
	this.production_type = type;
	for ( var complete_in = 0, production = this.production; production < item.cost; complete_in++ ) {
		for ( var tile in this.units ) {
			tile = this.units[ tile ].tile();
			production += tile.production;
			}
		}
	this.production_text += " " + complete_in;
	}

city.prototype.produce = function() {
	if ( this.producting_item != false ) {
		for ( var tile in this.units ) {
			tile = this.units[ tile ].tile();
			this.production += tile.production;
			if ( this.production >= this.producting_item.cost ) {
				var place_at = {
					x: this.tile().PathCoOrdX,
					y: this.tile().PathCoOrdY
					};
				if ( this.production_type == "unit" ) {
					var new_unit = new unit( this.producting_item._id, this.player, place_at );
					if ( !game.players[ this.player ].units[ new_unit.Id ] )
						game.players[ this.player ].units[ new_unit.Id ] = new_unit;
					}
				this.production = 0;
				this.production_text = false;
				this.producting_item = false;
				}
			}
		for ( var complete_in = 0, production = this.production; production < this.producting_item.cost; complete_in++ ) {
			for ( var tile in this.units ) {
				tile = this.units[ tile ].tile();
				production += tile.production;
				}
			}
		this.production_text = this.producting_item._id + " " + complete_in;
		}
	}

city.prototype.emmit = function( isnew ) {
	if ( isnew === 'new' )
		return { new_city: this.city_type, player: this.player, position: { x: this.tile().PathCoOrdX, y: this.tile().PathCoOrdY }, city_name: this.city_name, id: this.Id };
	else
		return { update: 'units', player: this.player, position: { x: this.tile().PathCoOrdX, y: this.tile().PathCoOrdY }, city_name: this.city_name, id: this.Id };
	}