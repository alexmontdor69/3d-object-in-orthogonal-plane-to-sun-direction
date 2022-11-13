import {React, Component} from 'react';
import Point from '../Point/Point';
import Segment from '../Segment/Segment';
import './Board.css'
import models from '../Models/models';
import ReactSelect from 'react-select';
import SolarPlaneCalculator from '../solar-plane-calculator/solar-plane-calculator';
import SunPositionIndicator from '../SunPositionIndicator/SunPositionIndicator';

class Board extends Component { 
    constructor (){
        super()
        this.sunAzimuth=this.degToRad(30,-180) // => 30 degC
        this.objAzimuth=this.degToRad(0,-90) // => 90 degC
        this.elevation=this.degToRad(30,-90)// Zenith

        //this.model = []
        
        this.state={
            initializing:true,
            points:[],
            segments : [],
            sunAzimuth :this.sunAzimuth,
            objAzimuth :this.objAzimuth,
            elevation : this.elevation
        }
        this.options=Object.keys(models).map(value=>({value,label:models[value].name}))
        
    }

    selectModelFrom= (choice)=> {
        console.log (`Display the model ${choice}`)

        this.model=new SolarPlaneCalculator(models[choice], this.objAzimuth, this.sunAzimuth, this.elevation)
        const refModelShape = this.model.getRefModelShape(4)
        this.setState({initializing:false,refModelShape},this.handleXY)
    }

    handleObjAzimuth=(event)=>{
        this.objAzimuth=this.degToRad(parseInt(event.target.value),-90)
        this.model.setObjAzimuth (this.objAzimuth)
        const refModelShape = this.model.getRefModelShape(4)
        this.setState({refModelShape},this.handleXY)
    }

    handleSunAzimuth=(event)=>{
        this.sunAzimuth=this.degToRad(parseInt(event.target.value),-180)
        this.model.setSunAzimuth (this.sunAzimuth)
        this.handleXY()
    }

    handleElevation=(event)=>{
        this.elevation=this.degToRad(parseInt(event.target.value),-90)
        this.model.setElevation(this.elevation)
        this.handleXY()
    }

    resetHandleXY = ()=>{
        console.log ('Reset Angles')
        
        this.sunAzimuth=this.degToRad(180,-180) // => 30 degC
        this.objAzimuth=this.degToRad(90,-90) // => 90 degC
        this.elevation=this.degToRad(90,-90)// Zenith
        this.model.setObjAzimuth (this.objAzimuth)
        this.model.setSunAzimuth (this.sunAzimuth)
        this.model.setElevation(this.elevation)
        const refModelShape = this.model.getRefModelShape(4)
        this.setState({refModelShape},this.handleXY)
    }

    resetHandleXZ = ()=>{
        console.log ('Reset Angles')
        
        this.sunAzimuth=this.degToRad(180,-180) // => 30 degC
        this.objAzimuth=this.degToRad(90,-90) // => 90 degC
        this.elevation=this.degToRad(0,-90)// Zenith
        this.model.setObjAzimuth (this.objAzimuth)
        this.model.setSunAzimuth (this.sunAzimuth)
        this.model.setElevation(this.elevation)
        const refModelShape = this.model.getRefModelShape(4)
        this.setState({refModelShape},this.handleXY)
    }

    resetHandleYZ = ()=>{
        console.log ('Reset Angles')
        
        this.sunAzimuth=this.degToRad(180,-180) // => 30 degC
        this.objAzimuth=this.degToRad(180,-90) // => 90 degC
        this.elevation=this.degToRad(0,-90)// Zenith
        this.model.setObjAzimuth (this.objAzimuth)
        this.model.setSunAzimuth (this.sunAzimuth)
        this.model.setElevation(this.elevation)
        const refModelShape = this.model.getRefModelShape(4)
        this.setState({refModelShape},this.handleXY)
    }

    isPeripheral =(index, references) => {
        return references && references.length >0 && references.some(id=>id===index.toString())
    }
    handleXY (){
        console.log ('==========================') 

        let points =this.model.getPoints()
        const pointIndexes =this.model.getPeripheralPointIndexes()
        points=points.map((point,index)=>({...point, color :this.isPeripheral(index,pointIndexes)?'orange':''}))

        const segments =this.model.getSegments()

        console.log ('__Display the model')
        this.setState({
            points, 
            segments, 
            elevation: this.elevation,
            sunAzimuth: this.sunAzimuth,
            objAzimuth: this.objAzimuth
        })
    }



    radToDeg=(a,offset=0)=>{
        return offset+Math.floor((a) /Math.PI*180)
    }

    degToRad=(a,offset=0)=>{
        let angle = a+offset
        angle =angle/180*Math.PI
        return angle
    }

    render () {
        return(
        <>
         <ReactSelect options={this.options} onChange={(model)=>this.selectModelFrom(model.value)}/>
            {this.state.initializing?
                <div>Initializing Boards</div> :

                <>
                    <div>
                        <div className ="configurator">
                            <h3>Object Azimut</h3>
                            <input id="objAzimuthHandler" 
                            type="range" 
                            min="0" max="360" 
                            value={this.radToDeg(this.state.objAzimuth,90)} 
                            onChange={this.handleObjAzimuth}
                            step="2"/>
                        </div>
                        <div className ="configurator">
                            <h3>Sun Azimut</h3>
                            <input id="sunAzimuthHandler" 
                            type="range" 
                            min="0" max="360" 
                            value={this.radToDeg(this.state.sunAzimuth,180)} 
                            onChange={this.handleSunAzimuth}
                            step="2"/>
                        </div>
                        <div className ="configurator">
                            <h3>Sun Elevation</h3>
                            <input id="elevationHandler" 
                            type="range" 
                            min="0" max="90" 
                            value={this.radToDeg(this.state.elevation,90)} 
                            onChange={this.handleElevation}
                             step="1" />
                        </div>
                        <div className ="configurator">
                            <h3>Reset</h3>
                            <button onClick={this.resetHandleXY}>XY plane</button>
                            <button onClick={this.resetHandleXZ}>XZ plane</button>
                            <button onClick={this.resetHandleYZ}>YZ plane</button>
                        </div>
                        

                    </div>
                    <div>
                        <svg height = "600" width ="900" viewBox="-20 -20 70 70" xmlns="http://www.w3.org/2000/svg">
                            {this.state.segments.map((points,index)=> <Segment points={points} key={"s"+this.state.segments.length+this.state.points.length+index}/>)}
                            {this.state.points.map((point,index)=> <Point point={point} key={"p"+this.state.segments.length+this.state.points.length+index}/>)}
                            <SunPositionIndicator 
                                sunAzimuth={this.state.sunAzimuth} 
                                objAzimuth={this.state.objAzimuth} 
                                elevation = {this.state.elevation}
                                shape = {this.state.refModelShape}/>
                        </svg>
                    </div>
                </>
    }
        </>
        )
    }
        
    
}

export default Board;