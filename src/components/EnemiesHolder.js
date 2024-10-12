import * as THREE from 'three';
import { colors } from "../utils/contants/colors";
import Enemy from './Enemy';
import { gameVar } from '../utils/contants/gameVar';
import Particle from './Particle';

export default class EnemiesHolder {
  constructor(airplane, particlesHolder, ambientLight) {
    this.mesh = new THREE.Group(); // Better to use THREE.Group for managing objects
    this.enemiesInUse = [];
    this.enemiesPool = [];
    this.airplane = airplane;
    this.particlesHolder = particlesHolder;
    this.ambientLight = ambientLight;

    for (var i=0; i<10; i++){
      var particle = new Particle();
      this.particlesHolder.particlesPool.push(particle);
    }
  }

  
  // Spawn Enemies
  spawnEnemies() {
    const nEnemies = gameVar.level;
    // console.log(`Spawning ${nEnemies} enemies for level ${gameVar.level}`);
    for (let i = 0; i < nEnemies; i++) {
      let enemy;
      if (this.enemiesPool.length) {
      
        enemy = this.enemiesPool.pop();
      } else {
        // console.log('not ok')
        enemy = new Enemy();
      }
      enemy.angle = -(i * 0.1);
      enemy.distance = gameVar.seaRadius + gameVar.planeDefaultHeight + (-1 + Math.random() * 2) * (gameVar.planeAmpHeight - 20);
      enemy.mesh.position.y = -gameVar.seaRadius + Math.sin(enemy.angle) * enemy.distance;
      enemy.mesh.position.x = Math.cos(enemy.angle) * enemy.distance;
      this.mesh.add(enemy.mesh);
      // console.log(`Total enemies after spawning: ${this.mesh.children.length}`);
      this.enemiesInUse.push(enemy);

      // console.log(`Total enemies after spawning: ${this.mesh.children.length}`);
    }
  }

  // Rotate Enemies
  rotateEnemies() {
    for (let i = 0; i < this.enemiesInUse.length; i++) {
      const enemy = this.enemiesInUse[i];
      enemy.angle += gameVar.speed * gameVar.deltaTime * gameVar.enemiesSpeed;

      if (enemy.angle > Math.PI * 2) enemy.angle -= Math.PI * 2;

      enemy.mesh.position.y = -gameVar.seaRadius + Math.sin(enemy.angle) * enemy.distance;
      enemy.mesh.position.x = Math.cos(enemy.angle) * enemy.distance;
      enemy.mesh.rotation.z += Math.random() * 0.1;
      enemy.mesh.rotation.y += Math.random() * 0.1;

      const diffPos = this.airplane.mesh.position.clone().sub(enemy.mesh.position.clone());
      const distance = diffPos.length();

      // Handle Collision
      if (distance < gameVar.enemyDistanceTolerance) {
        this.particlesHolder.spawnParticles(enemy.mesh.position.clone(), 15, colors.red, 3);

        this.enemiesPool.unshift(this.enemiesInUse.splice(i, 1)[0]);
        this.mesh.remove(enemy.mesh);
        gameVar.planeCollisionSpeedX = 100 * diffPos.x / distance;
        gameVar.planeCollisionSpeedY = 100 * diffPos.y / distance;
        this.ambientLight.intensity = 2;

        // removeEnergy();
        i--;
      } else if (enemy.angle > Math.PI) {
        this.enemiesPool.unshift(this.enemiesInUse.splice(i, 1)[0]);
        this.mesh.remove(enemy.mesh);
        i--;
      }
    }
  }
}