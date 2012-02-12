var util = require('util');

module.exports = {

    route: '/mars/data/:lat/:lon/:scale',


    execute: function(req_state, callback){
        console.log('recieved req: %s', util.inspect(req_state.req));
        callback('not ready to write yet');
    }


}