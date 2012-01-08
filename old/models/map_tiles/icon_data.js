var Tileset = require('mola/tileset');
var Mola = require('mola');

module.exports = function(id, callback){
    console.log(__filename, ': ID = ', id);
    
    var self = this;
    
    function _on_get(err, tile){
        console.log(__filename, ': tile - ', tile);
        var ratio = tile.data_file.notes.map_resolution;
        console.log('ratio: ', + ratio);
        ratio = parseInt(ratio.replace(/ .*/, ''));
        
        function _on_loaded(){
            var subset = [];
            console.log(__filename, ': get_rows', tileset.get_rows(), ', data rows: ', tileset._data.length);
            var rr = 0;
            for (var i = 0; i < tileset.get_rows(); i += ratio){
                if (i >= tileset._data.length){
                    break;
                } else {
                    ++rr;
                    var cc = 0;
                    for (var j = 0; j < tileset.get_cols(); j += ratio) {
                      //  console.log('adding ', i, ',', j);
                        subset.push(tileset.ij_height(i, j));
                        ++cc;
                    }
                }
            }
            
            console.log('icon data: ', subset.length, ' heights: ', subset.slice(0, 10).join(', '), 'rr: ', rr, ', cc:' , cc);
            
            var mola = new Mola('', {rows: rr, cols: cc});
            mola.data = subset;
            var canvas = mola.as_canvas();
            
            var stream = canvas.createPNGStream();
            
            callback(null, stream);
        }
        
        var tileset = new Tileset(tile);
        
        tileset.load_data(_on_loaded);
    }
    
    this.get(id, _on_get);
    
}