ui.tech_tree = {
	scroll_bar: {
		scroll: {
			background: game.options.UI_Color,
			opacity: game.options.Menu_Opacity,
			active: false
			},
		scroll_range: {
			background: "#A4A4A4",
			opacity: 0.8,
			active: false
			},
		scroll_slider: {
			sliding: false,
			background: "#00BFFF",
			opacity: 0.9,
			active: false
			},
		},
	technologies: {},
	background: game.options.UI_Color,
	opacity: game.options.Menu_Opacity,
	textAlign: "center",
	active: false
	};

ui.tech_tree.resize = function() {
	ui.tech_tree.technologies.create_techs();
	ui.tech_tree.scroll_bar.scroll.top = {
		x: 0,
		y: game.canvas.height - 30,
		};
	ui.tech_tree.scroll_bar.scroll.bottom = {
		x: game.canvas.width,
		y: game.canvas.height,
		};
	ui.tech_tree.scroll_bar.scroll_range.top = {
		x: 10,
		y: game.canvas.height - 20,
		};
	ui.tech_tree.scroll_bar.scroll_range.bottom = {
		x: game.canvas.width - 10,
		y: game.canvas.height - 10,
		};
	ui.tech_tree.scroll_bar.scroll_slider.center = {
		x: 10,
		y: game.canvas.height - 15,
		radius: 10,
		};
	ui.tech_tree.top = {
		x: 0,
		y: 25,
		};
	ui.tech_tree.bottom = {
		x: game.canvas.width,
		y: game.canvas.height,
		};
	ui.tech_tree.text_pos = {
		x: game.canvas.width/2,
		y: 25,
		};
	}

ui.tech_tree.toggle = function() {
	if ( ui.tech_tree.active ) {
		for ( var prop in ui.tech_tree ) {
			for ( var sub_prop in ui.tech_tree[ prop ] ) {
				ui.tech_tree[ prop ][ sub_prop ].active = false;
				}
			}
		ui.tech_tree.active = false;
		}
	else {
		for ( var prop in ui.tech_tree ) {
			for ( var sub_prop in ui.tech_tree[ prop ] ) {
				ui.tech_tree[ prop ][ sub_prop ].active = true;
				}
			}
		ui.tech_tree.active = true;
		}
	}

ui.tech_tree.clicked = function() {
	return false;
	}

ui.tech_tree.scroll_bar.scroll_slider.clicked = function() {
	ui.tech_tree.scroll_bar.scroll_slider.sliding = true;
	}

ui.tech_tree.scroll_bar.scroll_slider.mousemove = function(position){
	if ( ui.tech_tree.scroll_bar.scroll_slider.sliding ) {
		position = game.getMousePos(position, true);
		scroll_slider = ui.tech_tree.scroll_bar.scroll_slider;
		if ( typeof scroll_slider.origin === "undefined" )
			scroll_slider.origin = scroll_slider.center.x;
		var current = scroll_slider.center.x
		var change = current - position.x;
		if ( (scroll_slider.center.x - change ) <= ui.tech_tree.scroll_bar.scroll_range.bottom.x &&
			(scroll_slider.center.x - change ) >= ui.tech_tree.scroll_bar.scroll_range.top.x ) {
			scroll_slider.center.x -= change;
			var distance_from_center = (scroll_slider.origin - scroll_slider.center.x );
			//game.options.scroll = 1 - (distance_from_center/37);
			}
		return false;
		}
	}

ui.tech_tree.technologies.create_techs = function() {
	var grid = new ui.grid( 200, 40, ui.tech_tree.technologies.highest_level_tech()*2 );
	var levels = {};
	for ( var tech in game.technologies ) {
		if ( typeof levels[ game.technologies[ tech ].level ] === "undefined" )
			levels[ game.technologies[ tech ].level ] = 1;
		else
			levels[ game.technologies[ tech ].level ] += 2;
		if ( game.technologies[ tech ].level % 2 == 0 ) {
			ui.tech_tree.technologies[ tech ] = grid.get_box( levels[ game.technologies[ tech ].level ], game.technologies[ tech ].level );
			}
		else
			ui.tech_tree.technologies[ tech ] = grid.get_box( levels[ game.technologies[ tech ].level ], game.technologies[ tech ].level );
		ui.tech_tree.technologies[ tech ].opacity = 0.9;
		ui.tech_tree.technologies[ tech ].background = game.options.UI_Color;
		ui.tech_tree.technologies[ tech ].border = "gold";
		ui.tech_tree.technologies[ tech ].textBaseline = "top";
		ui.tech_tree.technologies[ tech ].text = tech;
		ui.tech_tree.technologies[ tech ].text_pos = ui.tech_tree.technologies[ tech ].top;
		}
	}

ui.tech_tree.technologies.highest_level_tech = function() {
	var highest = 0;
	for ( var tech in game.technologies ) {
		if ( game.technologies[ tech ].level >= highest )
			highest = game.technologies[ tech ].level;
		}
	return highest;
	}