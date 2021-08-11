import  {
    Scene, WebGLRenderer, Mesh, MeshPhongMaterial, LoadingManager, HemisphereLight, PerspectiveCamera, CylinderBufferGeometry, AnimationMixer, Clock, 
} from 'three';
import * as THREE  from　 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader';
interface WordProp {
    container: HTMLDivElement;
}
export default class World {
    scene!: Scene;
    camera!: PerspectiveCamera;
    renderer!: WebGLRenderer;
    width: number;
    height: number;
    container: HTMLDivElement;
    controls!: OrbitControls;
    animtion!: number;
    mixer!: AnimationMixer;
    clock: Clock;
    uniforms!: { time: { value: number; }; };
    constructor(prop: WordProp) {
        this.container = prop.container;
        this.width = prop.container.clientWidth;
        this.height = prop.container.clientHeight;
        this.clock = new Clock();
        this.init();
        this.animate();
    }

    init() {
 
        this.scene = new Scene();
        const {scene,container,width,height} = this;

        const hemiLight = new HemisphereLight( 0xffffff, 0x444444 );
        hemiLight.position.set( 0, 20, 0 );
        scene.add( hemiLight );

        this.renderer = new WebGLRenderer( { antialias: true } );
        const {renderer} = this;
        renderer.setSize(width, height);
        container.appendChild(renderer.domElement);
        renderer.shadowMap.enabled = true;


        const camera = this.camera = new THREE.PerspectiveCamera( 45, width / height, 1, 10000 );
        camera.position.set( - 50, 40, 50 );

        const controls = this.controls = new OrbitControls( camera, renderer.domElement );
        // controls.enablePan = false;
        // controls.enableZoom = false;
        controls.target.set( 0, 0, 0 );
        controls.update();
        this.uniforms = {
            time: {
                value: 0
            }
        }
        window.addEventListener('resize', () => { this.onWindowResize() });
    }


    onWindowResize() {
        const { width, height, renderer, camera } = this;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    render() {
        const { renderer, scene, camera } = this;
        renderer.render(scene, camera);
    }

    animate() {
        const { controls ,clock, mixer , uniforms } = this;
        this.animtion = requestAnimationFrame(this.animate.bind(this));
        const delta = clock.getDelta();
        if ( mixer ) mixer.update( delta )
        controls.update();
        uniforms.time.value = performance.now()/1000
        this.render();
    }

    addground(){
        const mesh = new Mesh(new CylinderBufferGeometry(40, 40, 20, 32), new MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
        mesh.position.y = -40 ;
        mesh.receiveShadow = true;
        this.scene.add(mesh);
    }
    addHero() {
        const { scene } = this;
        const manager = new LoadingManager();
        manager.addHandler(/\.tga$/i, new TGALoader());
        return new Promise((resolve, reject) => {
            new FBXLoader(manager).setPath('/pudge/').load('pudge_econ.fbx', (object) => {
                object.traverse((child: any) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                resolve(object);
                object.scale.set(.75, .75, .75);
                object.position.y = -30;
                scene.add(object);
            }, () => { }, (err) => {
                reject(err)
            })
        })
    }

    unload() {
        cancelAnimationFrame(this.animtion);
        window.removeEventListener('resize', () => { this.onWindowResize() });
    }
}