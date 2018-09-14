// CouchDB server url
var main_url = "";

// Names of collections / databases
var collections = ["civ", "civ-units", "civ-nations"];

class Collection {
    constructor(map) {
        this.map = map;
    }
    get(name) {
        this.map[name];
    }
}

// Connection abstraction object
var db = {};
// Options for replication
var options = { live: true };
// Create all of the PouchDB databases and link them
// to the CouchDB server
for (name in collections)
{
    // List element is the name of the database
    var name = collections[name];
    // Name of the remote database
    var remoteCouch = main_url + name;
    // Create the PouchDB
    // db[ name ] = new PouchDB(name, {adapter: 'websql'});
    // Replicate from the main database
    // db[ name ].replicate.from(remoteCouch, options);
    // db[ name ].replicate.to(remoteCouch, options);
}

db.getTerrain = function(callback)
{
    game.terrain = {};
    game.terrain.types = cached_terrain;
    game.terrain.array = [];
    for (var i in cached_terrain) {
        game.terrain.array.push(cached_terrain[i]);
    }
    callback();
}

db.getUnits_checkcallBack = function()
{
    db.get_all_units++;
    if (db.get_all_units >= db.get_units_needed)
    {
        return true;
    }
    else
    {
        return false;
    }
}

db.getUnits = function(callback)
{
    window.all_units = {};
    game.units = {};
    for (var i in cached_units) {
        var unit = cached_units[i];
        window.all_units[unit._id] = unit;
        game.units[unit._id] = unit;
        delete unit._rev;
        unit.image = new Image();
        if (typeof unit.src !== "undefined") {
             unit.image.src = unit.src;
        }
        if (typeof callback === "function") {
             callback();
        }
    }
}

db.getNations_checkcallBack = function()
{
    db.get_all_nations++;
    if (db.get_all_nations >= db.get_nations_needed)
    {
        return true;
    }
    else
    {
        return false;
    }
}

db.getNations = function(callback)
{
    console.log(cached_nations)
    game.nations = {};
    for (var i in cached_nations) {
        var nation = cached_nations[i];
        delete nation._rev;
        game.nations[nation._id] = nation;
    }
    if (typeof callback === "function") {
        callback();
    }
}
