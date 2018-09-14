var HT = HT || {};
/**
 * A Point is simply x and y coordinates
 * @constructor
 */
HT.Point = function(x, y) {
	this.x = x;
	this.y = y;
};

/**
 * A Rectangle is x and y origin and width and height
 * @constructor
 */
HT.Rectangle = function(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.Width = width;
	this.Height = height;
};

/**
 * A Line is x and y start and x and y end
 * @constructor
 */
HT.Line = function(x1, y1, x2, y2) {
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
};

/**
 * A Hexagon is a 6 sided polygon, our hexes don't have to be symmetrical, i.e. ratio of width to height could be 4 to 3
 * @constructor
 */
HT.Hexagon = function(id, x, y) {
	this.Points = [];//Polygon Base
	var x1 = false;
	var y1 = false;
	if(HT.Hexagon.Static.ORIENTATION == HT.Hexagon.Orientation.Normal) {
		x1 = (HT.Hexagon.Static.WIDTH - HT.Hexagon.Static.SIDE)/2;
		y1 = (HT.Hexagon.Static.HEIGHT / 2);
		this.Points.push(new HT.Point(x1 + x, y));
		this.Points.push(new HT.Point(x1 + HT.Hexagon.Static.SIDE + x, y));
		this.Points.push(new HT.Point(HT.Hexagon.Static.WIDTH + x, y1 + y));
		this.Points.push(new HT.Point(x1 + HT.Hexagon.Static.SIDE + x, HT.Hexagon.Static.HEIGHT + y));
		this.Points.push(new HT.Point(x1 + x, HT.Hexagon.Static.HEIGHT + y));
		this.Points.push(new HT.Point(x, y1 + y));
	}
	else {
		x1 = (HT.Hexagon.Static.WIDTH / 2);
		y1 = (HT.Hexagon.Static.HEIGHT - HT.Hexagon.Static.SIDE)/2;
		this.Points.push(new HT.Point(x1 + x, y));
		this.Points.push(new HT.Point(HT.Hexagon.Static.WIDTH + x, y1 + y));
		this.Points.push(new HT.Point(HT.Hexagon.Static.WIDTH + x, y1 + HT.Hexagon.Static.SIDE + y));
		this.Points.push(new HT.Point(x1 + x, HT.Hexagon.Static.HEIGHT + y));
		this.Points.push(new HT.Point(x, y1 + HT.Hexagon.Static.SIDE + y));
		this.Points.push(new HT.Point(x, y1 + y));
	}
	
	this.Id = id;
	
	this.x = x;
	this.y = y;
	this.x1 = x1;
	this.y1 = y1;
	
	this.TopLeftPoint = new HT.Point(this.x, this.y);
	this.BottomRightPoint = new HT.Point(this.x + HT.Hexagon.Static.WIDTH, this.y + HT.Hexagon.Static.HEIGHT);
	this.MidPoint = new HT.Point(this.x + (HT.Hexagon.Static.WIDTH / 2), this.y + (HT.Hexagon.Static.HEIGHT / 2));
	
	this.P1 = new HT.Point(x + x1, y + y1);
	
	this.selected = false;
};
	
/**
 * draws this Hexagon to the canvas
 * @this {HT.Hexagon}
 */
HT.Hexagon.prototype.draw = function( color, text, territory_color ) {

	if ( game.inCords( { x: -50 * (1/game.options.Zoom), y: -190 * (1/game.options.Zoom) }, 
			{ x: window.innerWidth * (1/game.options.Zoom), y: window.innerWidth * (1/game.options.Zoom) }, this ) ) {
		game.ctx.lineWidth = 1;
		if ( game.options.Draw_Grid_Lines ) game.ctx.strokeStyle = "gray";
		else game.ctx.strokeStyle = this.background;
		if( color ) {
			game.ctx.strokeStyle = color;
			game.ctx.lineWidth = 5;
			}
		game.ctx.beginPath();
		game.ctx.moveTo(this.Points[0].x, this.Points[0].y);
		for(var i = 1; i < this.Points.length; i++)
		{
			var p = this.Points[i];
			game.ctx.lineTo(p.x, p.y);
		}
		game.ctx.closePath();
		game.ctx.stroke();
		}

	
	
	if(this.background)
	{
		game.ctx.fillStyle = this.background;
		game.ctx.beginPath();
		game.ctx.moveTo(this.Points[0].x, this.Points[0].y);
		for(var i = 1; i < this.Points.length; i++)
		{
			var p = this.Points[i];
			game.ctx.lineTo(p.x, p.y);
		}
		game.ctx.closePath();
		game.ctx.fill();
	}

	if(this.image)
	{
		// draw image
		game.ctx.drawImage(this.image, this.MidPoint.x-this.image.width/2, this.MidPoint.y-this.image.height/2);
	}

	if(this.text)
	{
		game.ctx.fillStyle = "black"
		game.ctx.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
		game.ctx.textAlign = "center";
		game.ctx.textBaseline = 'middle';
		game.ctx.fillText( this.text, this.MidPoint.x, this.MidPoint.y );
	}

	if( text )
	{
		game.ctx.fillStyle = "black"
		game.ctx.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
		game.ctx.textAlign = "center";
		game.ctx.textBaseline = 'middle';
		game.ctx.fillText( text, this.MidPoint.x, this.MidPoint.y );
	}

	if( this.owner && territory_color )
	{
		game.ctx.globalAlpha = 0.5;
		game.ctx.lineWidth = 5;
		game.ctx.strokeStyle = territory_color;
		game.ctx.beginPath();
		game.ctx.moveTo(this.Points[0].x, this.Points[0].y);
		for(var i = 1; i < this.Points.length; i++)
		{
			var p = this.Points[i];
			game.ctx.lineTo(p.x, p.y);
		}
		game.ctx.closePath();
		game.ctx.stroke();
		game.ctx.globalAlpha = 1;
	}
	/*
	if(this.Id)
	{
		//draw text for debugging
		game.ctx.fillStyle = "black"
		game.ctx.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
		game.ctx.textAlign = "center";
		game.ctx.textBaseline = 'middle';
		//var textWidth = game.ctx.measureText(this.Planet.BoundingHex.Id);
		game.ctx.fillText(this.Id, this.MidPoint.x, this.MidPoint.y);
	}
	
	if(this.PathCoOrdX !== false && this.PathCoOrdY !== false && typeof(this.PathCoOrdX) != "undefined" && typeof(this.PathCoOrdY) != "undefined")
	{
		//draw co-ordinates for debugging
		game.ctx.fillStyle = "black"
		game.ctx.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
		game.ctx.textAlign = "center";
		game.ctx.textBaseline = 'middle';
		//var textWidth = game.ctx.measureText(this.Planet.BoundingHex.Id);
		game.ctx.fillText("("+this.PathCoOrdX+","+this.PathCoOrdY+")", this.MidPoint.x, this.MidPoint.y + 10);
	}
	*/
};

