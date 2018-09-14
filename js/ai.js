function nearMe( aid, username, x, y, range ) {
	var near = [];
	for ( var i in meL.units ){
		var unit = meL.units[i];
		if ( unit.aid !== aid || unit.username.un !== username.un ) {
			if ( inCords( { x: x-range, y: y-range }, 
				{ x: x+range, y: y+range },  unit ) ){
					near.push( unit );
				}
			}
		}
	for ( var i in game.playersL ){
		var unit = game.playersL[i];
		if ( unit.aid !== aid || unit.username.un !== username.un ) {
			if ( inCords( { x: x-range, y: y-range }, 
				{ x: x+range, y: y+range },  unit ) ){
					near.push( unit );
				}
			}
		}
	for ( var i in game.structuresL ){
		var unit = game.structuresL[i];
		if ( unit.aid !== aid || unit.username.un !== username.un ) {
			if ( inCords( { x: x-range, y: y-range }, 
				{ x: x+range, y: y+range },  unit ) ){
					near.push( unit );
				}
			}
		}
	for ( var i in game.opponents ){
		var unit = game.opponents[i];
		if ( unit.aid !== aid || unit.username.un !== username.un ) {
			if ( inCords( { x: x-range, y: y-range }, 
				{ x: x+range, y: y+range },  unit ) ){
					near.push( unit );
				}
			}
		}
	for ( var i in near ){
		if ( near[i].username.un === username.un ) {
			delete near[i];
			}
		}
	near = deleteUndefined( near );
	if ( near.length == 0 ) return false;
	else if ( near.length == 1 ) return near[0];
	else if ( near.length > 1 ) return nearMe( aid, username, x, y, range-10 );
	}

function target( object, target ) {
	if ( object.target ) object.target.targeted = false;
	if ( target ) {
		object.target = target;
		target.targeted = true;
		}
	}

function fireOnTarget( object ) {
	object.canFire = false;
	setTimeout( function() { 
		object.canFire = true;
		}, object.unit.stats.fireSpeed*1000 );
	//game.weapons.push( new weapon( object.id, object.username, game.weapons.length,
	//	object.x, object.y, object.unit.weapon.image, object.unit.weapon.weaponName, object.unit.weapon.stats ) );
	}

function doDamage( weapon, hit ) {

	}
