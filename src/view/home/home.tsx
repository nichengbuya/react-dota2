import { Component } from 'react';
import { } from 'three';
import * as THREE from 'three';
import World from '../../component/hero-show/world';
import './home.scss'
import { pointShader } from '../../component/hero-show/shader/point';
export default class Home extends Component<any, { world: World }> {

    componentDidMount() {
        const container = document.getElementById('home') as HTMLDivElement;
        this.setState({
            world: new World({ container })
        }, () => {
            this.init()
        })

    }
    init() {
        const { world } = this.state;
        const { scene , uniforms} = world;
        var planeGeom = new THREE.PlaneGeometry(1000, 1000, 100, 100);

        var planeMate = new THREE.ShaderMaterial({
            transparent: true,
            side: THREE.DoubleSide,
            uniforms: uniforms,
            vertexShader: pointShader.vertexShader,
            fragmentShader: pointShader.fragmentShader
        })
        var planeMesh = new THREE.Points(planeGeom, planeMate);
        planeMesh.rotation.x = - Math.PI / 2;
        scene.add(planeMesh);
    }
    render() {
        return (
            <div id="home"></div>
        )
    }
}