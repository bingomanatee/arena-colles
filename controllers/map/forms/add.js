

module.exports = {
    configs: {
        action: '/maps/0/',
        method: 'post',
        properties: {'enctype' :"multipart/form-data"}
    },
    
    fields: [
        {name: 'map[manifest]', label:'manifest', type: 'file'},
        {name: 'map[name]', label: 'Planet'}
    ]
}