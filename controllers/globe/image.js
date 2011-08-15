var Globemap = require('mola2/globemap');
var globe_data_path = MVC_ROOT + '/resources/mola_32/megt90n000fb.img';
var globe_manifest = MVC_ROOT + '/resources/mola_32/manifest.json';
var globe_data_path2 = MVC_ROOT + '/resources/mola_16/megt90n000fb.img';
var globe_manifest2 = MVC_ROOT + '/resources/mola_16/manifest.json';
module.exports = function(context) {

    var globemap = new Globemap(globe_manifest2);
    globemap.load(function() {
        console.log('loaded data');
        var canvas = globemap.render();
        context.response.write(canvas.createPNGStream());
        context.response.end();
    });
}