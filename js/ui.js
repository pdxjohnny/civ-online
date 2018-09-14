var ui = {}, currentDate = new Date();

setInterval(function(){
	currentDate = new Date();
	ui.top_bar.text = ((currentDate.getHours() < 13)?currentDate.getHours():currentDate.getHours()-12) + ":"+ ((currentDate.getMinutes() < 10)?"0":"") + currentDate.getMinutes();
	}, 30000);

ui.onclick = function( mouse_click ) {
	var unscaled_click = {
		x: mouse_click.x / (1/game.options.Zoom),
		y: mouse_click.y / (1/game.options.Zoom),
		incords: mouse_click.incords
		}
	for ( var major_element in ui ){
		major_element = ui[major_element];
		if ( typeof major_element !== "function" ) {
			for ( var element in major_element ) {
				for ( var sub_element in major_element[element] ){
					name = sub_element;
					sub_element = major_element[element][sub_element];
					if ( typeof sub_element.clicked === "function" && sub_element.active ) {
						if ( unscaled_click.incords( sub_element.center ) ||
							unscaled_click.incords( sub_element.top, sub_element.bottom ) ) {
							sub_element.clicked();
							return name;
							}
						}
					}
				}
			}
		}
	for ( var major_element in ui ){
		name = major_element;
		major_element = ui[major_element];
		if ( typeof major_element !== "function" ) {
			if ( typeof major_element.clicked === "function" && major_element.active ) {
				if ( unscaled_click.incords( major_element.center ) ||
					unscaled_click.incords( major_element.top, major_element.bottom ) ) {
					major_element.clicked();
					return name;
					}
				}
			}
		}
	return false;
	}

ui.draw = function( ) {
	for ( var major_element in ui ){
		major_element = ui[major_element];
		if ( typeof major_element !== "function" ) {
			if ( typeof major_element.top !== "undefined" &&
				typeof major_element.bottom !== "undefined" &&
				major_element.active ){
				ui.draw_element( major_element );
				}
			for ( var element in major_element ) {
				for ( var sub_element in major_element[element] ){
					sub_element = major_element[element][sub_element];
					if ( sub_element.active ) {
						ui.draw_element( sub_element );
						}
					if ( typeof sub_element.special !== "undefined" ) {
						sub_element.special();
						}
					}
				}
			}
		}
	return true;
	}

ui.draw_element = function( object ) {
	
	if(object.background) {
		if ( object.opacity )
			game.ctx.globalAlpha = object.opacity;
		game.ctx.fillStyle = object.background;
		game.ctx.beginPath();
		if ( typeof object.top !== "undefined" && typeof object.bottom !== "undefined" ) {
			game.ctx.moveTo(object.top.x, object.top.y);
			game.ctx.lineTo( object.bottom.x, object.top.y );
			game.ctx.lineTo( object.bottom.x, object.bottom.y );
			game.ctx.lineTo( object.top.x, object.bottom.y );
			game.ctx.lineTo( object.top.x, object.top.y );
			game.ctx.closePath();
			}
		if ( typeof object.center !== "undefined"  && typeof object.center.radius !== "undefined" ) {
      		game.ctx.arc( object.center.x, object.center.y, object.center.radius, 0, 2 * Math.PI, false );
			}
		game.ctx.fill();
		if( typeof object.no_border === "undefined" ) {
			if ( object.border )
				game.ctx.strokeStyle = object.border;
			else
				game.ctx.strokeStyle = "white";
			game.ctx.lineWidth = 1;
			game.ctx.stroke();
			}
		game.ctx.globalAlpha = 1;
		}

	for ( var prop in object ) {
		if( typeof object[ prop ].tagName !== "undefined" && object[ prop ].tagName === "IMG" ) {
			game.ctx.drawImage(object[ prop ], object[ prop ].x-object[ prop ].x-object[ prop ].width/2, object[ prop ].y-object[ prop ].y-object[ prop ].height/2);
			}
		}
	
	if(object.text) {
		game.ctx.fillStyle = "white"
		game.ctx.font = "bolder 14pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
		game.ctx.textAlign = "left";
		game.ctx.textBaseline = "bottom";
		if(object.textAlign)
			game.ctx.textAlign = object.textAlign;
		if(object.textBaseline)
			game.ctx.textBaseline = object.textBaseline;
		if( object.text_pos )
			game.ctx.fillText(object.text, object.text_pos.x, object.text_pos.y);
		else if( object.center )
			game.ctx.fillText(object.text, object.center.x, object.center.y);
		else 
			game.ctx.fillText(object.text, object.top.x, object.bottom.y);
		}
	}

