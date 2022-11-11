import _ from 'lodash';
import {React, Component} from 'react';
import './Point.css'


class Point extends Component{
    //coordinates
    constructor(props){
        super(props)
        this.state={
            x:props.point.x,
            y:props.point.y,
            z:props.point.z
        }
    }

     componentDidUpdate (nextProps){
        if (!_.isEqual(this.state,nextProps.point))
            {
                this.setState ({
                    x:nextProps.point.x,
                    y:nextProps.point.y,
                    z:nextProps.point.z,
                })
            }
    } 
    
    render (){
        return (
            <circle cx={this.state.x} cy={this.state.y} r={1} />
            )
        }
}
export default Point