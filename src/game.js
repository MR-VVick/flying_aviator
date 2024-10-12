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
import CoinsHolder from "./components/CoinHolder";

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
        this.mousePos = { x: 0, y: 0 };
        this.oldTime = 0;
        this.enemiesHolder = new EnemiesHolder(this.airplane, this.particlesHolder, this.ambientLight);
        this.coinsHolder = new CoinsHolder(20, this.airplane, this.particlesHolder);

        this.init();
    }

    init() {
        this.createLights();
        this.createSea();
        this.createSky();
        this.createAirplane();
        this.createEnemies();
        this.createCoins();
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
        this.sea.mesh.position.y = -gameVar.seaRadius;;
        this.scene.add(this.sea.mesh);
    }

    createSky() {
        this.sky = new Sky();
        this.sky.mesh.position.y = -gameVar.seaRadius;
        this.scene.add(this.sky.mesh);
    }

    createAirplane() {
        this.airplane.mesh.scale.set(0.25, 0.25, 0.25);
        this.airplane.mesh.position.y = gameVar.planeDefaultHeight;
        this.scene.add(this.airplane.mesh);
    }

    createEnemies() {
        for (let i = 0; i < 10; i++) {
            const enemy = new Enemy();
            this.enemiesHolder.enemiesPool.push(enemy);
        }
        this.scene.add(this.enemiesHolder.mesh);
    }

    createCoins(){
        this.scene.add(this.coinsHolder.mesh)
    }

    createParticles(){
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
        gameVar.planeSpeed = this.normalize(this.mousePos.x,-.5,.5,gameVar.planeMinSpeed, gameVar.planeMaxSpeed);
        let targetY = this.normalize(this.mousePos.y,-.75,.75,gameVar.planeDefaultHeight-gameVar.planeAmpHeight, gameVar.planeDefaultHeight+gameVar.planeAmpHeight);
        let targetX = this.normalize(this.mousePos.x,-1,1,-gameVar.planeAmpWidth*.7, -gameVar.planeAmpWidth);
      
        gameVar.planeCollisionDisplacementX += gameVar.planeCollisionSpeedX;
        targetX += gameVar.planeCollisionDisplacementX;
      
      
        gameVar.planeCollisionDisplacementY += gameVar.planeCollisionSpeedY;
        targetY += gameVar.planeCollisionDisplacementY;
      
        this.airplane.mesh.position.y += (targetY-this.airplane.mesh.position.y)*gameVar.deltaTime*gameVar.planeMoveSensivity;
        this.airplane.mesh.position.x += (targetX-this.airplane.mesh.position.x)*gameVar.deltaTime*gameVar.planeMoveSensivity;
      
        this.airplane.mesh.rotation.z = (targetY-this.airplane.mesh.position.y)*gameVar.deltaTime*gameVar.planeRotXSensivity;
        this.airplane.mesh.rotation.x = (this.airplane.mesh.position.y-targetY)*gameVar.deltaTime*gameVar.planeRotZSensivity;

        this.camera.fov = this.normalize(this.mousePos.x,-1,1,40, 80);
        this.camera.updateProjectionMatrix ()
        this.camera.position.y += (this.airplane.mesh.position.y - this.camera.position.y)*gameVar.deltaTime*gameVar.cameraSensivity;
      
        gameVar.planeCollisionSpeedX += (0-gameVar.planeCollisionSpeedX)*gameVar.deltaTime * 0.03;
        gameVar.planeCollisionDisplacementX += (0-gameVar.planeCollisionDisplacementX)*gameVar.deltaTime *0.01;
        gameVar.planeCollisionSpeedY += (0-gameVar.planeCollisionSpeedY)*gameVar.deltaTime * 0.03;
        gameVar.planeCollisionDisplacementY += (0-gameVar.planeCollisionDisplacementY)*gameVar.deltaTime *0.01;
        this.airplane.pilot.updateHairs();
    }

    normalize(v, vmin, vmax, tmin, tmax) {
        let nv = Math.max(Math.min(v, vmax), vmin);
        let dv = vmax - vmin;
        let pc = (nv - vmin) / dv;
        let dt = tmax - tmin;
        let tv = tmin + (pc*dt);
        return tv;
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

        if (Math.floor(gameVar.distance)%gameVar.distanceForCoinsSpawn == 0 && Math.floor(gameVar.distance) > gameVar.coinLastSpawn){
            gameVar.coinLastSpawn = Math.floor(gameVar.distance);
            this.coinsHolder.spawnCoins();
        }
      
        if (Math.floor(gameVar.distance)%gameVar.distanceForSpeedUpdate == 0 && Math.floor(gameVar.distance) > gameVar.speedLastUpdate){
            gameVar.speedLastUpdate = Math.floor(gameVar.distance);
            gameVar.targetBaseSpeed += gameVar.incrementSpeedByTime*gameVar.deltaTime;
        }

        if (Math.floor(gameVar.distance) % gameVar.distanceForEnnemiesSpawn === 0 && Math.floor(gameVar.distance) > gameVar.enemyLastSpawn) {
            gameVar.enemyLastSpawn = Math.floor(gameVar.distance);
            this.enemiesHolder.spawnEnemies();
        }

        if (Math.floor(gameVar.distance)%gameVar.distanceForLevelUpdate == 0 && Math.floor(gameVar.distance) > gameVar.levelLastUpdate){
            gameVar.levelLastUpdate = Math.floor(gameVar.distance);
            gameVar.level++;
            // fieldLevel.innerHTML = Math.floor(game.level);
    
            gameVar.targetBaseSpeed = gameVar.initSpeed + gameVar.incrementSpeedByLevel*gameVar.level
        }

        gameVar.baseSpeed += (gameVar.targetBaseSpeed - gameVar.baseSpeed) * gameVar.deltaTime * 0.02;
        gameVar.speed = gameVar.baseSpeed * gameVar.planeSpeed;

        this.airplane.propeller.rotation.x +=.2 + gameVar.planeSpeed * gameVar.deltaTime*.005;
        this.sea.mesh.rotation.z += gameVar.speed*gameVar.deltaTime;//*game.seaRotationSpeed;

        if ( this.sea.mesh.rotation.z > 2*Math.PI)  this.sea.mesh.rotation.z -= 2*Math.PI;

        this.ambientLight.intensity += (.5 - this.ambientLight.intensity)*gameVar.deltaTime*0.005;

        this.coinsHolder.rotateCoins();
        this.enemiesHolder.rotateEnemies();

        this.renderer.render(this.scene, this.camera);

        // Recursively call the loop
        requestAnimationFrame(this.loop.bind(this));
    }
}

// Start the gameVar when the window loads
window.addEventListener('load', () => new Game(), false);
