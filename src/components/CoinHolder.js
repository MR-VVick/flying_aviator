import * as THREE from 'three';
import Coin from './Coin';
import { gameVar } from '../utils/contants/gameVar';

export default class CoinsHolder {
    constructor(nCoins, airplane, particlesHolder) {
      this.mesh = new THREE.Object3D();
      this.coinsInUse = [];
      this.coinsPool = [];
      this.particlesHolder = particlesHolder;
      this.airplane = airplane;
  
      for (let i = 0; i < nCoins; i++) {
        const coin = new Coin();
        this.coinsPool.push(coin);
      }
    }
  
    spawnCoins() {
      const nCoins = 1 + Math.floor(Math.random() * 10);
      const d = gameVar.seaRadius + gameVar.planeDefaultHeight + (-1 + Math.random() * 2) * (gameVar.planeAmpHeight - 20);
      const amplitude = 10 + Math.round(Math.random() * 10);
  
      for (let i = 0; i < nCoins; i++) {
        let coin;
        if (this.coinsPool.length) {
          coin = this.coinsPool.pop();
        } else {
          coin = new Coin();
        }
        
        this.mesh.add(coin.mesh);
        this.coinsInUse.push(coin);
  
        coin.angle = -(i * 0.02);
        coin.distance = d + Math.cos(i * 0.5) * amplitude;
  
        // Set coin position
        coin.mesh.position.y = -gameVar.seaRadius + Math.sin(coin.angle) * coin.distance;
        coin.mesh.position.x = Math.cos(coin.angle) * coin.distance;
      }
    }
  
    rotateCoins() {
      for (let i = 0; i < this.coinsInUse.length; i++) {
        const coin = this.coinsInUse[i];
        if (coin.exploding) continue;
  
        // Update coin's angle and position
        coin.angle += gameVar.speed * gameVar.deltaTime * gameVar.coinsSpeed;
        if (coin.angle > Math.PI * 2) coin.angle -= Math.PI * 2;
  
        coin.mesh.position.y = -gameVar.seaRadius + Math.sin(coin.angle) * coin.distance;
        coin.mesh.position.x = Math.cos(coin.angle) * coin.distance;
        coin.mesh.rotation.z += Math.random() * 0.1;
        coin.mesh.rotation.y += Math.random() * 0.1;
  
        // Detect collision with airplane
        const diffPos = this.airplane.mesh.position.clone().sub(coin.mesh.position.clone());
        const d = diffPos.length();

        // console.log("Distance between airplane and coin: ", d);
        console.log(d, gameVar.coinDistanceTolerance,  d<gameVar.coinDistanceTolerance)
  
        if (d < gameVar.coinDistanceTolerance) {
          // Coin collected, remove from scene
          this.coinsPool.unshift(this.coinsInUse.splice(i, 1)[0]);
          this.mesh.remove(coin.mesh);
  
          // Spawn particles at coin's position
          this.particlesHolder.spawnParticles(coin.mesh.position.clone(), 5, 0x009999, 0.8);
        //   addEnergy();
          i--;
        } else if (coin.angle > Math.PI) {
          // Coin out of range, return to pool
          this.coinsPool.unshift(this.coinsInUse.splice(i, 1)[0]);
          this.mesh.remove(coin.mesh);
          i--;
        }
      }
    }
}
  