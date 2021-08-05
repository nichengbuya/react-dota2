import { Component } from "react";
import { debounceTime, distinctUntilChanged, Subject } from "rxjs";
import { bm } from "./bm";

export default class Search extends Component <any,any>{
    subject = new Subject<string>()
    constructor(props:any){
        super(props);
        this.state = {
            value:''
        }
    }
    componentDidMount(){
        this.subject.pipe(
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe(v=>{
            console.log(bm(v))
        })
    }
    handleValueChange(e:any){
        this.setState({value:e.target.value});
        this.subject.next(e.target.value);
    }
    render() {
        return(
            <input type="text" value={this.state.value} onChange={this.handleValueChange.bind(this)}/>
        )
    }
}