
/**
 * Genre tags   
 */

module.exports = {

    collection: 'genres',

    mixins: {

        _as_oid: function(id) {
            return id;
        }
    }
}