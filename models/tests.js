var models_module = require(MVC_MODELS);

module.exports = {
    collection: 'tests',
    string_id: true,
    mixins: {
        string_id: true,
        foo: function() {
            console.log('bar')
        }
    }
}