ui.top_bar = {
	buttons: {
		menu: {
			text: "Menu",
			background: game.options.UI_Color,
			opacity: game.options.Menu_Opacity,
			active: true
			},
		tech: {
			text: "Tech",
			background: game.options.UI_Color,
			opacity: game.options.Menu_Opacity,
			active: true
			},
		turn: {
			text: "Turn ",
			background: game.options.UI_Color,
			opacity: game.options.Menu_Opacity,
			active: true
			},
		year: {
			text: "Year ",
			background: game.options.UI_Color,
			opacity: game.options.Menu_Opacity,
			active: true
			},
		zoom: {
			background: game.options.UI_Color,
			opacity: game.options.Menu_Opacity,
			active: true
			},
		zoom_range: {
			background: "#A4A4A4",
			opacity: 0.8,
			active: true
			},
		zoom_slider: {
			sliding: false,
			background: "#00BFFF",
			opacity: 0.9,
			active: true
			},
		},
	text: ((currentDate.getHours() < 13)?currentDate.getHours():currentDate.getHours()-12) + ":"+ ((currentDate.getMinutes() < 10)?"0":"") + currentDate.getMinutes(),
	background: game.options.UI_Color,
	textAlign: "center",
	opacity: game.options.Menu_Opacity,
	active: true
	};

ui.bottom_bar = {
	buttons: {
		unit_health: {
			background: game.options.UI_Color,
			no_border: true,
			active: false
			},
		unit_moves: {
			background: game.options.UI_Color,
			no_border: true,
			active: false
			},
		unit_name: {
			background: game.options.UI_Color,
			no_border: true,
			active: false
			},
		},
	areas: {
		minimap: {
			background: game.options.UI_Color,
			opacity: game.options.Menu_Opacity,
			active: true
			},
		end_turn: {
			text: "End turn",
			background: game.options.UI_Color,
			opacity: game.options.Menu_Opacity,
			active: true
			},
		},
	background: game.options.UI_Color,
	opacity: game.options.Menu_Opacity,
	active: true
	};

ui.resize = function(){
	ui.top_bar.buttons.menu.top = {
		x: game.canvas.width - 60,
		y: 0,
		};
	ui.top_bar.buttons.menu.bottom = {
		x: game.canvas.width,
		y: 25,
		};
	ui.top_bar.buttons.tech.top = {
		x: 0,
		y: 0,
		};
	ui.top_bar.buttons.tech.bottom = {
		x: 60,
		y: 25,
		};
	ui.top_bar.buttons.turn.top = {
		x: game.canvas.width - 160,
		y: 0,
		};
	ui.top_bar.buttons.turn.bottom = {
		x: game.canvas.width - 60,
		y: 25,
		};
	ui.top_bar.buttons.year.top = {
		x: game.canvas.width - 300,
		y: 0,
		};
	ui.top_bar.buttons.year.bottom = {
		x: game.canvas.width - 160,
		y: 25,
		};
	ui.top_bar.buttons.zoom.top = {
		x: game.canvas.width - 400,
		y: 0,
		};
	ui.top_bar.buttons.zoom.bottom = {
		x: game.canvas.width - 300,
		y: 25,
		};
	ui.top_bar.buttons.zoom_range.top = {
		x: game.canvas.width - 395,
		y: 10,
		};
	ui.top_bar.buttons.zoom_range.bottom = {
		x: game.canvas.width - 305,
		y: 15,
		};
	ui.top_bar.buttons.zoom_slider.top = {
		x: game.canvas.width - 360,
		y: 2.5,
		};
	ui.top_bar.buttons.zoom_slider.bottom = {
		x: game.canvas.width - 340,
		y: 22.5,
		};
	ui.top_bar.top = {
		x: 0,
		y: 0,
		};
	ui.top_bar.bottom = {
		x: game.canvas.width,
		y: 25,
		};
	ui.top_bar.text_pos = {
		x: game.canvas.width/2,
		y: 25,
		};
	
	ui.bottom_bar.areas.minimap.top = {
		x: game.canvas.width - 250,
		y: game.canvas.height - 200,
		};
	ui.bottom_bar.areas.minimap.bottom = {
		x: game.canvas.width,
		y: game.canvas.height,
		};
	ui.bottom_bar.areas.end_turn.top = {
		x: game.canvas.width - 100,
		y: game.canvas.height - 220,
		};
	ui.bottom_bar.areas.end_turn.bottom = {
		x: game.canvas.width,
		y: game.canvas.height - 200,
		}; 
	ui.bottom_bar.top = {
		x: 0,
		y: game.canvas.height - 25,
		};
	ui.bottom_bar.bottom = {
		x: game.canvas.width,
		y: game.canvas.height,
		};

	if ( game.canvas.width <= 900 ) {
		ui.bottom_bar.active = false;
		ui.bottom_bar.areas.minimap.active = false;
		ui.top_bar.buttons.year.active = false;
		ui.bottom_bar.areas.end_turn.top = {
			x: game.canvas.width - 100,
			y: game.canvas.height - 20,
			};
		ui.bottom_bar.areas.end_turn.bottom = {
			x: game.canvas.width,
			y: game.canvas.height,
			};
		ui.top_bar.buttons.zoom.top.x += 140;
		ui.top_bar.buttons.zoom.bottom.x += 140;
		ui.top_bar.buttons.zoom_range.top.x += 140;
		ui.top_bar.buttons.zoom_range.bottom.x += 140;
		ui.top_bar.buttons.zoom_slider.top.x += 140;
		ui.top_bar.buttons.zoom_slider.bottom.x += 140;
		}
	}

