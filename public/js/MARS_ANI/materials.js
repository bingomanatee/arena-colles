function _create_materials() {

    MARS_ANI._materials = {
    }

    /**
     * returns a solid material based on a basic color
     * @param type : string
     * @param color : hex color
     */

    MARS_ANI.material = function(type, color) {
        if (!MARS_ANI._materials.hasOwnProperty(type)) {
            MARS_ANI._materials[type] = {};
        }
        if (!MARS_ANI._materials[type].hasOwnProperty(color)) {
            var mat = new THREE[type]({ color: color });
            MARS_ANI._materials[type][color] = mat;
        }
        return MARS_ANI._materials[type][color];
    }

}

_create_materials();