var slice2Darray = require('mola2/data/data2Dslice');
var pack2Darray = require('mola2/data/pack2Darray')
var neobuffer = require('neobuffer');

var util = require('util');
var fs = require('fs');
var Test_Suite = require('unit/Test/Suite');
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

            this.options.record_one_info = {
                a:1,
                b:2,
                c:3
            };
            this.options.record_one = {
                info: this.options.record_one_info
            };

            this.options.record_id_one = {
                _id: 'test_model_index_id_one',
                info: {
                    a: 2,
                    b: 4,
                    c: 6
                }
            };

            this.options.record_id_one_v_2 = {
                _id: 'test_model_index_id_one',
                info: {
                    a: 4,
                    b: 8,
                    c: 12
                }
            };
        },

        tests: {

        },

        tests_with_callback: {

            put_then_get: function(n, cb) {
                var self = this;

                self.options.test_model.put(self.options.record_one, function(err, result) {
                    self.alike(self.options.record_one_info, result.info, 'info of hash id');
                    self.options.test_model.delete( result._id, cb);
                });

            },

            /**
             * ... and yes, this does have to be a single sequential test.
             * @param n
             * @param cb
             */
            put_with_id: function(n, cb) {
                var self = this;
                // delete any previous data with that ID.
              //  console.log('Put with id');

                function _after_delete(err) {
                  //  console.log('delete ', self.options.record_id_one._id, '(again?)', err);
                    // first put a record with an ID into the DB
                    self.options.test_model.put(self.options.record_id_one, _after_first_put);
                }

                function _after_first_put(err, result) {
                    try {
                      //  console.log('first put done', err, result);
                        // the result should be exactly what we put in
                        self.alike(result, self.options.record_id_one, 'record w/ id');
                      //  console.log('part one passed');

                        // put a different version in, with the same ID
                        self.options.test_model.put(self.options.record_id_one_v_2, _after_second_put);
                    } catch (tce) {
                        console.log('STEP ONE error: ', see(tce));
                        cb(tce);
                    }

                }
                function _after_second_put(err, result2) {

                    // the result should be like the second one
                    self.alike(self.options.record_id_one_v_2, result2, 'result with id, putting a second version');
                  //  console.log('part two passed');
                    // to be sure, re- retrieve it via the ID.
                    self.options.test_model.get('test_model_index_id_one', _after_second_get);
                }

                function _after_second_get(err, result3) {
                    self.alike(self.options.record_id_one_v_2, result3, 'fetching again');
                 //   console.log('part 3 passed.');
                    cb();
                }


                self.options.test_model.delete(self.options.record_id_one._id, _after_delete);

            }


        }
    } // end suite

    var suite = new Test_Suite(test_suite, {debug:3, before_all_with_callback: function(cb) {
        // console.log('bawc');
        var self = this;
        mm.model('tests', function(err, test_model) {
            //  console.log('test model: ', see(test_model));
            self.options.test_model = test_model;
            try {
                self.options.test_model.delete('test_model_id_one',
                    function() {
                        console.log('deleted test_model_id_one');
                        cb()
                    });
            } catch(err) {
                console.log('bad delete');
            }
        });
    }});

    suite.run();

    require('./mongo_binary').run();
}