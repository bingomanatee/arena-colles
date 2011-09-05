module.exports = function(context) {
    var req_params = context.req_params(true);
    this.model.get(req_params.id, function(err, map) {

        var params = context.params({map: map, js_paths: []});
        [
            //fonts/helvetiker_regular.typeface.js"
            { prefix: '/js',
                libs: ['underscore']
            },
            { prefix: '/js/3',
                libs: ['Detector', 'Three', 'RequestAnimationFrame', 'Stats']
            },
            {prefix: '/js/map/MARS_ANI',
                libs: ['index','util', 'Text', 'ani_queue', 'animate', 'config2', 'Planet_Tiler', 'Map_Tile', 'init']
            },
            {prefix: '/fonts',
                libs: ['helvetiker_regular.typeface','helvetiker_bold.typeface']
            }
        ].forEach(function(libset) {
           // console.log(libset);
            libset.libs.forEach(function(lib) {
                // console.log(lib);
                params.js_paths.push(libset.prefix + '/' + lib + '.js');
            });
        });

        console.log('javascript paths: ', params.js_paths.join(','));

        context.render('map/globe.html', params);
    });
}