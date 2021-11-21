
import {  RouteProps} from 'react-router-dom';
import Head from '../component/head/head';
import IntersectHighlights from '../component/IntersectHighlights';
import { TodoService, useTodoService } from '../provider/provider';
import Hero from '../view/hero/hero';
import HeroDetail from '../view/hero/hero-detail/hero-detail';
import Home from '../view/home/home';
import Login from '../view/login';
import Physic from '../view/physic';
import { Shader } from '../view/shader';
import RouterView from './router-view';
import './style.scss'
const links = [
    'home',
    'hero',
    'shader',
    'physic'
]
const routes: Array<RouteProps> = [
    {
        component: Home,
        path: '/home',
        exact: true
    },
    {
        component: Physic,
        path: '/physic',
        exact: true
    },
    {
        component:Shader,
        path: '/shader',
        children: [
            {
                component:IntersectHighlights,
                path:'/shader/intersect'
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
        <TodoService.Provider value={useTodoService()}>
                    <div className="full-screen">
            <Head data={links}></Head>
            <div className="container">
                <RouterView routes={routes}></RouterView>
            </div>

        </div>
        </TodoService.Provider>

    )
}