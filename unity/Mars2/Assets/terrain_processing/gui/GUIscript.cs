using UnityEngine;
using System.Collections;

public class GUIscript : MonoBehaviour {
	
	public string lat = "-1";
	public string lon = "-1";
	public string done = "";

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}
	
	void OnGUI(){
		GUI.Box(new Rect(10, 10, 160, 90), "");
		GUI.Label(new Rect(20, 20, 100, 50), "Latitude");
		GUI.Label(new Rect(100, 20, 100, 50), lat);
		GUI.Label(new Rect(20, 60, 100, 50), "Longitude");
		GUI.Label(new Rect(100, 60, 100, 50), lon);
		GUI.Label(new Rect(20, 100, 100, 50), done);
	}
}
