import _ from 'lodash';
import {React, Component} from 'react';

class Sun extends Component {
    constructor (props) {
        super(props)
        this.state = {
            cx:this.props.cx, 
            cy:this.props.cy
        }
        this.centerX=this.props.centerX
        this.centerY=this.props.centerY
    }
    componentDidUpdate (prevProps){
        if (!_.isEqual(prevProps,this.props)){
            this.setState({
                cx:this.props.cx, 
                cy:this.props.cy
            })
        }
    }
    render (){
        return (<>
                <circle cx={this.state.cx} cy={this.state.cy} r={1.5} fill ={'yellow'} stroke={`black`} strokeWidth={0.1}/>
                <line x1={this.centerX} y1={this.centerY} x2={this.state.cx} y2={this.state.cy} strokeWidth={0.1} stroke={'black'}/>

            </>
        )
    }
 }
export default Sun