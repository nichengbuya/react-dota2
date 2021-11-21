import  {
    Scene, WebGLRenderer, Mesh, MeshPhongMaterial, LoadingManager, PerspectiveCamera, CylinderBufferGeometry, AnimationMixer, Clock, AmbientLight, Vector2, Color, DirectionalLight, 
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
    clock: Clock = new Clock();
    uniforms!: {
        iTime: { value: number },
        iResolution: { value: Vector2 },
        color: { value: Color },
    };
    constructor(prop: WordProp) {
        this.container = prop.container;
        this.width = prop.container.clientWidth;
        this.height = prop.container.clientHeight;
    }
    private static instance: World ;
    static getInstance(container?:any){
        if(!this.instance || container){
            this.instance = new World({container});
        }
        return this.instance;   
    }
    init() {
 
        this.scene = new Scene();
        const {scene,container,width,height} = this;

        scene.background = new Color(0xeeeeee);
        this.renderer = new WebGLRenderer( { antialias: true } );
        const {renderer} = this;
        renderer.setSize(width, height);
        container.appendChild(renderer.domElement);
        renderer.shadowMap.enabled = true;

        const ambientLight = new AmbientLight( 0x404040 );
        scene.add( ambientLight );

        const light = new DirectionalLight( 0xffffff, 1 );
        light.position.set( - 10, 10, 5 );
        light.castShadow = true;
        const d = 10;
        light.shadow.camera.left = - d;
        light.shadow.camera.right = d;
        light.shadow.camera.top = d;
        light.shadow.camera.bottom = - d;

        light.shadow.camera.near = 2;
        light.shadow.camera.far = 50;

        light.shadow.mapSize.x = 1024;
        light.shadow.mapSize.y = 1024;

        scene.add( light );
        const camera = this.camera = new THREE.PerspectiveCamera( 45, width / height, 1, 10000 );
        camera.position.set( - 50, 40, 50 );
        
        const controls = this.controls = new OrbitControls( camera, renderer.domElement );
        // controls.enablePan = false;
        // controls.enableZoom = false;
        controls.target.set( 0, 0, 0 );
        controls.update();
        this.uniforms = {
            iTime: {
                value: 0
            },
            iResolution:{
                value: new Vector2(100, 100)
            },
            color: {
                value: new Color(0x50bed7)
            }
        }
        renderer.shadowMap.enabled = true;
        window.addEventListener('resize', () => { this.onWindowResize() });
        this.animate();
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
        uniforms.iTime.value = performance.now()/1000
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