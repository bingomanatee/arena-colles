using UnityEngine;
using System.Collections;
using MarsUtils;
using JsonFx.Json;

public class LoadSmoothData : MonoBehaviour
{
	
	public Terrain land;

	private GetHeightFile height_file;
	// Use this for initialization
	void Start ()
	{
		height_file = new MarsUtils.GetHeightFile(-34, 83);
		
	}
	
	IEnumerator load_json(){
		height_file.status = GetHeightFile.STATUS_JSON_LOADING;
		var www = height_file.json_www();
		yield return www;
		
		if (www.error != null){
			height_file.status = GetHeightFile.STATUS_ERROR;
			throw new UnityException("Cannot read JSON " + www.url);
		} else {
			Debug.Log("data: " + www.data);
			HeightJsonData value = JsonReader.Deserialize<HeightJsonData>(www.data);
			height_file.json_data = value;
			Debug.Log("rows: " + height_file.json_data.rows.ToString() + ", cols: " + height_file.json_data.cols.ToString());
			height_file.status = GetHeightFile.STATUS_JSON_LOADED;
		}
	}
	
	IEnumerator load_bin_data(){
		height_file.status = GetHeightFile.STATUS_BIN_LOADING;
		var www = height_file.bin_smooth_www();
		
		yield return www;
		height_file.status = GetHeightFile.STATUS_BIN_LOADED;
		
		if (www.error != null){
			height_file.status = GetHeightFile.STATUS_ERROR;
			throw new UnityException("Cannot read bin data");
		} else {
			Debug.Log("Data Retuned");
			yield return new WaitForSeconds(0.1f);
			height_file.load_heights(www.bytes);
			Debug.Log("Heights Read");
			yield return new WaitForSeconds(0.1f);
			height_file.status = GetHeightFile.STATUS_BIN_LOADED;
		}
		
	}

	// Update is called once per frame
	void Update ()
	{
		switch (height_file.status){
		case GetHeightFile.STATUS_STARTED:
			Debug.Log("LOADING JSON");
			StartCoroutine(load_json());
			break;
			
			case GetHeightFile.STATUS_JSON_LOADED:
			Debug.Log("LOADING BIN DATA");
			StartCoroutine(load_bin_data());
			break;
			
			case GetHeightFile.STATUS_BIN_LOADED:
			Debug.Log("Bin Loaded");
			height_file.set_terrain_heights(land);
			height_file.status = GetHeightFile.STATUS_TERRAIN_LOADED;
			break;
		}
			
	}
}

