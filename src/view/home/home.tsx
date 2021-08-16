import { Component } from 'react';
import * as THREE from 'three';
import World from '../../component/hero-show/world';
import { heatMapShader } from '../../shader/heat-map-shader';
import './home.scss';



export default class Home extends Component<any, { world: World }> {

    componentDidMount() {     
        this.init();
    }
    init() {
        const segments = 30
        const w = 256
        const h = 256
    
        // 随机给出温度值 储存在2维数组
        let getTemperature = ()=> {
          let  temperatureArray=[];
          for(let i = 0; i < segments; i++) {
              temperatureArray[i] = Math.floor(Math.random() * 25 + 10)
          }
          return temperatureArray
        }
    
        // 绘制辐射圆
        let drawCircular = (context: CanvasRenderingContext2D,opts: { x: any; y: any; radius: number; weight: number; }) => {
          let {x, y, radius, weight} = opts;
          radius = radius * weight;
    
          // 创建圆设置填充色
          let rGradient = context.createRadialGradient(x, y, 0, x, y, radius)
          rGradient.addColorStop(0, "rgba(255, 0, 0, 1)")
          rGradient.addColorStop(1, "rgba(0, 255, 0, 0)")
          context.fillStyle = rGradient
    
          // 设置globalAlpha
          context.globalAlpha = weight
          context.beginPath()
          context.arc(x, y, radius, 0, 2 * Math.PI)
          context.closePath()
    
          context.fill()
        }
    
        let getPaletteMap = () => {
          //颜色条的颜色分布
          let colorStops = new Map([
              [1.0, "#f00"],
              [0.8, "#e2fa00"],
              [0.6, "#33f900"],
              [0.3, "#0349df"],
              [0.0, "#fff"]
          ])
    
          //颜色条的大小
          let width = 256, height = 10
    
          // 创建canvas
          let paletteCanvas = document.createElement("canvas")
          paletteCanvas.width = width
          paletteCanvas.height = height
          paletteCanvas.style.position = 'absolute'
          paletteCanvas.style.top = '0'
          paletteCanvas.style.right = '0'
          let ctx = paletteCanvas.getContext("2d") as CanvasRenderingContext2D ;
    
          // 创建线性渐变色
          let linearGradient = ctx.createLinearGradient(0, 0, width, 0)
          for (const [key,value] of colorStops.entries()) {
              linearGradient.addColorStop(key, value)
          }
    
          // 绘制渐变色条
          ctx.fillStyle = linearGradient
          ctx.fillRect(0, 0, width, height)
    
          document.body.appendChild(paletteCanvas)
    
          let paletteTexture = new THREE.Texture(paletteCanvas)
          paletteTexture.minFilter = THREE.NearestFilter
          paletteTexture.needsUpdate = true
    
          return paletteTexture
        }
    
        // 获取透明度阶梯图
        let getAlphaScaleMap = (width: number,height: number) => {
            let canvas = document.createElement("canvas")
            canvas.width = width
            canvas.height = height
    
            let context = canvas.getContext("2d") as CanvasRenderingContext2D ;
    
            // 随机生成温度
            let tenperature = getTemperature()
    
            // 绘制透明度阶梯图
            for(let i = 0; i < segments; i++) {
    
              // 计算出当前温度占标准温度的权值
              let weight = tenperature[i] / 35
    
              drawCircular(context,{
                  x: Math.random() * w,
                  y: Math.random() * h,
                  radius: 80,
                  weight: weight
              })
            }
    
            let tex = new THREE.Texture(canvas)
            tex.minFilter = THREE.NearestFilter
            tex.needsUpdate = true
            return tex
        }
    
        const container = document.getElementById('home') as HTMLDivElement;
        const world = World.getInstance(container);
        world.init();
        const { scene } = world;
        const planeGeom = new THREE.PlaneBufferGeometry(200, 200);

        const planeMate = new THREE.ShaderMaterial({
            transparent: true,
            side: THREE.DoubleSide,
            uniforms: {
                'alphaScaleMap' : {
                  value: getAlphaScaleMap(w, h)
                },
                'paletteMap' : {
                  value: getPaletteMap()
                }
            },
            vertexShader: heatMapShader.vertexShader,
            fragmentShader: heatMapShader.fragmentShader
        })

        const planeMesh = new THREE.Mesh(planeGeom, planeMate);
        planeMesh.rotation.x = - Math.PI / 2;
        scene.add(planeMesh);
    }
    render() {
        return (
            <div id="home"></div>
        )
    }
}