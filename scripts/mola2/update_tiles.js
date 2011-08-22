var mm = require(MVC_MODELS);
var Pipe = require('util/pipe');
var gate = new Gate();
/**
 * a script to update all
 * the tiles of all the images of a map
 */
module.exports.run = function() {
    var id = '4e454599f404e8d51c000001'; // current map

    console.log('Map ID: ', id);

    mm.model('mapimage', function(err, mi_model) {

        mm.model('mapimage_row', function(err, mir_model) {
            var row_list = [];

            function _proc_images(){

            mi_model.for_map(id, function(err, images) {

                images.forEach(function(image) {
                    if (!image.hasOwnProperty('lrp')) {
                        console.log(image._id, '--');
                    } else {
                        console.log(image._id, ':', image.lrp);
                    }
                });

                function callback() {
                    console.log('... ===== DONE WITH ALL IMAGES ======= ');
                }

                function _update_tiles(image, static, act_done_callback, pipe_done_callback) {
                    if (image) {
                        if (image.hasOwnProperty('lrp')) {
                            var lrp = image.lrp;
                            row_list.forEach(function(row) {
                                if (row._id.image.toString() == image._id.toString) {
                                    if (row._id.row > image.lrp) {
                                        row.lrp = row._id.row;
                                    }
                                }
                            });

                            if (image.lrp < 44) {

                                console.log('continuing from', lrp);
                                mi_model.update_tiles(image, 128, lrp, act_done_callback);
                            } else {
                                console.log('done - not processing');
                                // data has been written
                                act_done_callback();
                            }
                        } else {
                            console.log('starting from the beginning');
                            mi_model.update_tiles(image, 128, 0, act_done_callback);
                        }
                    } else {
                        pipe_done_callback();
                    }

                }

                var pipe = new Pipe(callback, _update_tiles, 2000, images, {});

                pipe.start();

            });
            }

            var gate = new Gate(_proc_images);
            
            mir_model.find({}, {heights: 0}).toArray(
                function(err, rows) {
                    rows.forEach(function(row) {
                        gate.task_start();
                        mi_model.get(row._id.image, function(err, image) {
                            gate.task_done();
                            if (image.lrp < row._id.row) {
                                image.lrp = row._id.row;
                                mi_model.put(image);
                                row_list.push(row, gate.task_done_callback(true));
                            }

                        });
                    });
                    gate.start();
                }

            )

        });
    });
}