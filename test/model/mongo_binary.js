var slice2Darray = require('mola2/data/data2Dslice');
var pack2Darray = require('mola2/data/pack2Darray')
var neobuffer = require('neobuffer');
var util = require('util');
var fs = require('fs');
var Test_Suite = require('unit/Test/Suite');
var unpack2Dfile = require('mola2/data/unpack2Dfile');
var unpack2Dbuffer = require('mola2/data/unpack2Dbuffer');
var mm = require(MVC_MODELS);
var mon = require('mongodb');
var BSON = mon.BSONPure;
var Binary = BSON.Binary;
function see(n) {
    return util.inspect(n);
}

module.exports.run = function() {
    var test_suite = {
        name: "Data",
        before_all: function() {

            this.options.data = [];

            for (var i = 50; i < 60; ++i) {
                this.options.data.push(i * i);
                this.options.data.push(i * i * -1);
            }
        },

        tests: {

        },

        tests_with_callback: {

            buffer_io: function(n, cb) {
                var self = this;

                var buffer = neobuffer.Buffer(this.options.data.length * 2, 'binary');
                this.options.data.forEach(function(value, i) {
                    buffer.writeInt32(value, 2 * i, 'big');
                });

                var record = {
                    _id: 'test_buffer',
                    data: new Binary(buffer.buffer, 'utf8')
                };

                if (!this.options.test_model) {
                    throw new Error('no test model?');
                }
                try {

                    function _after_put(err, result) {
                        console.log(__filename, 'record put', see(result), err);
                        if (err) {
                            return console.log('error in putting ', see(record), see(err));
                        }
                        try {
                            self.options.test_model.get(result._id, _after_get);
                        } catch(ee) {
                            console.log(__filename, 'error getting record: ', see(ee));
                        }
                    }

                    function _after_get(err, new_record) {
                        console.log('record retrieved: ', see(new_record), see(err));
                        try {
                            var out_buffer = neobuffer.Buffer(new_record.data.buffer.toString() );
                            var out_data = [];
                            for (var i = 0; i <= out_buffer.length - 2; i += 2) {
                                out_data.push(out_buffer.readInt32(i, 'big'));
                            }
                            self.alike(self.options.data, out_data, 'compare pre-mongo and post-mongo data');
                            console.log('raw data tested good!');
                        } catch(eee) {
                            console.log(__filename, 'error putting record: ', see(eee));
                        }
                    }

                    self.options.test_model.put(record, _after_put);
                } catch (e) {
                    console.log(__filename, 'error putting record: ', see(e));
                }


            }
        }
    }
    var suite = new Test_Suite(test_suite, {debug: 0, before_all_with_callback: function(cb) {
        // console.log('bawc');
        var self = this;
        mm.model('tests', function(err, test_model) {
           // console.log('test model: ', see(test_model));
            self.options.test_model = test_model;
            cb();
        })
    }});
    suite.run();
}