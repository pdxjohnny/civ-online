var player_count = 0;

var player = function( name, nation, color, send ) {
	this.username = name;
	this.science = 0;
	this.color = color;
	this.nation = nation;
	this.units = {};
	this.cities = {};
	this.available_units = [];
	this.technologies = [];
	this.territories = [];
	this.tech_in_progress = false;
	player_count++;
	this.tech_completed("Tools");
	if ( send == true && game.online ) {
		game.emmit( this.emmit() );
		}
	//game.players[ name ] = this;
	return this;
	}

player.prototype.research = function() {
	if ( this.tech_in_progress ) {
		for ( var city in this.cities ) {
			this.tech_in_progress.science -= this.cities[ city ].science;
			}
		}
	if ( this.tech_in_progress.science <= 0 ) {
		this.technologies.push( this.tech_in_progress.tech_name );
		this.tech_completed( this.tech_in_progress.tech_name );
		}
	}

player.prototype.tech_completed = function( tech_name ) {
	for ( var unit in game.technologies[ tech_name ].units ) {
		this.available_units.push( game.technologies[ tech_name ].units[ unit ] );
		}
	}

player.prototype.territory_change = function() {
	}

player.prototype.in_territory = function( id ) {
	for ( var tile in this.territories ) {
		if ( this.territories[ tile ].Id === id )
			return this.territories[ tile ];
		}
	return false;
	}

player.prototype.emmit = function( isnew ) {
	return { new_player: this.username, nation: this.nation, color: this.color };
	}