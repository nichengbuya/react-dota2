import { Scene, OrthographicCamera, WebGLRenderer,FogExp2, DirectionalLight, 
    AmbientLight, Camera, Mesh, MeshPhongMaterial, LoadingManager, AnimationMixer, PointLight,  HemisphereLight,  PlaneGeometry, SpotLight, PerspectiveCamera  } from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { TGALoader} from 'three/examples/jsm/loaders/TGALoader';
interface WordProp{
    container: HTMLDivElement;
}
export class Word{
    scene!: Scene;
    camera!: PerspectiveCamera;
    renderer!: WebGLRenderer;
    width: number;
    height: number;
    container: HTMLDivElement;
    controls!: OrbitControls;
    animtion!: number;
    constructor(prop:WordProp){
        this.container = prop.container;
        this.width = prop.container.clientWidth;
        this.height = prop.container.clientHeight;
        this.init();
        this.animate();
    }

    init(){
        this.scene = new Scene();
        this.renderer = new WebGLRenderer( { antialias: true,alpha: true  } );
        const {width,height,scene,renderer,container} = this;
        // const aspect = width / height;
        this.camera = new PerspectiveCamera( 45,width/height, 1, 1000 );
        const {camera} = this;
        // world
        camera.position.set( 100, 200, 300 );

        // scene
        const hemiLight = new HemisphereLight( 0xffffff, 0x444444 );
        hemiLight.position.set( 0, 200, 0 );
        scene.add( hemiLight );

        const dirLight = new DirectionalLight( 0xffffff );
        dirLight.position.set( 0, 200, 100 );
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 180;
        dirLight.shadow.camera.bottom = - 100;
        dirLight.shadow.camera.left = - 120;
        dirLight.shadow.camera.right = 120;
        scene.add( dirLight );

        // ground
        const mesh = new Mesh( new PlaneGeometry( 2000, 2000 ), new MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
        mesh.rotation.x = - Math.PI / 2;
        mesh.receiveShadow = true;
        scene.add( mesh );
        renderer.setSize(width,height);
        container.appendChild(renderer.domElement);
        renderer.shadowMap.enabled = true;
        window.addEventListener('resize',()=>{this.onWindowResize()});
        //control
        this.createControl(this.camera)
    }

    createControl(camera:Camera){
        const {renderer} = this;
        this.controls = new OrbitControls( camera, renderer.domElement );
        const {controls} = this;
        controls.rotateSpeed = 2.0;
        controls.enablePan = false;
        controls.enableZoom = false;
        controls.enableDamping = true;
        controls.minPolarAngle = Math.PI/2.2; 
        controls.maxPolarAngle = Math.PI/2.2; 


    }

    onWindowResize(){
        const {width,height,controls,renderer,camera} = this;
        camera.updateProjectionMatrix();
        renderer.setSize( width, height );
        // controls.handleResize();
    }

    render(){
        const{renderer,scene,camera} = this;
        renderer.render(scene,camera);
    }

    animate(){
        const {controls} = this;
        this.animtion = requestAnimationFrame( this.animate.bind(this) );
        controls.update();
        this.render();
    }

    addHero(){
        const {scene} = this;
        const manager = new LoadingManager();
        manager.addHandler( /\.tga$/i, new TGALoader() );
        return new Promise((resolve,reject)=>{
            new FBXLoader(manager).setPath('/pudge/').load('pudge_econ.fbx',(object)=>{
                object.traverse( ( child:any )=> {
                    if ( child.isMesh ) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                } );
                resolve(object);
                object.scale.set(.5,.5,.5)
                scene.add( object );
            },()=>{},(err)=>{
                reject(err)
            })
        })
    }
} 