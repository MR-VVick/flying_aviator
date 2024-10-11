import * as THREE from 'three';
import { colors } from "../utils/contants/colors";

export default class Enemy {
    constructor() {
      const geometry = new THREE.TetrahedronGeometry(8, 2);
      const material = new THREE.MeshPhongMaterial({
        color: colors.red,
        shininess: 0,
        specular: 0xffffff,
        flatShading: true,
    });
  
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.angle = 0;
        this.distance = 0;
    }
}
