var util = require('util');
var fs = require('fs');
var path = require('path');
var mola_import = require('mola3/import');

module.exports = {


    load_req_params:'input',

    route:'/mars/data/:lat/:lon.:format',

    execute:function (req_state, callback) {

        var self = this;

        function _on_input(err, input) {
            console.log('getting map data lat %s, lon %s', input.lat, input.lon);
            var root = self.framework.app_root;

            var resource_path = util.format('%s/resources/mapimages/lat_%s_lon_%s.bin', root, input.lat, input.lon);
            console.log('mars.get trying to read %s', resource_path);
            path.exists(resource_path, function (exists) {
                if (exists) {
                    switch (input.format) {
                        case 'raw':
                            console.log('... returning raw data');
                            var raw = fs.readFileSync(resource_path);
                            req_state.res.write(raw);
                            req_state.res.end();
                            break;

                        case 'json':
                        default:
                            mola_import(resource_path, 129, function (err, grid) {
                                var out = {rows:grid.rows, cols:grid.cols}; // data:grid.data,
                                callback(null, out);
                            });
                    }

                } else {
                    callback(util.inspect('path %s does not exist', resource_path));
                }
            });
        }

        req_state.get_param('input', _on_input, function () {
            callback('cannot get input');
        });


    }

}
/*
function readUInt16(buffer, offset, isBigEndian) {
  var val = 0;
  if (offset < 20){
  		console.log('offset ' + offset + ': ' + buffer[offset]);
  }

	val = buffer[offset] << 8;
  if (offset < 20){
      console.log('buffer[' + offset + '] << 8' + val);
  }
	val |= buffer[offset + 1];

  if (offset < 20){
      console.log('value |= buffer[' + offset + '] = ' + val);
  }
  return val;
}

function readInt16(buffer, offset) {
  var neg;
  var val;

  val = readUInt16(buffer, offset);
  if (offset < 20){
  		console.log('readUInt16[' + offset + '] = ' + val);
  }
  neg = val & 0x8000;
  
  if (!neg) { 
   if (offset < 20){
  		console.log('readInt16 RETURNING ' + val);
  }
    return val;
  }

  var nvalue = (0xffff - val + 1) * -1;
  
     if (offset < 20){
  		console.log('readInt16 RETURNING NEGATED ' + nvalue);
  }
  
  return nvalue;
}
    */