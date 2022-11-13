import _ from 'lodash';
import {React, Component} from 'react';
import Segment from '../Segment/Segment';
import Sun from './Sun';

class SunPositionIndicator extends Component { 
    constructor (props) {
        super(props)
        this.state = {
            objAzimuth:this.props.objAzimuth, 
            sunAzimuth:this.props.sunAzimuth, 
            elevation:this.props.elevation,
            shape:this.props.shape
        }
    }
    componentDidUpdate (prevProps){
        if (!_.isEqual(prevProps.sunAzimuth,this.props.sunAzimuth)||!_.isEqual(prevProps.elevation,this.props.elevation)){
            this.setState({
                sunAzimuth:this.props.sunAzimuth, 
                elevation:this.props.elevation
            })
        }
        if (!_.isEqual(prevProps.objAzimuth,this.props.objAzimuth)||!_.isEqual(prevProps.shape,this.props.shape)){
            this.setState({
                shape:this.props.shape, 
                objAzimuth:this.props.objAzimuth, 
            })
        }
    }
    radToDeg=(a,offset=0)=>{
        return offset+Math.floor((a) /Math.PI*180)
    }
    isLargeAngle(angle){
        return angle<= 180?"0":"1"
    }

    render(){
        return(<>
            {this.state.shape.map((points,index)=> <Segment points={points} refX={0} refY={20} key={"shape1-"+index}/>)}
            <text 
                    x="-10" 
                    y="31"
                    style={{fontSize: "2px"}}>
                    Object Azimuth : {this.radToDeg(this.state.objAzimuth,90)}</text>

            <circle cx={20} cy={20} r={5} stroke={'grey'} strokeWidth={0.5} fill={'none'}/>
            <text 
                    x="18" 
                    y="14"
                    style={{fontSize: "2px"}}>
                    North</text>
                    <text 
                    x="18" 
                    y="28"
                    style={{fontSize: "2px"}}>
                    South</text>
                    <text 
                    x="26" 
                    y="21"
                    style={{fontSize: "2px"}}>
                    East</text>
                    <text 
                    x="10" 
                    y="21"
                    style={{fontSize: "2px"}}>
                    West</text>
                
                <path d={`M 20 15 A 5 5 0 ${this.isLargeAngle(this.radToDeg(this.state.sunAzimuth,180))} 1 ${20+5*Math.cos(this.state.sunAzimuth+3.14/2)} ${20+5*Math.sin(this.state.sunAzimuth+3.14/2)}`} 
                stroke={`purple`}
                fill={'none'}/>
                {this.state.shape.map((points,index)=> <Segment points={points} refX={20} refY={20} key={"shape1-"+index}/>)}
                <Sun centerX={20} centerY={20}
                cx={20+5*Math.cos(this.state.sunAzimuth+3.14/2)} cy={20+5*Math.sin(this.state.sunAzimuth+3.14/2)}/>
                <text 
                    x="13" 
                    y="31"
                    style={{fontSize: "2px"}}>
                    Sun Azimuth : {this.radToDeg(this.state.sunAzimuth,180)}</text>

            
            <path d={`M 45 20 A 5 5 0 0 0 
            ${40+5*Math.cos(-(3.14/2+this.state.elevation))} ${20+5*Math.sin(-(3.14/2+this.state.elevation))} 
            M ${40+5*Math.cos(-(3.14/2+this.state.elevation))} ${20+5*Math.sin(-(3.14/2+this.state.elevation))} 
            40 20 45 20`} 
                fill={`orange`}
                strokeWidth={0.5}/>
            <path d={`M 40 15 A 5 5 0 0 1 45 20 M 45 20 40 20 40 15`} 
                stroke={`grey`}
                strokeWidth={0.5}
                fill={'none'}/>
            <Sun centerX={40} centerY={20}
                cx={40+5*Math.cos(-(3.14/2+this.state.elevation))} 
                cy={20+5*Math.sin(-(3.14/2+this.state.elevation))} />
            
                <text 
                    x="35" 
                    y="31"
                    style={{fontSize: "2px"}}>
                    Sun Elevation : {this.radToDeg(this.state.elevation,(90))}</text>
        </>)
    }
}

export default SunPositionIndicator