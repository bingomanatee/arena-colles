mm = require(MVC_MODELS);
var Mola = require('mola');
var scale = require('mola/scale');
var path_module = require('path');
var bin = require('util/binary');
var fs = require('fs');
var Gate = require('util/gate');

function _path(sector) {
    return MVC_ROOT + '/scripts/sector_files/' + sector._id + '/' + sector.data_files.data;
}


module.exports = function(sector, sector_callback) {
    console.log(__filename, ': ========== PARSING ROWS OF ========== ', sector);
    
    var path = _path(sector);

    if (!path_module.existsSync(path)) {
        throw new Exception('missing data file ', path);
    }

    var self = this;
    mm.model('map_sector_rows', function(err, sector_rows_model) {
        var sector_row_count = 0;

        function _save_row_data(sector, ints, sector_row_index, callback) {
            var sr_data = {
                data: ints,
                sector: sector._id,
                row: sector_row_index,
                length: ints.length,
                expected_length: sector.cols
            };

            sector_rows_model.put(sr_data, callback);
        }

        sector_rows_model.delete({
            sector: sector._id
        }, function() { // after delete
            var file_position = 0; // where in the source file to take a read chunk
            var sector_row_index = 0; // the number of rows that have been read
            var row_byte_count = sector.bytes;
            var rows_per_buffer = 8; // why not?
            var buffer_size = rows_per_buffer * row_byte_count; // size read in one swipe
            
            fs.open(path, 'r', function(err, fd) {
                var buffer = new Buffer(buffer_size);

                function _read_chunk() {
                    console.log('READING CHUNK ', file_position);

                    function _write_buffer() {
                        console.log('digesting from ', file_position, '(',
                                    file_position/1024, 'k) to ',
                                    file_position + buffer_size, ' (',
                                    (file_position + buffer_size) / 1024, 'k)'); 
                        file_position += buffer_size;
                        for (var buffer_row = 0; buffer_row < rows_per_buffer; ++buffer_row) {
                            
                            var bytes = _buffer_bytes(buffer, buffer_row, row_byte_count);
                            var ints = _read_bin_line(buffer, bytes);

                            if (!(buffer_row % 100)) {
                                console.log('saving buffer row ', buffer_row, '; sector row ', sector_row_index);
                            }

                            _save_row_data(sector, ints, sector_row_index, gate.task_done_callback(true));
                            ++sector_row_index;
                        }
                        console.log('saving last buffer row ', buffer_row, '; sector row ', sector_row_index);

                        gate.start();
                    }

                    function _next_chunk() {
                        if (file_position < sector.rows * row_byte_count) {
                            setTimeout(_read_chunk, 1000);
                        } else {
                            console.log('ALL CHUNKS READ.');
                            sector.parsed = true;
                            self.put(sector, function(err, result) {
                                console.log('parsed ', result);
                            });
                            sector_callback();
                        }
                    }

                    var gate = new Gate(_next_chunk);
                    console.log('reading fd, buffer, 0, ', buffer_size, ',', file_position, ', _write_buffer');
                    fs.read(fd, buffer, 0, buffer_size, file_position, _write_buffer);
                } // end _read_chunk;
                _read_chunk();
            }); // end fs.open
        }); // end delete
    }) // end mm.model
}

function _buffer_bytes(buffer, buffer_row, row_byte_count) {
    var start = buffer_row * row_byte_count;
    var end = (1 + buffer_row) * row_byte_count;
    var bytes = buffer.slice(start, end);
    return bytes;
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