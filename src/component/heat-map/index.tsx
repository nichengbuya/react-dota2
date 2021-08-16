import { Component } from 'react';
import * as THREE from 'three';
import World from '../../component/hero-show/world';
import './style.scss';



export default class HeatMap extends Component<any, { world: World }> {

    componentDidMount() {  
        this.init();
    }
    init() {
        const container = document.getElementById('heatmap') as HTMLDivElement;
        const world = World.getInstance(container);
        world.init();
        const { scene } = world;
        const planeGeom = new THREE.PlaneBufferGeometry(200, 200);

        const planeMate = new THREE.ShaderMaterial({
            transparent: true,
            side: THREE.DoubleSide,
        })

        const planeMesh = new THREE.Mesh(planeGeom, planeMate);
        planeMesh.rotation.x = - Math.PI / 2;
        scene.add(planeMesh);
    }
    render() {
        return (
            <div id="heatmap"></div>
        )
    }
}