import * as THREE from 'three';
import { colors } from "../utils/contants/colors";
import Pilot from './Pilot';

export default class Airplane {
	constructor() {

		this.mesh = new THREE.Object3D();

		// Create the cabin
		const geomCockpit = new THREE.BufferGeometry();
		const vertices = new Float32Array([
			// Front face
			-40, -5, 10,  // Vertex 0
			40, -25, 25,  // Vertex 1
			40,  25, 25,  // Vertex 2
			-40,  10, 10,  // Vertex 3
			// Back face
			-40, -5, -10, // Vertex 4
			40, -25, -25, // Vertex 5
			40,  25, -25, // Vertex 6
			-40,  10, -10  // Vertex 7
		]);

		const indices = [
			0, 1, 2, 2, 3, 0, // Front face
			4, 7, 6, 6, 5, 4, // Back face
			0, 4, 5, 5, 1, 0, // Bottom face
			3, 2, 6, 6, 7, 3, // Top face
			0, 3, 7, 7, 4, 0, // Left face
			1, 2, 6, 6, 5, 1  // Right face
		];

		geomCockpit.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
		geomCockpit.setIndex(indices);
		geomCockpit.computeVertexNormals();

		var matCockpit = new THREE.MeshPhongMaterial({ color: colors.red, flatShading: true });
		var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
		cockpit.castShadow = true;
		cockpit.receiveShadow = true;
		cockpit.position.x = cockpit.position.x - 10;
		this.mesh.add(cockpit);

		// Create the engine
		var geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
		var matEngine = new THREE.MeshPhongMaterial({ color: colors.white, flatShading: true });
		var engine = new THREE.Mesh(geomEngine, matEngine);
		engine.position.x = 40;
		engine.castShadow = true;
		engine.receiveShadow = true;
		this.mesh.add(engine);

		// Create the tail
		var geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
		var matTailPlane = new THREE.MeshPhongMaterial({ color: colors.red, flatShading: true });
		var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
		tailPlane.position.set(-35, 25, 0);
		tailPlane.castShadow = true;
		tailPlane.receiveShadow = true;
		tailPlane.position.x = tailPlane.position.x - 15;
		tailPlane.position.y = 18;
		this.mesh.add(tailPlane);

		// Create the wing
		var geomSideWing = new THREE.BoxGeometry(35, 8, 150, 1, 1, 1);
		var matSideWing = new THREE.MeshPhongMaterial({ color: colors.red, flatShading: true });
		var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
		sideWing.castShadow = true;
		sideWing.receiveShadow = true;
		sideWing.position.y = 10;
		this.mesh.add(sideWing);

		//windshield
		var geomWindshield = new THREE.BoxGeometry(3,15,20,1,1,1);
		var matWindshield = new THREE.MeshPhongMaterial({color:colors.white,transparent:true, opacity:.3, flatShading: true});;
		var windshield = new THREE.Mesh(geomWindshield, matWindshield);
		windshield.position.set(5,27,0);
	  
		windshield.castShadow = true;
		windshield.receiveShadow = true;
	  
		this.mesh.add(windshield);

		// propeller
		var geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
		var matPropeller = new THREE.MeshPhongMaterial({ color: colors.brown, flatShading: true });
		this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
		this.propeller.castShadow = true;
		this.propeller.receiveShadow = true;

		// blades
		var geomBlade = new THREE.BoxGeometry(1,80,10,1,1,1);
		var matBlade = new THREE.MeshPhongMaterial({color:colors.brownDark, flatShading: true });
		var blade1 = new THREE.Mesh(geomBlade, matBlade);
		blade1.position.set(8,0,0);

		blade1.castShadow = true;
		blade1.receiveShadow = true;

		var blade2 = blade1.clone();
		blade2.rotation.x = Math.PI/2;

		blade2.castShadow = true;
		blade2.receiveShadow = true;

		this.propeller.add(blade1);
		this.propeller.add(blade2);
		this.propeller.position.set(50,0,0);
		this.mesh.add(this.propeller);

		//wheel
		var wheelProtecGeom = new THREE.BoxGeometry(30,15,10,1,1,1);
		var wheelProtecMat = new THREE.MeshPhongMaterial({color:colors.red, flatShading: true});
		var wheelProtecR = new THREE.Mesh(wheelProtecGeom,wheelProtecMat);
		wheelProtecR.position.set(15,-20,25);
		this.mesh.add(wheelProtecR);

		var wheelTireGeom = new THREE.BoxGeometry(24,24,4);
		var wheelTireMat = new THREE.MeshPhongMaterial({color:colors.brownDark, flatShading: true});
		var wheelTireR = new THREE.Mesh(wheelTireGeom,wheelTireMat);
		wheelTireR.position.set(15,-28,25);

		var wheelAxisGeom = new THREE.BoxGeometry(10,10,6);
		var wheelAxisMat = new THREE.MeshPhongMaterial({color:colors.brown, flatShading: true});
		var wheelAxis = new THREE.Mesh(wheelAxisGeom,wheelAxisMat);
		wheelTireR.add(wheelAxis);

		this.mesh.add(wheelTireR);

		var wheelProtecL = wheelProtecR.clone();
		wheelProtecL.position.z = -wheelProtecR.position.z ;
		this.mesh.add(wheelProtecL);

		var wheelTireL = wheelTireR.clone();
		wheelTireL.position.z = -wheelTireR.position.z;
		this.mesh.add(wheelTireL);

		var wheelTireB = wheelTireR.clone();
		wheelTireB.scale.set(.5,.5,.5);
		wheelTireB.position.set(-46,-15,0);
		this.mesh.add(wheelTireB);

		//suspension
		var suspensionGeom = new THREE.BoxGeometry(4,20,4);
		suspensionGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0,10,0))
		var suspensionMat = new THREE.MeshPhongMaterial({color:colors.red, flatShading: true});
		var suspension = new THREE.Mesh(suspensionGeom,suspensionMat);
		suspension.position.set(-46,-15,0);
		suspension.rotation.z = -.3;
		this.mesh.add(suspension);

		this.pilot = new Pilot();
		this.pilot.mesh.position.set(-10,27,0);
		this.mesh.add(this.pilot.mesh);
	  
		this.mesh.castShadow = true;
		this.mesh.receiveShadow = true;
	}
};