ui.top_bar.buttons.menu.clicked = function(){
	this.toggle();
	options_div = document.getElementById('optionsdiv_contents');
	var html = "<ul>";
	for ( var option in game.options ) {
		html += "<li>" + option.replace(new RegExp("_", 'g'), " ");
		html += "<input id=\"option." + option + "\" value=\"" + game.options[option] + "\" />"
		html += "</li>";
		}
	html += "</ul>"
	html += "<center><button onclick=\"ui.top_bar.buttons.menu.save_options()\" >Save</button></center>";
	options_div.innerHTML = html;
	}

ui.top_bar.buttons.menu.save_options = function() {
	for ( var option in game.options ) {
		game.options[option] = document.getElementById( 'option.'+option ).value;
		if ( game.options[option] === "true" )
			game.options[option] = true;
		if ( game.options[option] === "false" )
			game.options[option] = false;
		if ( !isNaN( game.options[option] ) && typeof game.options[option] !== "boolean" )
			game.options[option] = Number( game.options[option] );
		}
	game.returnSpan( "Saved" );
	}

ui.top_bar.buttons.zoom_slider.clicked = function() {
	ui.top_bar.buttons.zoom_slider.sliding = true;
	}

ui.top_bar.buttons.zoom_slider.mousemove = function(position){
	if ( ui.top_bar.buttons.zoom_slider.sliding ) {
		position = game.getMousePos(position, true);
		zoom_slider = ui.top_bar.buttons.zoom_slider;
		if ( typeof zoom_slider.center === "undefined" )
			zoom_slider.center = zoom_slider.top.x + ((zoom_slider.top.x-zoom_slider.bottom.x)/2);
		var current = zoom_slider.top.x - ((zoom_slider.top.x-zoom_slider.bottom.x)/2);
		var change = current - position.x;
		if ( (zoom_slider.top.x - change - (zoom_slider.top.x-zoom_slider.bottom.x) ) <= ui.top_bar.buttons.zoom_range.bottom.x &&
			(zoom_slider.bottom.x - change + (zoom_slider.top.x-zoom_slider.bottom.x) ) >= ui.top_bar.buttons.zoom_range.top.x ) {
			zoom_slider.top.x -= change;
			zoom_slider.bottom.x -= change;
			var distance_from_center = (zoom_slider.center - ( zoom_slider.top.x + ((zoom_slider.top.x-zoom_slider.bottom.x)/2)) );
			game.options.Zoom = 1 - (distance_from_center/37);
			}
		}
	return false;
	}

ui.top_bar.buttons.menu.toggle = function() {
	if ( document.getElementById('main').style.display === 'block' )
		document.getElementById('main').style.display = 'none';
	else 
		document.getElementById('main').style.display = 'block';
	}

ui.bottom_bar.areas.end_turn.clicked = function(){
	if ( game.can_end_turn )
		game.end_turn( game.username );
	}

ui.top_bar.buttons.tech.clicked = function(){
	ui.tech_tree.toggle();
	}

ui.grid = function( box_width, box_height, end_column ) {
	var margin = ( game.canvas.height % box_height ) / 2;
	this.grid = [];
	var column = 0;
	if ( typeof end_column !== "undefined" )
		var end_at_width = end_column * (box_width-1);
	else
		var end_at_width = game.canvas.width - box_width;
	for ( var x = 0; x <= end_at_width; x += box_width ) {
		var row = 0;
		for ( var y = margin; y <= game.canvas.height - margin - box_height; y += box_height ) {
			var box = {
				top: {
					x: x,
					y: y
					},
				bottom: {
					x: x + box_width,
					y: y + box_height
					},
				row: row,
				column: column
				};
			this.grid.push( box );
			row++;
			}
		column++;
		}
	this.last_row = row;
	this.last_column = column;
	return this;
	}

ui.grid.prototype.get_box = function( row, column ) {
	for ( var box in this.grid ) {
		if ( this.grid[ box ].row == row &&
			this.grid[ box ].column == column )
			return this.grid[ box ];
		}
	};