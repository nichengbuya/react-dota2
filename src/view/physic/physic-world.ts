import { Mesh, BoxGeometry, Vector3, Quaternion, Object3D, MeshPhongMaterial, TextureLoader, RepeatWrapping, Clock } from "three";
import World from "../../component/hero-show/world";
const Ammo = require('ammo.js');

export class PhysicWorld extends World {

    collisionConfiguration: any
    dispatcher: any;
    broadphase: any;
    solver: any;
    physicsWorld: any;
    rigidBodies:Object3D[] = [];
    transformAux1 = new Ammo.btTransform();
    clockTime = new Clock();
    hinge: any;
    arm!: Mesh<BoxGeometry, any>;
    constructor(props:any) {
        super(props)
        this.container = props.container;
    }
    static pinstance: PhysicWorld;
    static getInstance(container?:any){
        if(!this.pinstance || container){
            this.pinstance = new PhysicWorld({container});
        }
        return this.pinstance;    
    }
    initPhysics() {
        const gravityConstant = 9.8;
        this.collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
        this.dispatcher = new Ammo.btCollisionDispatcher(this.collisionConfiguration);
        this.broadphase = new Ammo.btDbvtBroadphase();
        this.solver = new Ammo.btSequentialImpulseConstraintSolver();
        this.physicsWorld = new Ammo.btDiscreteDynamicsWorld(this.dispatcher, this.broadphase, this.solver, this.collisionConfiguration);
        this.physicsWorld.setGravity(new Ammo.btVector3(0, - gravityConstant, 0));
    }
    createParallellepiped(sx: number, sy: number, sz: number, mass: any, pos: any, quat: any, material: any) {
        const margin = 0.05;
        const  threeObject = new Mesh(new BoxGeometry(sx, sy, sz, 1, 1, 1), material);
        const  shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));
        shape.setMargin(margin);

        this.createRigidBody(threeObject, shape, mass, pos, quat);
 
        return threeObject;
    }

    createRigidBody(threeObject: Object3D, physicsShape: any, mass: number, pos: Vector3, quat: Quaternion) {
        threeObject.position.copy(pos);
        threeObject.quaternion.copy(quat);
        
        const  transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
        const  motionState = new Ammo.btDefaultMotionState(transform);

        const  localInertia = new Ammo.btVector3(0, 0, 0);
        physicsShape.calculateLocalInertia(mass, localInertia);

        const  rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, physicsShape, localInertia);
        const  body = new Ammo.btRigidBody(rbInfo);

        threeObject.userData.physicsBody = body;

        this.scene.add(threeObject);
        if (mass > 0) {
            this.rigidBodies.push(threeObject);

            // Disable deactivation
            // 防止物体弹力过快消失

            // Ammo.DISABLE_DEACTIVATION = 4
            body.setActivationState(4);
        }

        this.physicsWorld.addRigidBody(body);

        return body;
    }
    createObjects() {
        const  pos = new Vector3();
        const  quat = new Quaternion();

        // 创建地面 
        pos.set(0, -0.5, 0);
        quat.set(0, 0, 0, 1);
        const  ground = this.createParallellepiped(40, 1, 40, 0, pos, quat, new MeshPhongMaterial({ color: 0xffffff }));
        ground.castShadow = true; 
        ground.receiveShadow = true;    
        const textureLoader = new TextureLoader();
        textureLoader.load("/textures/grid.png", function (texture) {
            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;
            texture.repeat.set(40, 40);
            ground.material.map = texture;
            ground.material.needsUpdate = texture;
        });

        const ropeLength = 4;
        const ropePos = new Vector3(0, 0, 0)

        
        const  armMass = 2;
        const  armLength = 3;
        const  pylonHeight = ropePos.y + ropeLength;
        const  baseMaterial = new MeshPhongMaterial( { color: 0x606060 } );
        pos.set( ropePos.x, 0.1, ropePos.z - armLength );
        quat.set( 0, 0, 0, 1 );
        const  base = this.createParallellepiped( 1, 0.2, 1, 0, pos, quat, baseMaterial );
        base.castShadow = true;
        base.receiveShadow = true;
        pos.set( ropePos.x, 0.5 * pylonHeight, ropePos.z - armLength );
        const  pylon = this.createParallellepiped( 0.4, pylonHeight, 0.4, 0, pos, quat, baseMaterial );
        pylon.castShadow = true;
        pylon.receiveShadow = true;
        pos.set( ropePos.x, pylonHeight + 0.2, ropePos.z - 0.5 * armLength );
        const  arm = this.arm= this.createParallellepiped( 0.4, 0.4, armLength + 0.4, armMass, pos, quat, baseMaterial );
        arm.castShadow = true;
        arm.receiveShadow = true;

        const pivotA = new Ammo.btVector3(0,pylonHeight*0.5,0);
        const pivotB = new Ammo.btVector3(0,-0.2,armLength * 0.5);
        const axis = new Ammo.btVector3(0,1,0);
        this.hinge = new Ammo.btHingeConstraint(
            pylon.userData.physicsBody,
            arm.userData.physicsBody,
            pivotA, pivotB, axis,
            axis,
            true
        );
        this.physicsWorld.addConstraint( this.hinge, true );
        for (var i = 0; i < 30; i++) {
            pos.set(Math.random(), 2 *i, Math.random());
            quat.set(0, 0, 0, 1);

            this.createParallellepiped(1, 1, 1, 1, pos, quat, baseMaterial);
        }
    }

    render(){
        super.render();
        const  deltaTime = this.clockTime.getDelta();
        this.updatePhysics(deltaTime);
    }

     updatePhysics(deltaTime:number) {
         if(this.hinge){
            this.hinge.enableAngularMotor( true, 1.5 * 1, 50 );
         }

        this.physicsWorld.stepSimulation(deltaTime);
        this.physicsWorld.contactTest(this.arm.userData.physicsBody,(res:any)=>{
            console.log(res)
        })
        // 更新物体位置
        for (let  i = 0; i< this.rigidBodies.length;  i++ ){
            const  objThree = this.rigidBodies[i];
            const  objPhys = objThree.userData.physicsBody;
            const  ms = objPhys.getMotionState();
            if (ms) {
                ms.getWorldTransform(this.transformAux1);
                const  p = this.transformAux1.getOrigin();
                const  q = this.transformAux1.getRotation();
                objThree.position.set(p.x(), p.y(), p.z());
                objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
            }
        }
    }
}