var _ = require('underscore');

module.exports = function (terrain, callback) {
     var max = 10;
     var min_rain = 1;

     var i = 0;

     function rain_cycle() {
         var d = new Date();
         var max_depth = 30;
         var rain_q = (2 * i) + 10;

         function _roll(cell, amount, depth) {

             if (!cell.hasOwnProperty('rain')) {
                 cell.rain = 0;
                 cell.rains = 0;
             }
             if ((amount < min_rain) || (depth > max_depth)) {
                 cell.rain += amount;
                 return;
             }

             var drop_slopes = 0;
             var drops = [];
             cell.each_neighbor(function (c, n) {
                 if (Math.random() < 0.3) return;
                 if (n.height < c.height) {
                     var drop = c.height - n.height;
                     drop_slopes += drop;
                     drops.push({cell:n, drop:drop});
                 }
             });

             if (drops.length) {
                 drops = _.sortBy(drops, function (dd) {
                     return dd.drop;
                 });
                 drops = drops.slice(0, 2);

                 drop_slopes = 0;

                 drops.forEach(function (drop) {
                     drop_slopes += drop.drop;
                 })

                 drops.forEach(function (drop) {
                     _roll(drop.cell, drop.drop / drop_slopes, depth + 1);
                 });

             } else {
                 cell.rain += amount;
             }

         }

         function _mtn_ness(cell) {
             _roll(cell, rain_q, 0);
         }

         function _adjust(cell) {
             cell.height += cell.rain - rain_q;
             cell.rains = Math.max(cell.rains, cell.rain);
             cell.rain = 0;
         }

         terrain.each_cell(_mtn_ness);

         terrain.each_cell(_adjust);

         ++i;
         if (i > max) {
             return callback();
         } else {
             process.nextTick(rain_cycle);
         }
         console.log('mtn: cycle %s, time: %s', i, ((new Date().getTime() - d.getTime()) / 100).toFixed(3));
     }

     process.nextTick(rain_cycle);
 }