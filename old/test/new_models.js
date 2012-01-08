var mm = require(MVC_MODELS);

module.exports.run = function() {


    function _on_model(err, t_model) {
        t_model.drop(function() {

    function _on_save(err, result) {
        console.log(__filename, ': saved - ', result);
        var id = result._id;
        
        t_model.get(id, function(err, record){
            console.log('get: gotten ', record , " from id ", id);
        });
    }
    
            [{
                name: "phil",
                age: 23,
                gender: 'm',
                tags: ['comedy', 'action', 'drama']
            }, {
                name: "bob",
                age: 23,
                gender: 'm',
                tags: ['sci fi', 'westerns', 'action']
            }, {
                name: "sue",
                age: 33,
                gender: 'f',
                tags: ['romance', 'drama', 'comedy']
            }, {
                name: "timmy",
                age: 13,
                gender: 'm',
                tags: ['action', 'animated', 'comedy']
            }].forEach(function(record) {
                t_model.put(record, _on_save);
            });

            t_model.find({
                tags: "comedy"
            }).count(

            function(err, c) {
                console.log(c, ' people like comedy');
            });
            t_model.find({
                tags: {
                    "$all": ["comedy", "action"]
                }
            }).count(

            function(err, c) {
                console.log(c, " people like comedy and action");
            });
        });
    };

    mm.gen_model('test_model', _on_model, {}, true);


}