import _ from 'lodash';
import {React, Component} from 'react';
import './Point.css'


class Point extends Component{
    //coordinates
    constructor(props){
        super(props)
        this.state={
            point:this.props.point
        }
    }

    componentDidUpdate (prevProps){

        if (!_.isEqual(this.props.point,prevProps.point))
            {
                console.log (this.props.point)
                this.setState ({
                    point:this.props.point
                    
                })
            }
    } 

    render (){
        return (
        <>
            <circle cx={this.state.point.x} cy={this.state.point.y} r={1} fill={this.state.point.color||'blue'}/>
            <text 
                    x={this.state.point.x}
                    y={this.state.point.y}
                    style={{fontSize: "2px"}}>
                    {this.state.point.label}</text>
        </>
            )
        }
}
export default Point