var mm = require(MVC_MODELS);
var fs = require('fs');
var http = require('http');
var fs_utils = require('util/fs');

module.exports.run = function(){
    mm.model('map_sectors', function(err, ms_model){
    var manifest = fs.readFileSync(__dirname + '/manifest.json');
    manifest = JSON.parse(manifest);
        var map_id = ms_model._as_oid(manifest.map);
        var web_root = manifest.web_root;
        ms_model.find_and_delete({map: map_id}, function(){
            
            manifest.manifest.forEach(function(section_files){
                section = {
                    map: map_id,
                    zoom: 1,
                    parsed: false,
                    data_files: section_files,
                   web_root: web_root
                };
                console.log('writing ', section);
                ms_model.put(section, function(err, result){
        //            console.log('sector saved: ', result);
                    var sector = result[0];
                    _import_sector_data(sector, gate.task_done_callback(true));
                    });
            })
            
        }) // end find_and_delete
    }); // and model
}

function _import_sector_data(sector){
    var root = __dirname + '/sector_files/' + sector._id;
    fs_utils.ensure_dir(root);
    
    function _save_data_file(response){
        console.log('SAVING DATA FILE: ', response);
        response.setEncoding('binary');
        var p = root + '/' + sector.data_files.data;
        console.log('OPENING NOTE FILE ', p);
        var stream = fs.createWriteStream(p);
        
        
        response.on('data', function(data){
            console.log('writing data to ', root);
            stream.write(data);
        });
        
        response.on('err', function(err){
            console.log('error saving data file for ', root, err);
            stream.end();
        })
        
        response.on('end', function(){
            stream.end();
        })
    }
    
    function _save_note_file(response){
        console.log('SAVING NOTE FILE: ', response);
        response.setEncoding('utf8');
        var p = root + '/' + sector.data_files.note;
        console.log('OPENING NOTE FILE ', p);
        var stream = fs.createWriteStream(p);
        
       response.on('data', function(data){
            console.log('writing note to ', root);
            stream.write(data);
        });
        
        response.on('err', function(err){
            console.log('error saving node file for ', root, err);
            stream.end();
        })
        
        response.on('end', function(){
            stream.end();
        })
    }
    

    function _options(url){
        var match = /http:\/\/([^\/]*)(.*)/.exec(url);
        var root = match[1];
        var path = match[2];
        return {
            host: root,
            port: 80,
            path: path,
            method: 'GET'
        };
    }
    
    var df_options = _options(sector.web_root + sector.data_files.data);
    var nf_options = _options(sector.web_root + sector.data_files.note);
    console.log('df_options: ', df_options);
    console.log('nf_options: ', nf_options);
    http.get(df_options, _save_data_file);
    http.get(nf_options, _save_note_file);
    
}