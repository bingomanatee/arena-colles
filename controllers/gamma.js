/**
 *  CONTROLLER GAMMA
 * adsfasdf
 */
module.exports = {

    index: require('mvc/actions/index'),

    show: require('mvc/actions/show'),

    add: require('mvc/actions/add'),

    delete: require('mvc/actions/delete'),

    create: require('mvc/actions/create'),

    destroy: require('mvc/actions/destroy'),

    forms: {
  "default": {
    "fields": [
      {
        "name": "aaa",
        "type": "text",
        "options": "",
        "value": ""
      },
      {
        "name": "bbb",
        "type": "textarea",
        "options": "",
        "value": ""
      },
      {
        "name": "ccc",
        "type": "checkbox",
        "options": [
          "aaa",
          "bbb",
          "ccc"
        ],
        "value": "bbb"
      }
    ]
  }
}
};