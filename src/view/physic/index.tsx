import { Component } from 'react';
import './style.scss';

export default class Physic extends Component{
    container!: HTMLDivElement | null;

    render(){
        return (
            <div ref={c=>this.container = c} id='physic'></div>
        )
    }

}