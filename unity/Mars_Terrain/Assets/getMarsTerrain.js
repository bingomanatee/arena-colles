import JsonFx.Json;
import MarsUtils.SendRaw;
import MarsUtils;

var land_gameobject: Terrain;

function Start(){
	var row: int;
	var col: int;
	var h: float;
	var min: int; 
	var max: int;
	var MAX_HEIGHT = 3000.0;
	var UPSCALE = 4;
	var r2i: int;
	var c2i: int;
	
	var start_time = System.Environment.TickCount;
	
	/* ************ LOADING DATA FROM WEB ************** */

	var url = "http://localhost:3000/mars/data/-34/83.json";
	var www : WWW = new WWW (url);
	
	yield www;
	var www_time = System.Environment.TickCount;
	Debug.Log('www load: ' + (www_time - start_time));
	
	var raw_url = "http://localhost:3000/mars/data/-34/83.raw";
	var raw_www : WWW = new WWW (raw_url);
	
	yield raw_www;
	var raw_www_time = System.Environment.TickCount;
	Debug.Log('raw www load: ' + (raw_www_time - www_time)/1000 + ':(' +  (raw_www_time - start_time)/1000 + ')' );
	
	if (www.error !== null){
	  	Debug.LogError('cannot read ' + url);
	  	return;
	} else if (raw_www.error != null) {
	  	Debug.LogError('cannot read ' + raw_www);
	  	return;
	}

	Debug.Log(www.text);
	var reader = new JsonReader(www.data);
	var value = reader.Deserialize();
	var rows:int = value["rows"];
	var cols:int = value["cols"];
	var utf_values: int[,] = new int[rows, cols];
	var offset = 0;
	yield;
	Debug.Log('value: rows, ' + rows + ', cols ' + cols);
	
	try {
	   var utf_bytes = raw_www.bytes;
		for ( row = 0; row < rows; ++row){
			//Debug.Log('Row ' + row);
		    try {
			  	for (col = 0; col < cols; ++col){
			  		try {
			  			var h_int:int = readInt16(utf_bytes, offset);
				  		utf_values[row,col] = h_int;
				  		
			  			if ((row == 0) && (col == 0)){
			  				min =h_int;
			  				max = h_int;
			  			} else if(min > h_int){
			  				min = h_int;
			  				} else if (max < h_int){
			  				max = h_int;
			  			}
				  		offset += 2;
			  		} catch ( e){
			  			Debug.Log("cannot get col " + col + 'from row ' + row + 'from json data');
			  		}
			  	}
		    } catch (e){
		       Debug.Log("cannot get row " + row + " from json data");
		    }
		}
		  
	} catch(e){
	   Debug.Log('cannot get raw_data: ' + e);
	} 
	
	yield;
	var load_time = System.Environment.TickCount;
	Debug.Log('raw www load: ' + ((load_time - raw_www_time)/1000) + ':(' + ((load_time - start_time)/1000) + ')' );

			
	/* ********************* COPY DATA INTO ARRAYS ******************* */
	
	var lg_rows:int = (rows - 1) * UPSCALE + 1;
	var lg_cols:int = (cols - 1) * UPSCALE + 1;
	Debug.Log('MIN = ' + min + ', MAX = ' + max + ': ' + (max - min));
	var td: TerrainData = land_gameobject.terrainData;
	
	var terrain_heights = new float[lg_rows, lg_cols];
	var terrain_base_profile = new float[lg_rows, lg_cols];
	
	Debug.Log('loading terrain');
		
	for ( row = 0; row < lg_rows; ++row){
		for ( col = 0; col < lg_cols; ++col){
			
			 r2i = row / (UPSCALE);
			 c2i = col / (UPSCALE);
			var h_interp = utf_values[r2i, c2i];
			h = (h_interp - min) / MAX_HEIGHT;
			terrain_heights[row, col] = h;
			
		}
		
	}
	utf_values = null;
	
	//td.SetHeights(0, 0, terrain_heights);
	
	/* ************************ SMOOTH THE TERRAIN ******************* */
	// aliases for scaling 
	
	Debug.Log('smoothing terrain');
	TerrainUtils.smooth(terrain_heights, UPSCALE/2, 2, terrain_base_profile);
	
	td.SetHeights(0, 0, terrain_base_profile);
	
	yield;
	var sh_time = System.Environment.TickCount;
	Debug.Log('smooth and set heights: ' + ((sh_time - load_time)/1000) + ':(' + ((sh_time - start_time)/1000) + ')' );
	  
	
	/* ********************* APPLY TERRAIN EFFECTS *********************** */
	
	var blend:float = 0.25;
	var freq = 10.0;
	var oct = 8;
	var amp = 1.0;
	land_gameobject.GetComponent("TerrainToolkit").PerlinGenerator(freq, amp, oct, blend);
	var reps = 10;
	
	var cutting = 0.025;
	var rain = 0.01;
	var evap   = 0.25;
	var solubility = 0.005;
	var saturation = 0.02;
	var velocity = 0.75;
	var mom = 0.25;
	var entropy = 01;
	land_gameobject.GetComponent("TerrainToolkit").VelocityHydraulicErosion(
	reps, rain, evap, solubility, saturation, velocity, mom, entropy, cutting); 
	 
	var altered_data: float[, ] = td.GetHeights(0, 0, lg_rows, lg_cols); 
	var altered_data_smooth: float[, ] = new float[lg_rows, lg_cols];
	var terrain_offset: float[, ] = new float[lg_rows, lg_cols];
	Debug.Log('smoothing altered data');
	yield;
	TerrainUtils.smooth(altered_data, UPSCALE/2, 4, altered_data_smooth);
	Debug.Log('diff of smooth to base');
	yield;
	TerrainUtils.diff(altered_data_smooth, terrain_base_profile, terrain_offset, 1.0);
	altered_data_smooth = null;
	Debug.Log('re-floating altered data');
	yield;
	TerrainUtils.diff(altered_data, terrain_offset, altered_data, 0.125);
	Debug.Log('copying new altered data to terrain');
	yield;
	td.SetHeights(0, 0, altered_data); 
	
	
	var te_time = System.Environment.TickCount;
	Debug.Log('apply Terrain Effects: ' + ((te_time - sh_time )/1000) + ':(' + ((te_time - start_time)/1000) + ')' );
	yield;
	
	/* *************** COLOR PLAIN ************* */
	
	 TerrainUtils.color_plains(td);
	  
	var ctime = System.Environment.TickCount;
	Debug.Log('color mountains: ' + ((ctime - te_time)/1000) + ':(' + ((ctime - start_time)/1000) + ')' );
	yield;
	
	  /* ****************** SETTING THE DATA TO A BUFFER **************** */
	  
	var buf_count = lg_rows * lg_cols * 2;
	var buffer = new byte[buf_count];
	 offset = 0;
	
	terrain_heights = td.GetHeights(0, 0, lg_rows, lg_cols);
	for ( row = 0; row < lg_rows; ++row) {
		for ( col = 0; col < lg_cols; ++col){
			try {
				var height: int = min + (terrain_heights[row,col] * MAX_HEIGHT);
			} catch(e){
				Debug.Log('Error in height creation: ' + e);
				offset += 2;
				continue;
			}
			
			writeInt16(buffer, height, offset);
			offset += 2;
		}
	}
	
	Debug.Log((offset/2) + ' values sent');
	
	yield;
	var buf_time = System.Environment.TickCount;
	Debug.Log('store to buffer: ' + ((buf_time - ctime)/1000) + ':(' + ((buf_time - start_time)/1000) + ')' );
	
	/* *********************** WRITE BUFFER BACK TO SITE ************** */
	
	var form_url = 'http://localhost:3000/mars/data/-34/83/' + UPSCALE;

	MarsUtils.SendRaw.send(form_url, buffer);

	var w_time = System.Environment.TickCount;
	Debug.Log('write to site: ' + ((w_time - buf_time)/1000) + ':(' +  ((w_time - start_time)/1000) + ')' );
}


