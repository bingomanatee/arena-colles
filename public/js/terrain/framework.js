var stats, scene, renderer, composer;
var camera, cameraControl;

// init the scene
function init(){

	if( Detector.webgl ){
		renderer = new THREE.WebGLRenderer({
			antialias		: true,	// to get smoother output
			preserveDrawingBuffer	: true	// to allow screenshot
		});
		renderer.setClearColorHex( 0xBBBBBB, 1 );
	} else {
		Detector.addGetWebGLMessage();
		return true;
	}
	renderer.setSize( 1000, 800);
	$('#container').append(renderer.domElement);


	// create a scene
	scene = new THREE.Scene();

	// put a camera in the scene
	var cameraH	= 10000;
	var cameraW	= cameraH / 8000 * 10000;
	camera	= new THREE.OrthographicCamera( -cameraW/2, +cameraW/2, cameraH/2, -cameraH/2, -100000, 100000 );
	camera.position.set(0, 0, 5);
	scene.add(camera);

	// create a camera contol
	cameraControls	= new THREE.TrackballControls( camera );
    cameraControls.rotateSpeed = 0.05;

	// transparently support window resize
	//THREEx.WindowResize.bind(renderer, camera);
	// allow 'p' to make screenshot
	THREEx.Screenshot.bindKey(renderer);
	// allow 'f' to go fullscreen where this feature is supported
	if( THREEx.FullScreen.available() ){
		THREEx.FullScreen.bindKey();
	//	document.getElementById('inlineDoc').innerHTML	+= "- <i>f</i> for fullscreen";
	}

	// here you add your objects
	// - you will most likely replace this part by your own
	var light	= new THREE.AmbientLight( Math.random() * 0xffffff );
	scene.add( light );
	var light	= new THREE.DirectionalLight( Math.random() * 0xffffff );
	light.position.set( Math.random(), Math.random(), Math.random() ).normalize();
	scene.add( light );
	var light	= new THREE.DirectionalLight( Math.random() * 0xffffff );
	light.position.set( Math.random(), Math.random(), Math.random() ).normalize();
	scene.add( light );
	var light	= new THREE.DirectionalLight( Math.random() * 0xffffff );
	light.position.set( Math.random(), Math.random(), Math.random() ).normalize();
	scene.add( light );
	var light	= new THREE.PointLight( Math.random() * 0xffffff );
	light.position.set( Math.random()-0.5, Math.random()-0.5, Math.random()-0.5 )
				.normalize().multiplyScalar(1.2);
	scene.add( light );
	var light	= new THREE.PointLight( Math.random() * 0xffffff );
	light.position.set( Math.random()-0.5, Math.random()-0.5, Math.random()-0.5 )
				.normalize().multiplyScalar(1.2);
	scene.add( light );
	var light	= new THREE.PointLight( Math.random() * 0xffffff );
	light.position.set( Math.random()-0.5, Math.random()-0.5, Math.random()-0.5 )
				.normalize().multiplyScalar(1.2);
	scene.add( light );

/*	var geometry	= new THREE.CubeGeometry( 2, 2, 2 );
	var material	= new THREE.MeshPhongMaterial({ambient: 0x808080, color: Math.random() * 0xffffff});
	var mesh	= new THREE.Mesh( geometry, material );*/
    var mesh =  make_terrain(128, 128);
	scene.add( mesh );
    mesh.position.y = -2000;

}

// animation loop
function animate() {

	// loop on request animation loop
	// - it has to be at the begining of the function
	// - see details at http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	requestAnimationFrame( animate );

	// do the render
	render();
}

// render the scene
function render() {
	// variable which is increase by Math.PI every seconds - usefull for animation
	var PIseconds	= Date.now() * Math.PI/4;

	// update camera controls
	cameraControls.update();

	// animate DirectionalLight
	scene.lights.forEach(function(light, idx){
		if( light instanceof THREE.DirectionalLight === false )	return;
		var ang	= 0.0005 * PIseconds * (idx % 2 ? 1 : -1);
		light.position.set(Math.cos(ang), Math.sin(ang), Math.cos(ang*2)).normalize();
	});
	// animate PointLights
	scene.lights.forEach(function(light, idx){
		if( light instanceof THREE.PointLight === false )	return;
		var angle	= 0.0005 * PIseconds * (idx % 2 ? 1 : -1) + idx * Math.PI/3;
		light.position.set(Math.cos(angle)*3, Math.sin(angle*3)*2, Math.cos(angle*2)).normalize().multiplyScalar(2);
	});

	// actually render the scene
	renderer.render( scene, camera );
}