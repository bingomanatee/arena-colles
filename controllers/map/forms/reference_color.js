

module.exports = {
    configs: {
        action: '/maps/0/reference_color',
        method: 'post',
        context: "rc"
    },
    
    fields: [
        {name: 'rc[r]', label: 'Red', value: 0},
        {name: 'rc[g]', label: 'Green', value: 0},
        {name: 'rc[b]', label: 'Blue', value: 0},
        {name: 'rc[height]', label: 'Height', value: 0}
    ]
}