game.technologies = {
	Tools: {
		level: 1,
		units: [ "Worker", "Clubman" ],
		},
	Archery: {
		level: 3,
		units: [ "Archer" ],
		},
	Farming: {
		level: 3
		},
	Pottery: {
		level: 3
		},
	Breeding: {
		level: 3
		},
	"Horseback Riding": {
		level: 5,
		units: [ "Horseback Rider" ],
		},
	"Leather Working": {
		level: 5,
		},
	Irrigation: {
		level: 5,
		},
	Community: {
		level: 5,
		units: [ "Settler" ],
		},
	};

for ( var tech in game.technologies ) {
	game.technologies[ tech ].science = game.technologies[ tech ].level * 100;
	}