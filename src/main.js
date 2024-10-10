import Airplane from "./components/Airplane";
import Sea from "./components/Sea";
import Sky from "./components/Sky";
import createLights from "./utils/helpers/createLights";
import createScene from "./utils/helpers/createScene";

function init() {
	const { scene, camera, renderer, WIDTH, HEIGHT } = createScene();
    const { hemisphereLight, shadowLight, ambientLight } = createLights();
    const sea = new Sea();
	const sky = new Sky();
	const airplane = new Airplane();
	var mousePos={x:0, y:0};

	scene.add(hemisphereLight, shadowLight, ambientLight);

    sea.mesh.position.y = -600;
    scene.add(sea.mesh);

	sky.mesh.position.y = -600
	scene.add(sky.mesh)

	airplane.mesh.scale.set(.25,.25,.25);
	airplane.mesh.position.y = 20;
	scene.add(airplane.mesh);

	renderer.render(scene, camera);

	const handleMouseMove = (event) => {

		// here we are converting the mouse position value received 
		// to a normalized value varying between -1 and 1;
		// this is the formula for the horizontal axis:
		
		var tx = -1 + (event.clientX / WIDTH)*2;
	
		// for the vertical axis, we need to inverse the formula 
		// because the 2D y-axis goes the opposite direction of the 3D y-axis
		
		var ty = 1 - (event.clientY / HEIGHT)*2;
		mousePos = {x:tx, y:ty};
	
	}

	const updatePlane = () => {

		// let's move the airplane between -100 and 100 on the horizontal axis, 
		// and between 25 and 175 on the vertical axis,
		// depending on the mouse position which ranges between -1 and 1 on both axes;
		// to achieve that we use a normalize function (see below)
		
		var targetY = normalize(mousePos.y,-.75,.75,25, 175);
		var targetX = normalize(mousePos.x,-.75,.75,-100, 100);
		
		// Move the plane at each frame by adding a fraction of the remaining distance
		airplane.mesh.position.y += (targetY-airplane.mesh.position.y)*0.1;
	
		// Rotate the plane proportionally to the remaining distance
		airplane.mesh.rotation.z = (targetY-airplane.mesh.position.y)*0.0128;
		airplane.mesh.rotation.x = (airplane.mesh.position.y-targetY)*0.0064;
	
		airplane.propeller.rotation.x += 0.3;
		airplane.pilot.updateHairs();
	}
	
	const normalize = (v,vmin,vmax,tmin, tmax) => {
	
		var nv = Math.max(Math.min(v,vmax), vmin);
		var dv = vmax-vmin;
		var pc = (nv-vmin)/dv;
		var dt = tmax-tmin;
		var tv = tmin + (pc*dt);
		return tv;
	
	}

	const updateCameraFov = () => {
		camera.fov = normalize(mousePos.x,-1,1,40, 80);
		camera.updateProjectionMatrix();
	}

	const loop = () => {
		// Rotate the propeller, the sea and the sky
		// airplane.propeller.rotation.x += 0.3;
		sea.mesh.rotation.z += .005;
		sky.mesh.rotation.z += .01;
		sea.moveWaves();
		updatePlane();
		updateCameraFov();
		// render the scene
		renderer.render(scene, camera);
	
		// call the loop function again
		requestAnimationFrame(loop);
	}

	document.addEventListener('mousemove', handleMouseMove, false);
	loop();
}

window.addEventListener('load', init, false);