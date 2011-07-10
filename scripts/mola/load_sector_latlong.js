var mm = require(MVC_MODELS);
var fs = require('fs');
var http = require('http');
var fs_utils = require('util/fs');
var path_module = require('path');

module.exports.run = function() {
    var note_path_root = __dirname + '/sector_files/';

    mm.model('map_sectors', function(err, ms_model) {
        var manifest = fs.readFileSync(__dirname + '/manifest.json');
        manifest = JSON.parse(manifest);
        var map_id = ms_model._as_oid(manifest.map);
        
        ms_model.find({
            map: map_id
        }).toArray(function(err, sectors) {

            sectors.forEach(function(sector) {
                if (sector.hasOwnProperty('data_files') && sector.data_files.hasOwnProperty('note')) {
                    var note = sector.data_files.note;
                    var note_path = note_path_root + sector._id + '/' + note;
                    if (path_module.existsSync(note_path)) {
                        var note_data = fs.readFileSync(note_path);
                        var m = /MAXIMUM_LATITUDE.*= (.*) <DEGREE>/.exec(note_data);
                        if (m) {
                            sector.max_lat = parseFloat(m[1]);
                        }

                        var m = /MINIMUM_LATITUDE.*= (.*) <DEGREE>/.exec(note_data);
                        if (m) {
                            sector.min_lat = parseFloat(m[1]);
                        }

                        var m = /WESTERNMOST_LONGITUDE.*= (.*) <DEGREE>/.exec(note_data);
                        if (m) {
                            sector.west_long = parseFloat(m[1]);
                        }


                        var m = /EASTERNMOST_LONGITUDE.*= (.*) <DEGREE>/.exec(note_data);
                        if (m) {
                            sector.east_long = parseFloat(m[1]);
                        }
                        
                        var m = /FILE_RECORDS.*= ([\d]*)/.exec(note_data);
                        if (m){
                            sector.rows = parseInt(m[1]);
                        }
                        
                        var m = /RECORD_BYTES.*= ([\d]*)/.exec(note_data);
                        if (m){
                            sector.cols = parseInt(m[1]/2);
                            sector.bytes = parseInt(m[1]);
                        }

                        ms_model.put(sector, function(err, new_sector) {
                            console.log('updated ', new_sector);
                        })
                    }
                }
            });

        }) // end find_and_delete
    }); // and model
}

/*
  MAXIMUM_LATITUDE             = -44.0 <DEGREE>
 MINIMUM_LATITUDE             = -88.0 <DEGREE>
 WESTERNMOST_LONGITUDE        = 90.0 <DEGREE>
 EASTERNMOST_LONGITUDE        = 180.0 <DEGREE>
*/