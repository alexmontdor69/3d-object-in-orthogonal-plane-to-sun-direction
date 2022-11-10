import {React, Component} from 'react';
import './Point.css'

class Point extends Component{
    //coordinates
    constructor(props){
        super(props)
        this.state={
            x:props.point.x*10,
            y:props.point.y*10,
            z:props.point.z*10
        }
    }

     componentDidUpdate (nextProps){
        if (this.state.x!=nextProps.point.x*10 || this.state.y!=nextProps.point.y*10 ||this.state.z!=nextProps.point.z*10)
            {
                this.setState ({
                    x:nextProps.point.x*10,
                    y:nextProps.point.y*10,
                    z:nextProps.point.z*10,
                })  
                console.log (this.state, nextProps)
            }
    } 
    render (){
        return (
            <circle cx={this.state.x} cy={this.state.y} r={1} />
            )
        }
}
export default Point