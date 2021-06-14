import { Scene, OrthographicCamera, WebGLRenderer,FogExp2, DirectionalLight, 
    AmbientLight, Camera, CylinderGeometry, Mesh, MeshPhongMaterial } from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
interface WordProp{
    container: HTMLDivElement;
}
export class Word{
    scene!: Scene;
    orthographicCamera!: OrthographicCamera;
    renderer!: WebGLRenderer;
    width: number;
    height: number;
    container: HTMLDivElement;
    controls!: TrackballControls;
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
        this.orthographicCamera = new OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
        this.orthographicCamera.position.z = 500;
        // world
        // scene.fog = new FogExp2( 0xcccccc, 0.002 );
        //light
        const dirLight1 = new DirectionalLight( 0xffffff );
        dirLight1.position.set( 1, 1, 1 );
        scene.add( dirLight1 );
        const dirLight2 = new DirectionalLight( 0x002288 );
        dirLight2.position.set( - 1, - 1, - 1 );
        scene.add( dirLight2 );
        const ambientLight = new AmbientLight( 0x222222 );
        scene.add( ambientLight );
        //renderer
        renderer.setSize(width,height);
        container.appendChild(renderer.domElement);
        window.addEventListener('resize', this.onWindowResize);
        //control
        this.createControl(this.orthographicCamera)
    }

    createControl(camera:Camera){
        const {renderer} = this;
        this.controls = new TrackballControls( camera, renderer.domElement );
        const {controls} = this;
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
    }

    onWindowResize(){
        const {width,height,controls,renderer,orthographicCamera} = this;
        orthographicCamera.updateProjectionMatrix();
        renderer.setSize( width, height );
        controls.handleResize();
    }

    render(){
        const{renderer,scene,orthographicCamera} = this;
        renderer.render(scene,orthographicCamera);
    }

    animate(){
        const {controls} = this;
        this.animtion = requestAnimationFrame( this.animate.bind(this) );
        controls.update();
        this.render();
    }

    addMesh(){
        const {scene} = this;
        const geometry = new CylinderGeometry( 0, 10, 30, 4, 1 );
        const material = new MeshPhongMaterial( { color: 0xffffff, flatShading: true } );

        for ( let i = 0; i < 500; i ++ ) {

            const mesh = new Mesh( geometry, material );
            mesh.position.x = ( Math.random() - 0.5 ) * 1000;
            mesh.position.y = ( Math.random() - 0.5 ) * 1000;
            mesh.position.z = ( Math.random() - 0.5 ) * 1000;
            mesh.updateMatrix();
            mesh.matrixAutoUpdate = false;
            scene.add( mesh );

        }
    }
    
} 