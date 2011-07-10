var fs = require('fs');
var bin = require('util/binary');
var oninc = require('util/oninc');
var pm = require('path');
var am = require('util/array');

module.exports = function(sector, x, y, w, h, callback){
    var file_path = this.data_path(sector);
    
    if (!pm.existsSync(file_path)){
        throw new Error ('cannot open ' + file_path);
    }
    x = parseInt(x);
    y = parseInt(y);
    w = parseInt(w);
    h = parseInt(h);
    
    var target_size =  (w * h/2);
    
    // note - width is in BYTES - half that number of ints produced. 
    
    var file_stat = fs.lstatSync(file_path);
    
    console.log(file_stat);
    
    if ((x + w) > sector.bytes){
        console.log('requested data past col max: ', x + w, ': byte count = ', sector.bytes);
        throw new Error('range exception');
    }
    if ((y + h) > sector.rows){
        console.log('requested data past row max: ', y + h, ': row count = ', sector.rows);
        throw new Error('range exception');
    }
    
    console.log('making region for sector', sector);
    console.log('x: ', x, ', y: ', y, ', w: ', w, ', h: ', h);
    var out = [];
    
    var start_y_head = y * sector.bytes; // the size of the rows before the start of the data.
    // note - each data row still has to be offset by x as well. 
    var y_off = 0;
    
    function _read_next_row(){
        var row_heights = [];
        var start = start_y_head + (y_off * sector.bytes) + x;
        var end = start + w - 1;
        
        var options = {
            flags: 'r', 
            start: start,
            end: end
        };
        oninc(y_off, 100, function(){
            console.log('opening stream on ', file_path, 'with options ', options);
        });
        
        var stream = fs.createReadStream(file_path, options);
        
        stream.on('err', function(err){
            console.log(__filename, ' ========================= read error on ', file_path, ': ', err);
            throw err;
        });
        
        stream.on('data', function(data){
            var ints = bin.int_array(data);
            row_heights = row_heights.concat(ints);
            //console.log(' ... ', out.length);
        });
        
        stream.on('end', function(){
            out.push(row_heights);
            ++y_off;
            if (y_off < h){
                _e = function(){ console.log('read row ', y_off)};
          //      console.log('out length: ', out.length);
                oninc(y_off, 100, _e);
                _read_next_row(start_y_head, y_off, sector.bytes, x);
            } else {
                console.log('%%%%%%%%%% FINAL TALLY %%%%%%%%%%%%%%');
                console.log('ROWS: ', out.length, '; expcted: ', h);
                console.log('COLUMNS 0: ', out[0].length, '; expected: ', w/2);
                for (var i = 1; i < out.length; ++i ){
                    if (out[i].length != w/2){
                        console.log('COLUMNS ', i, ': ', out[i].length, '; expected: ', w/2);
                        out[i] = out[i - 1];
                    }
                }
                console.log('COLUMNS end: ', out[out.length -1].length, '; expected: ', w/2);
                out = am.flatten_2d_array(out)[0];
                console.log('TOTAL HEIGHTS: ', out.length, '; expected: ', w * h /2);
                
                console.log('******** READ ALL OF REGION FOR SECTOR ', sector, '; out count = ', out.length, ' of ', target_size);
                if (out.length == target_size){
                    callback(null, out);
                } else {
                    callback(new Error('insufficient data'));
                }
            }
        })
        
    }
    
    _read_next_row();
    
}