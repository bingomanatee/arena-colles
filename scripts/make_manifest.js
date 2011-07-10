var mm = require(MVC_MODELS);
var fs = require('fs');
var http = require('http');
var fs_utils = require('util/fs');

module.exports.run = function() {
    var args = process.argv.slice(3);
    var path = args[0];
    if (!/^\//.test(path)) {
        path = MVC_ROOT + '/' + path;
    }
    console.log('directory: ', path);

    var contents = fs.readdirSync(path);

    var roots = _.compact(_.uniq(_.map(contents, function(v) {
        if (/\.img/.test(v)) {
            return v.replace(/\.img$/, '');
        } else {
            return '';
        }
    })));

    console.log(contents, roots);
    var manifest = {
        manifest: []
    };
    roots.forEach(function(root) {
        var out = {
            root: root,
            image_file: path + '/' + root + '.img',
            notes: {}
        };
        var note = fs.readFileSync(path + '/' + root + '.lbl');
        var re = /(.*)=(.*)/gi;
        var result;
        while ((result = re.exec(note)) != null) {
            console.log(JSON.stringify(result, null, 4));
            var key = __.trim(result[1]).toLowerCase();
            var result = __.trim(__.trim(result[2].replace('<DEGREE>', '')).replace('\"', '').replace('"', ''));
            console.log(key, ' --> ', result);
            out.notes[key] = result;
        }
        manifest.manifest.push(out);
    });
    
    fs.writeFileSync(path + '/manifest.json', JSON.stringify(manifest, 0, 2));
}