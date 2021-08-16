
import {  RouteProps} from 'react-router-dom';
import Head from '../component/head/head';
import HeatMap from '../component/heat-map';
import Hero from '../view/hero/hero';
import HeroDetail from '../view/hero/hero-detail/hero-detail';
import Home from '../view/home/home';
import Login from '../view/login';
import { Shader } from '../view/shader';
import RouterView from './router-view';
import './style.scss'
const links = [
    'home',
    'hero',
    'shader'
]
const routes: Array<RouteProps> = [
    {
        component: Home,
        path: '/home',
        exact: true
    },
    {
        component:Shader,
        path: '/shader',
        children: [
            {
                component:HeatMap,
                path:'/shader/heat-map'
            }
        ]
          
    },
    {
        component: Login,
        path: '/path',
        exact: true
    },
    {
        component: Hero,
        path: '/hero',
        exact: true,
    },
    {
        component: HeroDetail,
        path: '/heroDetail/:id',
        exact: true,
    }
]

export default function Routers() {
    return (
        <div className="full-screen">
            <Head data={links}></Head>
            <div className="container">
                <RouterView routes={routes}></RouterView>
            </div>

        </div>
    )
}