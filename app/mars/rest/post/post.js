var util = require('util');

module.exports = {

    route: '/mars/data/:lat/:lon/:scale',

    execute: function(req_state, callback){
//        console.log('recieved req: %s', util.inspect(req_state.req));
        var c = 0;

        console.log('headers: ', util.inspect(req_state.req.headers));
        req_state.req.on('data', function(buffer){
            var offset = 0;

            while (offset < buffer.length){
                var n = buffer.readInt16BE(offset);
                if (offset < 8){
                    console.log('reading buffer: %s: %s', c, n);
                }
                offset += 2;
                ++c;
            }
        });

        req_state.req.on('end', function(){
            console.log('TOTAL: %s', c);
            callback();
        });
    }


}