/**
 * Returns true if the x,y coordinates are inside this hexagon
 * @this {HT.Hexagon}
 * @return {boolean}
 */
HT.Hexagon.prototype.isInBounds = function(x, y) {
	return this.Contains(new HT.Point(x, y));
};
	

/**
 * Returns true if the point is inside this hexagon, it is a quick contains
 * @this {HT.Hexagon}
 * @param {HT.Point} p the test point
 * @return {boolean}
 */
HT.Hexagon.prototype.isInHexBounds = function(/*Point*/ p) {
	if(this.TopLeftPoint.x < p.x && this.TopLeftPoint.y < p.y &&
	   p.x < this.BottomRightPoint.x && p.y < this.BottomRightPoint.y)
		return true;
	return false;
};

//grabbed from:
//https://www.developingfor.net/c-20/testing-to-see-if-a-point-is-within-a-polygon.html
//and
//https://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html#The%20C%20Code
/**
 * Returns true if the point is inside this hexagon, it first uses the quick isInHexBounds contains, then check the boundaries
 * @this {HT.Hexagon}
 * @param {HT.Point} p the test point
 * @return {boolean}
 */
HT.Hexagon.prototype.Contains = function(/*Point*/ p) {
	var isIn = false;
	if (this.isInHexBounds(p))
	{
		//turn our absolute point into a relative point for comparing with the polygon's points
		//var pRel = new HT.Point(p.x - this.x, p.y - this.y);
		var i, j = 0;
		for (i = 0, j = this.Points.length - 1; i < this.Points.length; j = i++)
		{
			var iP = this.Points[i];
			var jP = this.Points[j];
			if (
				(
				 ((iP.y <= p.y) && (p.y < jP.y)) ||
				 ((jP.y <= p.y) && (p.y < iP.y))
				//((iP.y > p.y) != (jP.y > p.y))
				) &&
				(p.x < (jP.x - iP.x) * (p.y - iP.y) / (jP.y - iP.y) + iP.x)
			   )
			{
				isIn = !isIn;
			}
		}
	}
	return isIn;
};

/**
* Returns absolute distance in pixels from the mid point of this hex to the given point
* Provided by: Ian (Disqus user: boingy)
* @this {HT.Hexagon}
* @param {HT.Point} p the test point
* @return {number} the distance in pixels
*/
HT.Hexagon.prototype.distanceFromMidPoint = function(/*Point*/ p) {
	// Pythagoras' Theorem: Square of hypotenuse = sum of squares of other two sides
	var deltaX = this.MidPoint.x - p.x;
	var deltaY = this.MidPoint.y - p.y;

	// squaring so don't need to worry about square-rooting a negative number 
	return Math.sqrt( (deltaX * deltaX) + (deltaY * deltaY) );
};

// Gets the hexagon's unit
HT.Hexagon.prototype.unit = function( player_name, type ) {
	for ( var player in game.players ) {
		player = game.players[ player ];
		if ( typeof player.units !== "undefined" ) {
			for ( var unit in player.units ) {
				if ( typeof type === "undefined" ) {
					if ( ( this[ "unit_Id" ] === player.units[ unit ].Id ||
							this[ "civilian_Id" ] === player.units[ unit ].Id ) &&
						( this[ "unit_player" ] === player_name ||
							this[ "civilian_player" ] === player_name ) ){
						return player.units[ unit ];
						}
					}
				else if ( this[ type+"_Id" ] === player.units[ unit ].Id &&
					player_name === player.cities[ city ].player ){
					return player.units[ unit ];
					}
				}
			}
		}
	return false;
	}

// Gets the hexagon's unit
HT.Hexagon.prototype.city = function( player_name, type ) {
	for ( var player in game.players ) {
		player = game.players[ player ];
		if ( typeof player.cities !== "undefined" ) {
			for ( var city in player.cities ) {
				if ( this.city_Id === player.cities[ city ].Id &&
					this.city_player === player_name ){
					return player.cities[ city ];
					}
				}
			}
		}
	return false;
	}

HT.Hexagon.Orientation = {
	Normal: 0,
	Rotated: 1
};

HT.Hexagon.Static = { HEIGHT:91.14378277661477
					, WIDTH:91.14378277661477
					, SIDE:50.0
					, ORIENTATION:HT.Hexagon.Orientation.Normal
					, DRAWSTATS: false};//hexagons will have 25 unit sides for now


