import './Segment.css'
import _ from 'lodash';
import {React, Component} from 'react';


class Segment extends Component {
    constructor (props) {
        super(props)
        this.state={
            points: this.props.points,
            refX : this.props.refX ||0,
            refY : this.props.refY ||0,
            strokeWidth :this.props.strokeWidth ||0.1,
            stroke :this.props.stroke ||"red",

        }
    }
    
    componentDidUpdate (prevProps) {
        if (!_.isEqual(prevProps.points, this.props.points)) {
            this.setState({points:this.props.points})
        }
    }

    render (){
        return (
        <line 
            x1={this.state.points[0].x+this.state.refX} 
            y1={this.state.points[0].y+this.state.refY} 
            x2={this.state.points[1].x+this.state.refX} 
            y2={this.state.points[1].y+this.state.refY}
            stroke={this.state.stroke}
            strokeWidth={this.state.strokeWidth}
            />
        )
    }
}

export default Segment