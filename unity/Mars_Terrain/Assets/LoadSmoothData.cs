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
		height_file = new MarsUtils.GetHeightFile (-34, 83);
		
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
			Debug.Log ("JSON rows: " + height_file.json_data.rows.ToString () + ", cols: " + height_file.json_data.cols.ToString ());
			height_file.rows = value.rows;
			height_file.cols = value.cols;
			height_file.status = GetHeightFile.STATUS_JSON_LOADED;
		}
	}

	IEnumerator load_bin_data ()
	{
		height_file.status = GetHeightFile.STATUS_BIN_LOADING;
		var www = height_file.bin_smooth_www ();
		
		yield return www;
		
		if (www.error != null) {
			height_file.status = GetHeightFile.STATUS_ERROR;
			throw new UnityException ("Cannot read bin data");
		} else {
			Debug.Log ("Data Retuned");
			yield return new WaitForSeconds (0.1f);
			height_file.load_heights (www.bytes);
			Debug.Log ("Heights Read");
			yield return new WaitForSeconds (0.1f);
			height_file.status = GetHeightFile.STATUS_BIN_LOADED;
		}
		
	}

	IEnumerator load_mtn_data ()
	{
		height_file.mtn_status = GetHeightFile.STATUS_MTN_LOADING;
		Debug.Log ("LOADING MTN DATA");
		yield return new WaitForSeconds (0.1f);
		
		WWW www = height_file.bin_mtn_www ();
		
		yield return www;
		
		if (www.error != null) {
			height_file.mtn_status = GetHeightFile.STATUS_ERROR;
			Debug.Log ("Cannot read mtn data");
			yield return new WaitForSeconds (0.1f);
		} else {
			Debug.Log ("Loaded Mountain Data... " + www.bytes.Length.ToString() + " bytes");
			yield return new WaitForSeconds (0.1f);
			height_file.load_mtn_mask (www.bytes);
			Debug.Log ("MOUNTAIN MASK APPLIED");
			yield return new WaitForSeconds (0.1f);
			height_file.mtn_status = GetHeightFile.STATUS_MTN_LOADED;
		}
		
		
	}

	// Update is called once per frame
	void Update ()
	{
		if (height_file != null) {
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
					height_file.set_terrain_heights (land);
					height_file.status = GetHeightFile.STATUS_TERRAIN_LOADED;
					break;
				
				case GetHeightFile.STATUS_TERRAIN_LOADED:
					Debug.Log ("Terrain Loaded -- loading mountain data");
					break;
				
				default:
				Debug.Log ("Unhandled  height status: " + height_file.status.ToString ());
				break;
			} 
			
			switch (height_file.mtn_status) {
			
				case GetHeightFile.STATUS_STARTED:					
				if (height_file.status >= GetHeightFile.STATUS_TERRAIN_LOADED) {
						Debug.Log ("starting MTN");
						StartCoroutine (load_mtn_data ());
					}
					break;
				
				case GetHeightFile.STATUS_MTN_LOADING:
					Debug.Log ("loading mountain data");
					break;
				
				case GetHeightFile.STATUS_MTN_LOADED:
					Debug.Log ("Setting Mountain Mask");
					height_file.set_mtn_mask (land);
					break;
				
				case GetHeightFile.STATUS_MTN_MASKING:
					Debug.Log ("Mountain Data Loading...");
					break;
				
				case GetHeightFile.STATUS_MTN_MASKED:
					Debug.Log ("MOUNTAIN DATA DONE");
					break;
					
				case GetHeightFile.STATUS_DONE:
					// done
					break;
					
				default:
					Debug.Log ("Unhandled MTN STATUS: " + height_file.mtn_status.ToString ());
					break;
					
			}
			
			
			Debug.Log ("Mtn Status: " + height_file.mtn_status.ToString () + ", terrain status: " + height_file.status.ToString ());
			
			
		}
		
	}
}

