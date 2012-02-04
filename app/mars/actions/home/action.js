
module.exports = {

    params: {
        render: {
            header: "Arena Colles: Mars"
        }
    },

    route: '/mars',

    execute: function(req_state, callback){
        callback(null, {sid: req_state.get_session('id', 'no_sid')});
    }
}