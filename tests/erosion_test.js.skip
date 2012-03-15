var util = require('util');
var path = require('path');
var fs = require('fs');
var erosion = require('./../node_modules/mola3/erosion');
var loader;
var framework;

var terrain_heights;
var terrain1;
var erosion1;

var terrain2_heights;
var terrain2;
var erosion2;

module.exports = {

    setup:function (test) {

        var _erosion_def = {
            flow_friction:0.25,
            sim_time:1.0,
            gravity:1.0,
            _rain_amount:function (cell) {
                return 0.5;
            }};

        terrain_heights = [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [2, 2, 2, 2],
            [3, 3, 3, 3]
        ];

        terrain1 = new erosion.Terrain(terrain_heights, 4, 4, 5);

        erosion1 = new erosion.Erosion(terrain1, _erosion_def);
        erosion1.init();

        terrain2_heights = [
            [1, 1, 1, 1, 1],
            [1, 2, 2, 2, 1],
            [1, 2, 3, 2, 1],
            [1, 2, 2, 2, 1],
            [1, 1, 1, 1, 1]
        ];

        terrain2 = new erosion.Terrain(terrain2_heights, 5, 5, 10);
        erosion2 = new erosion.Erosion(terrain2, _erosion_def);
        erosion2.init();
        test.done();
    },

    terrain_coords:function (test) {

        var cell_1_1 = terrain1.get(1, 1);

        test.equals(cell_1_1.height, 1, 'terrain 1 1 height');
        test.equals(cell_1_1.neighbors.t.height, 0, 'terrain 1 1 top height');
        test.equals(cell_1_1.neighbors.b.height, 2, 'terrain 1 1 bottom height');
        test.equals(cell_1_1.neighbors.r.height, 1, 'terrain 1 1 right height');
        test.equals(cell_1_1.neighbors.l.height, 1, 'terrain 1 1 left height');

        var cell_1_1_2 = terrain2.get(1, 2);

        test.equals(cell_1_1_2.height, 2, 'terrain 2 1 1 height');
        test.equals(cell_1_1_2.neighbors.t.height, 1, 'terrain 2 1 1 t height');
        test.equals(cell_1_1_2.neighbors.b.height, 3, 'terrain 2 1 1 b height');
        test.equals(cell_1_1_2.neighbors.r.height, 2, 'terrain 2 1 1 l height');
        test.equals(cell_1_1_2.neighbors.l.height, 2, 'terrain 2 1 1 r height');

        test.done();
    },

    flow:function (test) {
        console.log(' TERRAIN BEFORE FLUX');
        console.log(erosion1.terrain.echo());

        var cell_1_1 = terrain1.get(1, 1);

        test.equals(erosion1.total_water(), 0, 'starts with no water');
        test.equals(cell_1_1.water_height(), 1, 'water 1 1 height before rainfall');

        erosion1.rainfall();

        test.equals(erosion1.total_water(), 0.5 * erosion1.terrain.rows * erosion1.terrain.cols, ' total water after rainfall');
        test.equals(cell_1_1.water, 0.5, 'water 1 1 height after rainfall');
        test.equals(cell_1_1.water_height(), 1.5, 'water 1 1 height after rainfall');

        erosion1.flux();

        test.equals(cell_1_1.flux.t, 0.125, 'water 1 1 flux t after rainfall');
        test.equals(cell_1_1.flux.b, 0, 'water 1 1 flux b after rainfall');
        test.deepEqual(cell_1_1.flow_vector, {x:0, y:-0.25, d: 0.25}, 'water 1 1 flow_vector');
        test.equals(cell_1_1.water, 0.5, 'water 1 1 height after flux');

        console.log('terrain 2 data');
        console.log(terrain2.echo());

        console.log(' TERRAIN AFTER FLUX');
        console.log(erosion1.terrain.echo());
        test.done();
    }

}