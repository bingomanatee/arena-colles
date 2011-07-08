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
    var path = _path(sector);
    var row_chunk_size = sector.rows / 16;

    if (!path_module.existsSync(path)) {
        throw new Exception('missing data file ', path);
    }

    console.log(__filename, ': ========== PARSING ROWS OF ========== ', sector);
    var self = this;
    mm.model('map_sector_rows', function(err, sector_rows_model) {
        var sector_row_count = 0;

        function _save_row_data(sector, ints, row_index, callback) {
            var sr_data = {
                data: ints,
                sector: sector._id,
                row: row_index
            };

            sector_rows_model.put(sr_data, callback);
        }

        sector_rows_model.delete({
            sector: sector._id
        }, function() { // after delete
            var file_position = 0;
            var row_index = 1;

            fs.open(path, 'r', function(err, fd) {
                var buffer = new Buffer(sector.cols * row_chunk_size * 2);

                function _buffer_bytes(buffer_row) {
                    var start = buffer_row * 2 * sector.cols;
                    var end = (1 + buffer_row) * 2 * sector.cols;
                    var bytes = buffer.slice(start, end);
                    return bytes;
                }

                function _read_chunk() {
                    console.log('READING CHUNK ', file_position);

                    function _write_buffer() {
                        file_position += buffer.length;
                        for (var buffer_row = 0; buffer_row < row_chunk_size; ++buffer_row) {
                            var bytes = _buffer_bytes(buffer_row);
                            var ints = _read_bin_line(bytes);

                            if (!(buffer_row % 100)) {
                                console.log('saving buffer row ', buffer_row, '; row index ', row_index);
                            }

                            _save_row_data(sector, ints, row_index, gate.task_done_callback(true));
                            ++row_index;
                        }
                        gate.start();
                    }

                    function _next_chunk() {
                        if (file_position < sector.rows * sector.cols * 2) {
                            _read_chunk();
                        } else {
                            console.log('ALL CHUNKS READ.');db.ma
                            sector.parsed = true;
                            self.put(sector, function(err, result) {
                                console.log('parsed ', result);
                            });
                            sector_callback();
                        }
                    }

                    var gate = new Gate(_next_chunk);
                    fs.read(fd, buffer, 0, buffer.length, file_position, _write_buffer);
                    file_position += buffer.length;
                } // end _read_chunk;
                _read_chunk();
            }); // end fs.open
        }); // end delete
    }) // end mm.model
}

/**
 *
 *
 res.writeHead(200,{'Content-Type':'text/plain'})
 var buffer=new Buffer(100)
 var fs=require('fs')
 fs.open('.'+req.url,'r',function(err,fd){
 fs.fstat(fd,function(err, stats){
 var i=0
 var s=stats.size
 console.log('.'+req.url+' '+s)
 for(i=0;i<s;console.log(i)){
 i=i+buffer.length
 fs.read(fd,buffer,0,buffer.length,i,function(e,l,b){
 res.write(b.toString('utf8',0,l))
 console.log(b.toString('utf8',0,l))
 })
 }
 res.end()
 fs.close(fd)
 })
 })
 */

function _read_bin_line(data) {

    var l = data.length;
    var out = [];

    for (var offset = 0; offset < l; offset += 2) {
        var i = bin.int16(offset, 'big', data);
        out.push(i);
    }
    return out;
}