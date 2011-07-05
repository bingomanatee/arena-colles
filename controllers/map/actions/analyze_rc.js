var colors = require('util/colors');

/**
 * Returns the difference between the hue of the rgb
 * and an array of hues
 */

module.exports = function(hues, rc){
    console.log(__filename, ': hues: ', hues, ', rc: ', rc);
    
    var hsv = colors.rgb_to_hsv(rc);
    var rc_hue = hsv[0];
    
    var out = _.map(hues, function(hue){
        var diff = Math.max(hue, rc_hue) - Math.min(hue, rc_hue);
        
        if (diff > 180){
            var past_180 = diff - 180;
            diff = 180 - past_180;
        }
        
        return diff;
        
    })
    
    return out;
}