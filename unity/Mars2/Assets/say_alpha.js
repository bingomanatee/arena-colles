var land: Terrain;

function Start(){
   var a:	float[,,] = land.terrainData.GetAlphamaps(0, 0, land.terrainData.alphamapWidth, land.terrainData.alphamapHeight);
	for (var x = 0; x < a.GetLength(0); ++x)
	for (var y = 0; y < a.GetLength(1); ++y)
	for (var z = 0; z < a.GetLength(2); ++z){
		Debug.Log("x = " + x.ToString() + ", y = " + y.ToString() + ", z = " + z.ToString() + ": " + a[x,y,z].ToString());
	}
}

function Update () {
}