var Canvas = require('../lib/canvas');
var fs = require('fs');

module.exports = function(context){
    
    var self = this;
    
    function _with_map(err, map){
        
    var map_image = fs.readFile(MVC_PUBLIC + map.path);
        var img = new Canvas.Image();
        img.src = squid;
        
        var image_data = [];
        
        var canvas = new Canvas(img.width, img.height);
        
        ctx.drawImage(img, 0, 0, img.width, img.height);
        
        var image_data = context.getImageData(0, 0, img.width, img.height);
        for (var i = 0, data_length = image_data.length; i < data_length; ++i){
            var r = 255 - pix[i++];
            var g = 255 - pix[i++];
            var b = 255 - pix[i++];
            var brightness = r + g + b;
            if (image_data[brightness]){
                image_data[brightness]++;
            } else {
                image_data[brightness] = 1;
            }
        }
        context
    }
    
    
    this.model.get(context.req_params().id, _with_map);   
    
    
}