import JsonFx.Json;
var land_gameobject: Terrain;

function Start(){
	var row: int;
	var col: int;
	var h: float;
	var min: int; 
	var max: int;
	var MAX_HEIGHT = 3000.0;
	var UPSCALE = 8;
	var r2i: int;
	var c2i: int;
	
	var t = new Time();
	var start_time = t.time;
	
	/* ************ LOADING DATA FROM WEB ************** */

	var url = "http://localhost:3000/mars/data/-34/83.json";
	var www : WWW = new WWW (url);
	
	yield www;
	var www_time = t.time;
	Debug.Log('www load: ' + (www_time - start_time));
	
	var raw_url = "http://localhost:3000/mars/data/-34/83.raw";
	var raw_www : WWW = new WWW (raw_url);
	
	yield raw_www;
	var raw_www_time = t.time;
	Debug.Log('raw www load: ' + (raw_www_time - www_time) + ':(' +  (raw_www_time - start_time) + ')' );
	
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
	var utf_values  = new int[rows, cols];
	var json_values = new int[rows, cols];
	var offset = 0;
	yield;
	Debug.Log('value: rows, ' + rows + ', cols ' + cols);
	
	try {
	   var utf_bytes = raw_www.bytes;
		
	/*	Debug.Log('raw bytes: 0..10 ');
		for (var i = 0; i < 10; ++i){
		     Debug.Log(i + ': ' + utf_bytes[i]);
		}
		//return;
		*/
		
		
		try {
			var json_data = value["data"];
		} catch ( e){
			Debug.Log("cannot get data from json");
		}
		for ( row = 0; row < rows; ++row){
			//Debug.Log('Row ' + row);
		    try {
				var json_row = json_data[row];
			  	for (col = 0; col < cols; ++col){
			  		try {
			  			var h_int:int = json_row[col];
			  			if ((row == 0) && (col == 0)){
			  				min =h_int;
			  				max = h_int;
			  			} else if(min > h_int){
			  				min = h_int;
			  				} else if (max < h_int){
			  				max = h_int;
			  			}
				  		json_values[row,col] = h_int;
				  	//	Debug.Log('col = ' + col + ', h=' + h);
				  		utf_values[row,col] = readInt16(utf_bytes, offset);
				  		if (json_values[row,col] != utf_values[row,col]){
				  			Debug.Log("mismatch at [" + row + ',' + col + ']: json_value =' + json_values[row,col] + ', utf value = ' + utf_values[row,col]);
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
	var load_time = t.time;
	Debug.Log('raw www load: ' + (load_time - raw_www_time) + ':(' +  (load_time - start_time) + ')' );

			
	/* ********************* COPY DATA INTO ARRAYS ******************* */
	
	var lg_rows:int = (rows - 1) * UPSCALE + 1;
	var lg_cols:int = (cols - 1) * UPSCALE + 1;
	Debug.Log('MIN = ' + min + ', MAX = ' + max + ': ' + (max - min));
	var td: TerrainData = land_gameobject.terrainData;
	
	var terrain_heights = new float[lg_rows, lg_cols];
	var terrain_heights2 = new float[lg_rows, lg_cols];
	
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
	
	/* ************************ SMOOTH THE TERRAIN ******************* */
	// aliases for scaling 
	
	Debug.Log('smoothing terrain');
	for ( row = 0; row < lg_rows; ++row){
		for ( col = 0; col < lg_cols; ++col){
			var h_fl:float = 0;
			var count = 0;
			
			for ( r2i = Mathf.Max(0, row - UPSCALE ); r2i < Mathf.Min(lg_rows, row + UPSCALE ); ++r2i){						
				for ( c2i = Mathf.Max(0, col - UPSCALE  ); c2i < Mathf.Min(lg_cols, col + UPSCALE ); ++c2i){
					++count;
					h_fl += terrain_heights[r2i, c2i];
				   // if (row < 4 && col < 4){
				  //  	Debug.Log(r2i + ',' + c2i + ': count: ' + count + ', h_fl: ' + h_fl);
				 //   }
				}
			}
			
			h_fl = h_fl/(count * 1.0);
			
				  //  if (row < 4 && col < 4){
			//	    	Debug.Log('row ' + row + ', col ' + col + ': height ' + h_fl);
				 ///   }
			terrain_heights2[row, col] = h_fl;
		
		}
	}  
	
	td.SetHeights(0, 0, terrain_heights2);
	yield;
	var sh_time = t.time;
	Debug.Log('smooth and set heights: ' + (sh_time - load_time) + ':(' +  (sh_time - start_time) + ')' );
	  
	
	/* ********************* APPLY TERRAIN EFFECTS *********************** 
	var reps = 30;
	var blend = 0.01;
	land_gameobject.GetComponent("TerrainToolkit").PerlinGenerator(reps, 1.0, 8, blend);
	reps = 40;
	var cutting = 0.025;
	var rain = 0.01;
	var evap   = 0.25;
	var solubility = 0.005;
	var saturation = 0.02;
	var velocity = 0.75;
	var mom = 0.25;
	var entropy = 01;
	land_gameobject.GetComponent("TerrainToolkit").VelocityHydraulicErosion(
	reps, rain,
	 evap, solubility, saturation,
	  velocity, mom, entropy, cutting); 
	  
	terrain_heights2 = td.GetHeights(0, 0, lg_rows, lg_cols); */
	
	yield;
	var te_time = t.time;
	Debug.Log('smooth and set heights: ' + (te_time - sh_time ) + ':(' +  (te_time - start_time) + ')' );
	  
	  /* ****************** SETTING THE DATA TO A BUFFER **************** */
	  
	var buf_count = rows * cols * 2;
	var buffer = new byte[buf_count];
	 offset = 0;
	
	for ( row = 0; row < rows; ++row) {
		for ( col = 0; col < cols; ++col){
			try {
				var height: int = min + (terrain_heights2[row,col] * MAX_HEIGHT);
			} catch(e){
				Debug.Log('Error in height creation: ' + e);
				offset += 2;
				continue;
			}
			writeInt16(buffer, height, offset);
			offset += 2;
		}
	}
	
	yield;
	var buf_time = t.time;
	Debug.Log('store to buffer: ' + (buf_time - te_time ) + ':(' +  (buf_time - start_time) + ')' );
	
	/* *********************** WRITE BUFFER BACK TO SITE ************** */
	
	var form = new WWWForm();
	form.AddBinaryData('heights', buffer);
	var form_url = 'http://localhost:3000/mars/data/-34/83/' + UPSCALE;
	var www_out = new WWW(form_url, form);
	
	if (www_out.error != null){
		Debug.Log('Error writing data back to server: ' + www_out.error);
	} else {
		Debug.Log('Data Writen to Server');
	}

	yield;
	var w_time = t.time;
	Debug.Log('write to site: ' + (w_time - buf_time  ) + ':(' +  (w_time - start_time) + ')' );
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
