var fs = require('fs');

// read mars data at http://pds-geosciences.wustl.edu/geo/mgs-m-mola-5-megdr-l3-v1/mgsl_300x/meg004/megt90n000cb.img
var buffer = fs.readFileSync(__dirname + '/megt90n000cb.img');
if (Buffer.isBuffer(buffer)) {
    console.log('data is buffer');
} else {
    console.log('data is not buffer');
    var buffer = new Buffer(buffer, 'binary');
    if (!Buffer.isBuffer(buffer)) {
        console.log('still not');
    }
}


function readUInt16(offset, endian, buffer) {
    var val = 0;

    if (endian == 'big') {
        val = buffer[offset] << 8;
        val |= buffer[offset + 1];
    } else {
        val = buffer[offset];
        val |= buffer[offset + 1] << 8;
    }

    return val;
};

function readInt16(offset, endian, buffer) {

    val = readUInt16(offset, endian, buffer);
    
    neg = val & 0x8000;
    if (!neg) {
        return val;
    }

    return (0xffff - val + 1) * -1;
}

console.log('first int: ', readInt16(0, 'big', buffer));