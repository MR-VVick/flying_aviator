import Airplane from "./components/Airplane";
import Enemy from "./components/Enemy";
import EnemiesHolder from "./components/EnemiesHolder";
import Sea from "./components/Sea";
import Sky from "./components/Sky";
import createLights from "./utils/helpers/createLights";
import createScene from "./utils/helpers/createScene";
import { gameVar } from "./utils/contants/gameVar";
import Particle from "./components/Particle";
import ParticlesHolder from "./components/ParticleHolder";

class Game {
    constructor() {
        // Create scene, camera, and renderer
        const { scene, camera, renderer, WIDTH, HEIGHT } = createScene();
        const { hemisphereLight, shadowLight, ambientLight } = createLights();
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.WIDTH = WIDTH;
        this.HEIGHT = HEIGHT;
        this.hemisphereLight = hemisphereLight;
        this.shadowLight = shadowLight;
        this.ambientLight = ambientLight;

        // Initialize other properties
        this.airplane = new Airplane();
        this.particlesHolder = new ParticlesHolder();
        this.ambientLight = 
        this.mousePos = { x: 0, y: 0 };
        this.oldTime = 0;
        this.enemiesHolder = new EnemiesHolder(this.airplane, this.particlesHolder, this.ambientLight);

        this.init();
    }

    init() {
        this.createLights();
        this.createSea();
        this.createSky();
        this.createAirplane();
        this.createEnemies();
        this.createParticles();

        // Add event listeners for mouse and touch movements
        document.addEventListener("mousemove", this.handleMouseMove.bind(this), false);
        document.addEventListener("touchmove", this.handleTouchMove.bind(this), false);

        this.loop();
    }

    createLights() {
        this.scene.add(this.hemisphereLight, this.shadowLight, this.ambientLight);
    }

    createSea() {
        this.sea = new Sea();
        this.sea.mesh.position.y = -600;
        this.scene.add(this.sea.mesh);
    }

    createSky() {
        this.sky = new Sky();
        this.sky.mesh.position.y = -600;
        this.scene.add(this.sky.mesh);
    }

    createAirplane() {
        this.airplane.mesh.scale.set(0.25, 0.25, 0.25);
        this.airplane.mesh.position.y = 20;
        this.scene.add(this.airplane.mesh);
    }

    createEnemies() {
        for (let i = 0; i < 10; i++) {
            const enemy = new Enemy();
            this.enemiesHolder.enemiesPool.push(enemy);
        }
        this.scene.add(this.enemiesHolder.mesh);
    }

    createParticles(){
        for (var i=0; i<10; i++){
          var particle = new Particle();
          this.particlesHolder.particlesPool.push(particle);
        }
        this.scene.add(this.particlesHolder.mesh)
    }

    handleMouseMove(event) {
        const tx = -1 + (event.clientX / this.WIDTH) * 2;
        const ty = 1 - (event.clientY / this.HEIGHT) * 2;
        this.mousePos = { x: tx, y: ty };
    }

    handleTouchMove(event) {
        if (event.touches.length > 0) {
            const touch = event.touches[0];
            const tx = -1 + (touch.clientX / this.WIDTH) * 2;
            const ty = 1 - (touch.clientY / this.HEIGHT) * 2;
            this.mousePos = { x: tx, y: ty };
        }
    }

    updatePlane() {
        gameVar.planeSpeed = this.normalize(this.mousePos.x, -0.5, 0.5, gameVar.planeMinSpeed, gameVar.planeMaxSpeed);
        const targetY = this.normalize(this.mousePos.y, -0.75, 0.75, 25, 175);
        const targetX = this.normalize(this.mousePos.x, -0.75, 0.75, -100, 100);

        this.airplane.mesh.position.y += (targetY - this.airplane.mesh.position.y) * 0.1;
        this.airplane.mesh.rotation.z = (targetY - this.airplane.mesh.position.y) * 0.0128;
        this.airplane.mesh.rotation.x = (this.airplane.mesh.position.y - targetY) * 0.0064;

        this.airplane.propeller.rotation.x += 0.3;
        this.airplane.pilot.updateHairs();
    }

    normalize(v, vmin, vmax, tmin, tmax) {
        let nv = Math.max(Math.min(v, vmax), vmin);
        let dv = vmax - vmin;
        let pc = (nv - vmin) / dv;
        let dt = tmax - tmin;
        return tmin + pc * dt;
    }

    updateCameraFov() {
        this.camera.fov = this.normalize(this.mousePos.x, -1, 1, 55, 80);
        this.camera.updateProjectionMatrix();
    }

    updateDistance() {
        gameVar.distance += gameVar.speed * gameVar.deltaTime * gameVar.ratioSpeedDistance;
        const d = 502 * (1 - (gameVar.distance % gameVar.distanceForLevelUpdate) / gameVar.distanceForLevelUpdate);
        // Update any necessary UI elements related to distance
    }

    loop() {
        const newTime = new Date().getTime();
        gameVar.deltaTime = newTime - this.oldTime;
        this.oldTime = newTime;

        this.sea.mesh.rotation.z += 0.005;
        this.sky.mesh.rotation.z += 0.01;
        this.sea.moveWaves();

        this.updatePlane();
        this.updateCameraFov();
        this.updateDistance();

        if (Math.floor(gameVar.distance) % gameVar.distanceForEnnemiesSpawn === 0 && Math.floor(gameVar.distance) > gameVar.enemyLastSpawn) {
            gameVar.enemyLastSpawn = Math.floor(gameVar.distance);
            this.enemiesHolder.spawnEnemies();
        }

        gameVar.baseSpeed += (gameVar.targetBaseSpeed - gameVar.baseSpeed) * gameVar.deltaTime * 0.02;
        gameVar.speed = gameVar.baseSpeed * gameVar.planeSpeed;
        this.enemiesHolder.rotateEnemies();

        this.renderer.render(this.scene, this.camera);

        // Recursively call the loop
        requestAnimationFrame(this.loop.bind(this));
    }
}

// Start the gameVar when the window loads
window.addEventListener('load', () => new Game(), false);
