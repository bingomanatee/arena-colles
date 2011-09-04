module.exports = function(context) {
    var req_params = context.req_params(true);
    this.model.get(req_params.id, function(err, map) {

        var params = context.params({map: map, js_paths: []});
        [
            { prefix: '/js',
                libs: ['underscore']
            },
            { prefix: '/js/3',
                libs: ['Detector', 'Three', 'RequestAnimationFrame', 'Stats']
            },
            {prefix: '/js/map/MARS_ANI',
                libs: ['index','util', 'animate', 'config2', 'Map_Tile', 'init']
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