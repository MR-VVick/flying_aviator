import * as THREE from 'three';
import { gsap } from 'gsap';

export default class Particle {
  constructor() {
    const geometry = new THREE.TetrahedronGeometry(3, 0);
    const material = new THREE.MeshStandardMaterial({
      color: 0x009999,
      metalness: 0,
      roughness: 1,
    });

    this.mesh = new THREE.Mesh(geometry, material);
  }

  explode(pos, color, scale, particlesPool) {
    const parent = this.mesh.parent;
    this.mesh.material.color = new THREE.Color(color);
    this.mesh.material.needsUpdate = true;
    this.mesh.scale.set(scale, scale, scale);

    const targetX = pos.x + (-1 + Math.random() * 2) * 50;
    const targetY = pos.y + (-1 + Math.random() * 2) * 50;
    const speed = 0.6 + Math.random() * 0.2;

    // GSAP Tweens for animations using gsap
    gsap.to(this.mesh.rotation, {
      x: Math.random() * 12,
      y: Math.random() * 12,
      duration: speed,
    });

    gsap.to(this.mesh.scale, {
      x: 0.1,
      y: 0.1,
      z: 0.1,
      duration: speed,
    });

    gsap.to(this.mesh.position, {
      x: targetX,
      y: targetY,
      delay: Math.random() * 0.1,
      duration: speed,
      ease: "power2.out",
      onComplete: () => {
        if (parent) parent.remove(this.mesh);
        this.mesh.scale.set(1, 1, 1);
        particlesPool.unshift(this); // Return the particle to the pool
      },
    });
  }
}
