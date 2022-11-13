import './Segment.css'
import _ from 'lodash';
import {React, Component} from 'react';


class Segment extends Component {
    constructor (props) {
        super(props)
        this.state={
            points: this.props.points
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
            x1={this.state.points[0].x} 
            y1={this.state.points[0].y} 
            x2={this.state.points[1].x} 
            y2={this.state.points[1].y}
            stroke="red" />
        )
    }
}

export default Segment