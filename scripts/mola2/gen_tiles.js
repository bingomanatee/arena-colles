var mm = require(MVC_MODELS);

module.exports.run = function() {
    var id = process.argv[3];

    console.log('Map ID: ', id);

    mm.model('mapimage', function(err, mit_model){
       mit_model.gen_tiles(id, function(){console.log('... ===== DONE ======= '); });
    });
}