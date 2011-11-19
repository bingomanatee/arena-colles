var slice2Darray   = require('mola2/data/data2Dslice');
var pack2Darray    = require('mola2/data/pack2Darray')
var neobuffer      = require('neobuffer');
var util           = require('util');
var fs             = require('fs');
var Test_Suite     = require('unit/Test/Suite');
var unpack2Dfile   = require('mola2/data/unpack2Dfile');
var unpack2Dbuffer = require('mola2/data/unpack2Dbuffer');

function see(n) {
    return util.inspect(n);
}
var suite = {
    name: "Data",
    before_all: function() {

        this.options.data = [
            [1,2,3],
            [4,5,6],
            [2,4,6]
        ];
        this.options.data_ul = [
            [1,2],
            [4,5]
        ];

        this.options.data_lr = [
            [5, 6],
            [4, 6]
        ];

        var packed_data = neobuffer.Buffer(9 * 2);
        packed_data.writeInt16(1, 0, 'big');
        packed_data.writeInt16(2, 2, 'big');
        packed_data.writeInt16(3, 4, 'big');
        packed_data.writeInt16(4, 6, 'big');
        packed_data.writeInt16(5, 8, 'big');
        packed_data.writeInt16(6, 10, 'big');
        packed_data.writeInt16(2, 12, 'big');
        packed_data.writeInt16(4, 14, 'big');
        packed_data.writeInt16(6, 16, 'big');

        this.options.packed_data_string = packed_data.toString();

        this.options.data_file_path = __dirname + '/data_file.img';

        this.options.big_data = [
            [1000,   10000,  100000],
            [-1000, -10000, -100000],
            [1234,   12345,  123456],
            [-1234, -12345, -123456]
        ];
    },

    tests: {
        array_sample: function(n) {
            var slice = slice2Darray(this.options.data, 0, 0, 2, 2);
            this.like(
                slice.data,
                this.options.data_ul,
                'Slice the upper left corner of data 2 x 2');
        },

        array_overslice: function(n){

            var slice = slice2Darray(this.options.data, 1, 1, 3, 3);
            this.like(
                slice.data,
                this.options.data_lr,
                'Slice the upper left corner of data 2 x 2');

            this.is(
                slice.rows,
                2,
                'slice rows overslice count'
            );

            this.is(
                slice.cols,
                2,
                'slice rows overslice count'
            );
        },

        pack_2d_array: function(n){
            var packed = pack2Darray(this.options.data).toString();
          //  console.log('packed data: ', util.inspect(packed), packed.length);
            this.is(packed, this.options.packed_data_string)
        },

        pack_and_unpack_big_data: function(n){
            var packed = pack2Darray(this.options.big_data);
            var unpacked = unpack2Dbuffer(packed);
            this.is(this.options.big_data, unpacked);
        }

    },

    tests_with_callback: {

        write_2d_data: function(n, cb){
            var self = this;
            fs.writeFileSync(this.options.data_file_path, pack2Darray(this.options.data).toString());
            unpack2Dfile(this.options.data_file_path, 3, function(err, data){
                self.like(data, self.options.data);
                cb();
            });
        }
    }
}

module.exports = new Test_Suite(suite, {debug: 0});