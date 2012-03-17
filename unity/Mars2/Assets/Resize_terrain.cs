using UnityEngine;
using System.Collections;
using MarsUtils;
using JsonFx.Json;

public class Resize_terrain : MonoBehaviour
{

	public Terrain land;
	public int lat = -88;
	public int lon = 0;
	public bool skip = false;

	private GetHeightFile height_file;
	// Use this for initialization
	void Start ()
	{
		lat = 20;
		lon = 200;
	}
	
	IEnumerator load_json ()
	{
		height_file.status = GetHeightFile.STATUS_JSON_LOADING;
		var www = height_file.json_www ();
		yield return www;
		
		if (www.error != null) {
			height_file.status = GetHeightFile.STATUS_ERROR;
			throw new UnityException ("Cannot read JSON " + www.url);
		} else {
			Debug.Log ("data: " + www.data);
			HeightJsonData value = JsonReader.Deserialize<HeightJsonData> (www.data);
			height_file.json_data = value;
			//Debug.Log ("JSON rows: " + height_file.json_data.rows.ToString () + ", cols: " + height_file.json_data.cols.ToString ());
			height_file.status = GetHeightFile.STATUS_JSON_LOADED;
			if (value.lg.exists == true){
				height_file.status = GetHeightFile.STATUS_EXISTS;
			}
		}
	}
	
	IEnumerator load_bin_data ()
	{
		height_file.status = GetHeightFile.STATUS_BIN_LOADING;
		var www = height_file.bin_www ();
		
		yield return www;
		
		if (www.error != null) {
			height_file.status = GetHeightFile.STATUS_ERROR;
			throw new UnityException ("Cannot read bin data");
		} else {
			//Debug.Log ("Data Retuned");
			yield return new WaitForSeconds (0.1f);
			height_file.load_heights (www.bytes);
			//Debug.Log ("Heights Read");
			yield return new WaitForSeconds (0.1f);
			height_file.status = GetHeightFile.STATUS_BIN_LOADED;
		}
		
	} // end load_bin_data

	void write_terrain(){
		byte[] terrain_data = height_file.scaled_to_buffer(land);
		string form_url = "http://arenacolles.com/mars/data/" + lat.ToString() + "/" + lon.ToString() + "/" + height_file.scale.ToString();
		MarsUtils.SendRaw.send(form_url, terrain_data);
	}

	IEnumerator weather_terrain(){
		int freq = 15;
		float amp = 1.5f;
		int oct = 7;
		float blend = 0.25f;
		TerrainToolkit t = (TerrainToolkit) land.GetComponent("TerrainToolkit");
		t.PerlinGenerator(freq, amp, oct, blend);
		int reps = 20;
		float cutting = 0.05f;
		float rain = 0.015f;
		float evap   = 0.25f;
		float solubility = 0.0075f;
		float saturation = 0.02f;
		float velocity = 1.0f;
		float mom = 1.25f;
		int entropy = 2;
		t.VelocityHydraulicErosion(reps, rain, evap, solubility, saturation, 
		velocity, mom, entropy, cutting); 	
		yield return new WaitForSeconds(0.1f);
	}
		
	// Update is called once per frame
	void Update ()
	{
		if (height_file == null) {
			height_file = new MarsUtils.GetHeightFile (lat, lon);
			height_file.status = GetHeightFile.STATUS_STARTED;
		} else {
			switch (height_file.status) {
				case GetHeightFile.STATUS_STARTED:
					Debug.Log ("LOADING JSON");
					StartCoroutine (load_json ());
					break;
				
				case GetHeightFile.STATUS_JSON_LOADED:
					Debug.Log ("LOADING BIN DATA");
					StartCoroutine (load_bin_data ());
					break;
				
				case GetHeightFile.STATUS_BIN_LOADED:
					Debug.Log ("Bin Loaded");
					height_file.scale_heights(4);
					height_file.status = GetHeightFile.STATUS_BIN_SCALED;
					break;
					
				case GetHeightFile.STATUS_BIN_SCALED:
					height_file.set_terrain_heights_from_scaled(land);
					Debug.Log ("Terrain Loaded");
					height_file.status = GetHeightFile.STATUS_TERRAIN_LOADED;
					break;
				
				case GetHeightFile.STATUS_TERRAIN_LOADED:
					Debug.Log("Weathering Terrain");
					height_file.status = GetHeightFile.STATUS_TERRAIN_WEATHERING;
					StartCoroutine(weather_terrain());
					
					height_file.status = GetHeightFile.STATUS_TERRAIN_WEATHERED;
					break;
					
				case GetHeightFile.STATUS_TERRAIN_WEATHERED:
					Debug.Log("Writing Terrain");
					height_file.status = GetHeightFile.STATUS_TERRAIN_WRITING;
					write_terrain();
					height_file.status = GetHeightFile.STATUS_DONE;
					
					break;
				
				case GetHeightFile.STATUS_EXISTS:
					Debug.Log("Exists; SKIPPING " + lat.ToString() + ", lon " + lon.ToString());
					height_file.status = GetHeightFile.STATUS_DONE;
				break;
				
				case GetHeightFile.STATUS_DONE:
					Debug.Log("DONE WITH " + lat.ToString() + ", lon " + lon.ToString());
					height_file = null;
					lon = lon + 1;
					if (lon >= 360){
						lon = 0;
						lat = lat + 1;
					}
					break;

				default:
					Debug.Log ("In Process/unhandled height status: " + height_file.status.ToString ());
				break;
			} // end Switch
			
		}// end if height_file
		
	} // end update
	
} // end LoadSmoothData