function Update () {
}

function sqrg(v){
	if (v < 0.5){
		return (v * v * 2);
	} else {
		return 1 - ((1 - v) * (1 - v) * 2);
	}
}

function readUInt16(buffer, offset) {
	var val:int = buffer[offset] << 8;
	val |= buffer[offset + 1];
	return val;
}

function readInt16(buffer, offset) {
  var val:int = readUInt16(buffer, offset);
  var neg = val & 0x8000;
  return neg ? (0xffff - val + 1) * -1 : val;
}

function writeInt16(buffer, value: int, offset) {
var off_value:int;
  if (value >= 0) {
    writeUInt16(buffer, value, offset);
  } else {
  	try {
  		off_value = 0xffff + value + 1;
	} catch (e){
		Debug.Log('error in neg writeInt16: ' + e);
		off_value = 0;
	}
    writeUInt16(buffer, off_value, offset);
  }
}


function writeUInt16(buffer, value:int, offset) {
	var first_val: byte = 0;
	var second_val: byte = 0;
	
	try {
		first_val =  (value & 0xff00) >> 8;
	} catch(e){
		Debug.Log('writeUInt16: first error ' + e);
		first_val = 0;
	}
	try {
		second_val =  value & 0x00ff;
	} catch(e){
		Debug.Log('writeUInt16: second error ' + e);
		second_val = 0;
	}

    buffer[offset] = first_val;
    buffer[offset + 1] = second_val;
}
