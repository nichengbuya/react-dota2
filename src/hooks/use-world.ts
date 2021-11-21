import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function World(id: string) {
    const container = document.getElementById(id);
    if (!container) return;
    const { clientWidth, clientHeight } = container;
    let camera: THREE.PerspectiveCamera, 
    scene: THREE.Object3D, 
    renderer: THREE.WebGLRenderer, 
    controls: OrbitControls;
    let target: THREE.WebGLRenderTarget;
    let postScene: THREE.Object3D, 
        postCamera: THREE.Camera, 
        postMaterial: THREE.ShaderMaterial;
    let update: number;

    const init = ()=> {
        renderer = new THREE.WebGLRenderer();

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(clientWidth, clientHeight);
        container.appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera(70,clientWidth / clientHeight, 0.01, 50);
        camera.position.z = 4;

        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        // Create a render target with depth texture
        setupRenderTarget();

        // Our scene
        setupScene();

        // Setup post-processing step
        setupPost();

        onWindowResize();
        window.addEventListener('resize', onWindowResize);
        animate();
    }

    function setupRenderTarget() {

        if (target) target.dispose();
        target = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);

        target.depthBuffer = true;
        target.depthTexture = new THREE.DepthTexture(clientWidth,clientHeight);


    }

    function setupPost(){
        postCamera = new THREE.OrthographicCamera(-1,1,1,-1,0,1);
        postMaterial = new THREE.ShaderMaterial({
            vertexShader:`
            varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
            `,
            fragmentShader:`
            #include <packing>

			varying vec2 vUv;
			uniform sampler2D tDiffuse;
			uniform sampler2D tDepth;
			uniform float cameraNear;
			uniform float cameraFar;


			float readDepth( sampler2D depthSampler, vec2 coord ) {
				float fragCoordZ = texture2D( depthSampler, coord ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
			}

			void main() {
				vec3 diffuse = texture2D( tDiffuse, vUv ).rgb;
				float depth = readDepth( tDepth, vUv );

                // gl_FragColor.rgb = 1.0 - vec3( depth );

                gl_FragColor.rgb = diffuse;
            
				gl_FragColor.a = 1.0;
			}
            `,
            uniforms:{
                cameraNear: { value: camera.near },
                cameraFar: { value: camera.far },
                tDiffuse: { value: null },
                tDepth: { value: null }
            }
        })
        const postPlane = new THREE.PlaneGeometry(2,2);
        const postQuad = new THREE.Mesh(postPlane,postMaterial);
        postScene = new THREE.Scene();
        postScene.add(postQuad);
    }
    function setupScene() {
        scene = new THREE.Scene();
        const ambient = new THREE.AmbientLight(0x444444);;
        scene.add(ambient);
        const light = new THREE.PointLight(0xffffff,1);
        light.position.set(5,5,5);
        scene.add(light)
        const geo = new THREE.BoxBufferGeometry(1,1,1);
        const mate = new THREE.MeshPhongMaterial({color:'blue'});
        const mesh = new THREE.Mesh(geo,mate)
        const mate1 = new THREE.MeshPhongMaterial({color:'red'});
        const mesh2 = new THREE.Mesh(geo,mate1);
        mesh.position.set(.5,.5,.5);
        scene.add(mesh);
        scene.add(mesh2);

    }

    function onWindowResize() {

        const aspect = clientWidth / clientHeight;
        camera.aspect = aspect;
        camera.updateProjectionMatrix();

        const dpr = renderer.getPixelRatio();
        target.setSize(clientWidth * dpr, clientHeight * dpr );
        renderer.setSize( clientWidth, clientHeight );


    }

    function animate() {

        update = requestAnimationFrame( animate );

        // render scene into target
        renderer.setRenderTarget( target );
        renderer.render( scene, camera );

        // render post FX
        postMaterial.uniforms.tDiffuse.value = target.texture;
        postMaterial.uniforms.tDepth.value = target.depthTexture;

        renderer.setRenderTarget( null );
        renderer.render( postScene, postCamera );

        controls.update(); // required because damping is enabled

    }
    function dispose(){
        cancelAnimationFrame(update);
    }
    init();
}