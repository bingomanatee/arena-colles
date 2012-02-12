
var land_gameobject: Terrain;

function Start() {
	var td = land_gameobject.terrainData;
	var info = td.GetHeights(0, 0, 33, 33);
	
	for (var r = 0; r < 33; r += 10) for (var c = 0; c < 33; ++c){
		Debug.Log('row ' + r + ',col: ' + c + ', h: ' + info[r,c]);
	}
}

function Update () {
}