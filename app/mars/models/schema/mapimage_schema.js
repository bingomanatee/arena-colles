var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Radius_Def = new Schema({unit:String, value:Number});

var schema_def = {
    pds_version_id:String,
    record_type:String,
    file_records:Number,
    record_bytes:Number,
    start_time:Date,
    stop_time:Date,
    start_orbit_number:Number,
    stop_orbit_number:Number,
    product_creation_time:Date,
    lines:Number,
    line_samples:Number,
    sample_bits:Number,
    a_axis_radius:Radius_Def,
    b_axis_radius:Radius_Def,
    c_axis_radius:Radius_Def,
    center_latitude:Number,
    central_longitude:Number,
    reference_latitude:String,
    reference_longitude:String
    line_first_pixel:Number,
    line_last_pixel:Number,
    sample_first_pixel:Number,
    sample_last_pixel:Number,
    map_projection_rotation:Number,
    map_resolution:Radius_Def,
    map_scale:Radius_Def,
    maximum_latitude:Number,
    minimum_latitude:Number,
    westernmost_longitude:Number,
    easternmost_longitude:Number,
    line_projection_offset:Number,
    sample_projection_offset:Number
}
var string_labels = '^image,data_set_id,product_id,spacecraft_name,instrument_id,instrument_name,target_name,' +
    'product_version_id,producer_full_name,producer_institution_name,description,object,name,' +
    'sample_type,end_object,^data_set_map_projection,map_projection_type,' +
    'first_standard_parallel,second_standard_parallel,positive_longitude_direction,' +
    'coordinate_system_type,coordinate_system_name';

string_labels.split(',').forEach(
    function (term) {
        schema_def[term] = String;
    }
)

var Manifest_Schema = new Schema(schema_def);

module.exports = {
    image_file:{type:String, required:true},
    manifest:Manifest_Schema
}
