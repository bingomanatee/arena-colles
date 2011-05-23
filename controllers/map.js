/**
 *  CONTROLLER MAP
 * Map data for Arena Colles
 */
module.exports = {

    index: require('mvc/actions/index'),

    show: require('mvc/actions/show'),

    add: require('mvc/actions/add'),

    edit: require('mvc/actions/edit'),

    delete: require('mvc/actions/delete'),

    create: require('mvc/actions/create'),

    update: require('mvc/actions/update'),

    destroy: require('mvc/actions/destroy'),


    forms: {
  "default": {
    "fields": []
  }
}
    
};