using UnityEngine;
using System.Collections;

public class GUIscript : MonoBehaviour {
	
	public string lat = "-1";
	public string lon = "-1";
	public string done = "";
	
	private ArrayList logs;

	// Use this for initialization
	void Start () {
		logs = new ArrayList();
	}
	
	// Update is called once per frame
	void Update () {
	
	}
	
	public static int MAX_LINES = 16;
	
	public static int B1H = 15;
	
	public static int B2H = 150;
	
	public void add_log(string s){
		if (null == logs) {
			logs = new ArrayList();
		}
		if (logs.Count >= MAX_LINES){
		logs.RemoveAt(0);
		}
		logs.Add(s);
		
	}
	
	void OnGUI(){
		if (logs == null) {
			return;
		}
		GUI.Box(new Rect(10, B1H, 160, 50), "");
		GUI.Label(new Rect(20, B1H + 5, 100, 50), "Latitude");
		GUI.Label(new Rect(100, B1H + 5, 100, 50), lat);
		GUI.Label(new Rect(20, B1H + 20, 100, 50), "Longitude");
		GUI.Label(new Rect(100, B1H + 20, 100, 50), lon);
		GUI.Label(new Rect(20, B1H + 35, 100, 50), done);
		
		GUI.Box(new Rect(10,  B2H,600, B2H + MAX_LINES * 15 + 15), "");
		for (var i = 0; i < MAX_LINES; ++i){
			if(logs.Count > i){
			GUI.Label(new Rect(20, B2H + 5 + (i * 15), 600, 30), (string) logs[i]);
			}
		}
	}
}
