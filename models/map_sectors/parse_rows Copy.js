mm = require(MVC_MODELS);
var Mola = require('mola');
var scale = require('mola/scale');
var path_module = require('path');
var bin = require('util/binary');
var fs = require('fs');

function _path(sector) {
    return MVC_ROOT + '/scripts/sector_files/' + sector._id + '/' + sector.data_files.data;
}


module.exports = function(sector) {
    console.log(__filename, ': ========== PARSING ROWS OF ========== ', sector);
    var self = this;
    mm.model('map_sector_rows', function(err, sector_rows_model) {
        var sector_row_count = 0;
        sector_rows_model.delete({
            sector: sector._id
        }, function() {
            var path = _path(sector);
            if (!path_module.existsSync(path)) {
                throw new Exception('missing data file ', path);
            }

            var ints = [];

            var handle = fs.createReadStream(path, {
                bufferSize: 128 * 1024
            });
            var writing = false;
            
            function _write_rows() {
                writing = true;
                var write_offset = 0;
                while (write_offset + sector.cols <= ints.length) {
                    var row = ints.slice(write_offset, write_offset + sector.cols);
                    var sector_row_data = {
                        sector: sector._id,
                        data: row,
                        row: sector_row_count
                    };
                    ++sector_row_count;
                    write_offset += sector.cols;
                    
                    sector_rows_model.put(sector_row_data, function(err, result) {
                        if (result.length) {
                            result = result[0];
                        }
                       if(!(result.row % 100)){
                        console.log('row ', result.row, ' saved');
                       }
                    });
                }
                ints = ints.slice(write_offset);
                writing = false;
            }

            handle.on('data', function(data) {
                ints = ints.concat(_read_bin_line(data));
                if (!writing) {
                    _write_rows();
                }
            });
            
            handle.on('end', function(){
                
                if (!writing) {
                    _write_rows();
                }
            })

        });

        sector.parsed = true;
        self.put(sector, function(err, result) {
            console.log('parsed ', result._id);
        });
    })
}


function _read_bin_line(data) {

    var l = data.length;
    var out = [];

    for (var offset = 0; offset < l; offset += 2) {
        var i = bin.int16(offset, 'big', data);
        out.push(i);
    }
    return out;
}