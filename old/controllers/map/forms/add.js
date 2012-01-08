

module.exports = {
    configs: {
        action: '/maps/0/',
        method: 'post',
        properties: {'enctype' :"multipart/form-data"}
    },
    
    fields: [
        {name: 'image', label:'Image', type: 'file'},
        {name: 'map[name]', label: 'Planet'},
        {name: 'map[long]', label: 'Width (px)'},
        {name: 'map[lat]', label: 'Height(px)'},
        {name: 'map[km_per_pixel]', label: 'Kilometers/Pixel'},
        {name: 'map[height_data]', label: 'Height Data', type: 'textarea'}
    ]
}