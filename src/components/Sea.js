import * as THREE from 'three';
import { colors } from "../utils/contants/colors";

export default class Sea {
	constructor() {
	  const geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10, false, 0, 7);
	  geom.rotateX(-Math.PI / 2); // Rotate the geometry
  
	  // Get the position attribute (vertices)
	  this.positionAttribute = geom.getAttribute('position');
	  const vertexCount = this.positionAttribute.count;
  
	  // Create an array to store data for each vertex
	  this.waves = [];
  
	  // Loop through each vertex and store data for wave movement
	  for (let i = 0; i < vertexCount; i++) {
		const x = this.positionAttribute.getX(i);
		const y = this.positionAttribute.getY(i);
		const z = this.positionAttribute.getZ(i);
  
		this.waves.push({
		  y: y,
		  x: x,
		  z: z,
		  // A random angle
		  ang: Math.random() * Math.PI * 2,
		  // A random amplitude
		  amp: 5 + Math.random() * 15,
		  // A random speed between 0.016 and 0.048 radians per frame
		  speed: 0.016 + Math.random() * 0.032
		});
	  }
  
	  const mat = new THREE.MeshPhongMaterial({
		color: colors.blue,
		transparent: true,
		opacity: 0.8,
		flatShading: true,
	  });
  
	  this.mesh = new THREE.Mesh(geom, mat);
	  this.mesh.receiveShadow = true;
	}
  
	// Update function to move the waves
	moveWaves() {
	  const vertexCount = this.positionAttribute.count;
  
	  // Loop through each vertex to update its position
	  for (let i = 0; i < vertexCount; i++) {
		const vprops = this.waves[i];
  
		// Update the position of the vertex
		const newX = vprops.x + Math.cos(vprops.ang) * vprops.amp;
		const newY = vprops.y + Math.sin(vprops.ang) * vprops.amp;
  
		// Set the new positions back in the position attribute
		this.positionAttribute.setX(i, newX);
		this.positionAttribute.setY(i, newY);
  
		// Increment the angle for the next frame
		vprops.ang += vprops.speed;
	  }
  
	  // Mark the position attribute for update
	  this.positionAttribute.needsUpdate = true;
  
	  // Slowly rotate the sea for added effect
	  this.mesh.rotation.z += 0.005;
	}
  }
  