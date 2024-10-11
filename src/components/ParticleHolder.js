import * as THREE from 'three';
import Particle from './Particle';

export default class ParticlesHolder {
  constructor() {
    this.mesh = new THREE.Group(); // Use THREE.Group for managing particles
    this.particlesInUse = [];
    this.particlesPool = []
  }

  // Spawn Particles
  spawnParticles(pos, density, color, scale) {
    const nParticles = density;

    for (let i = 0; i < nParticles; i++) {
      let particle;

      // Get a particle from the pool or create a new one
      if (this.particlesPool.length) {
        particle = this.particlesPool.pop();
      } else {
        particle = new Particle();
      }

      this.mesh.add(particle.mesh);
      particle.mesh.visible = true;
      particle.mesh.position.set(pos.x, pos.y, pos.z || 0); // Set the position using a vector

      // Trigger explosion effect
      particle.explode(pos, color, scale, this.particlesPool);
      this.particlesInUse.push(particle); // Track particles in use if needed
    }
  }
}
