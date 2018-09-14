game.canvas = document.getElementById("hexCanvas");
game.canvas.height = window.innerHeight;
game.canvas.width = window.innerWidth;
game.ctx = game.canvas.getContext('2d');
ui.top_bar.buttons.menu.clicked();

$( "html" ).on( "touchstart.game.is_mobile_device", function(e){
	game.is_mobile_device = true;
	});

window.onresize = function(){
	game.canvas.height = window.innerHeight;
	game.canvas.width = window.innerWidth;
	grid = new HT.Grid(-30, -190, window.innerWidth+75, window.innerHeight+190);
	for( var h in grid.Hexes ){
		grid.Hexes[h].draw();
		}
	};

db.getTerrain( function(){
	grid = new HT.Grid(-30, -190, window.innerWidth+75, window.innerHeight+190);
	for( var h in grid.Hexes ){
		grid.Hexes[h].draw();
		}
	});

db.getNations( function(){
	$("#nation").html('');
	for( var nation in game.nations ){
		$("#nation").append('<option value="' + nation + '">'+nation+'</option>');
		}
	});

function hideAll(){
	$('#registerdiv').hide();
	$('#logindiv').hide();
	$('#optionsdiv').hide();
	$('#online_games_div').hide();
	}

$('#toggleRegister').click(function(){
	hideAll();
	$('#registerdiv').show();
	});

$('#toggleLogin').click(function(){
	hideAll();
	$('#logindiv').show();
	});

$('#toggleOptions').click(function(){
	hideAll();
	$('#optionsdiv').show();
	});

$('#toggleOnlineGames').click(function(){
	hideAll();
	$('#online_games_div').show();
	});
