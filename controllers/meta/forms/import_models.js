
module.exports = {
    
    configs: {
        context: 'models',
        action: '/meta/0/import_models_list',
        method: 'post'
    },
    
    fields: [
        {name: "models[model]", label: "Models", type: "select", options: []},
        {name: "models[filter]", label: "Filter", type: "radio", options: [{value:'choose', label: 'Choose Items'},
                                                                           {value: 'all', label: 'Import all saved Items'}],
          value: 'choose'
        },
        {name: "models[only_new]", label: "Only New", type: "checkbox",
           options: [{value:'only_new', label: 'Remove all current records from this collection'}]}
    ]
    
}