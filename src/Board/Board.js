import {React, Component} from 'react';
import Point from '../Point/Point';
import Segment from '../Segment/Segment';
import './Board.css'
import models from '../Models/models';
import ReactSelect from 'react-select';
import SolarPlaneCalculator from 'solar-plane-calculator';
import SunPositionIndicator from '../SunPositionIndicator/SunPositionIndicator';


class Board extends Component { 
    constructor (){
        super()
        this.sunAzimuth=this.degToRad(30,-180) // => 30 degC
        this.objAzimuth=this.degToRad(0,-90) // => 90 degC
        this.elevation=this.degToRad(30,-90)// Zenith

        //this.model = []
        
        this.state={
            rotatedObject:[],
            initializing:true,
            points:[],
            segments : [],
            sunAzimuth :this.sunAzimuth,
            objAzimuth :this.objAzimuth,
            elevation : this.elevation,
            pointIndexes : []
        }
        this.options=Object.keys(models).map(value=>({value,label:models[value].name}))
        
    }

    selectModelFrom= (choice)=> {
        console.log (`Display the model ${choice}`)
        this.choice = choice
        if (this.choice==='tree')
            this.objAzimuth=this.sunAzimuth

        this.model=new SolarPlaneCalculator(models[choice], this.objAzimuth, this.sunAzimuth, this.elevation)
        const refModelShape = this.model.getRefModelShapeByUnit(4)
        const rotatedObject = this.model.getRefModelByUnit(4)
        this.setState({initializing:false,refModelShape,rotatedObject,pointIndexes: this.model.getPeripheralPointIndexes()},this.handleXY)
    }

    handleObjAzimuth=(event)=>{  
        this.objAzimuth=this.degToRad(parseInt(event.target.value),-90)      
        if (this.choice==='tree') {
            this.sunAzimuth=this.objAzimuth
            this.model.setObjAzimuth (this.objAzimuth)
            this.model.setSunAzimuth (this.sunAzimuth)
            const refModelShape = this.model.getRefModelShapeByUnit(4)
            const rotatedObject = this.model.getRefModelByUnit(4)
            this.setState({initializing:false,refModelShape,rotatedObject},this.handleXY)
        }
        else {
            this.model.setObjAzimuth (this.objAzimuth)
            const refModelShape = this.model.getRefModelShapeByUnit(4)
            const rotatedObject = this.model.getRefModelByUnit(4)
            this.setState({initializing:false,refModelShape,rotatedObject},this.handleXY)
        }
    }

    handleSunAzimuth=(event)=>{
        this.sunAzimuth=this.degToRad(parseInt(event.target.value),-180)

        if (this.choice==='tree') {
            this.objAzimuth=this.sunAzimuth
            this.model.setObjAzimuth (this.objAzimuth)
            this.model.setSunAzimuth (this.sunAzimuth)
            const refModelShape = this.model.getRefModelShapeByUnit(4)
            const rotatedObject = this.model.getRefModelByUnit(4)
        this.setState({initializing:false,refModelShape,rotatedObject},this.handleXY)

        }
        else {
            this.model.setSunAzimuth (this.sunAzimuth)
            const refModelShape = this.model.getRefModelShapeByUnit(4)
            const rotatedObject = this.model.getRefModelByUnit(4)
        this.setState({initializing:false,refModelShape,rotatedObject},this.handleXY)

        }

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
        const refModelShape = this.model.getRefModelShapeByUnit(4)
        const rotatedObject = this.model.getRefModelByUnit(4)
        this.setState({initializing:false,refModelShape,rotatedObject},this.handleXY)
    }

    resetHandleXZ = ()=>{
        console.log ('Reset Angles')
        
        this.sunAzimuth=this.degToRad(180,-180) // => 30 degC
        this.objAzimuth=this.degToRad(90,-90) // => 90 degC
        this.elevation=this.degToRad(0,-90)// Zenith
        this.model.setObjAzimuth (this.objAzimuth)
        this.model.setSunAzimuth (this.sunAzimuth)
        this.model.setElevation(this.elevation)
        const refModelShape = this.model.getRefModelShapeByUnit(4)
        const rotatedObject = this.model.getRefModelByUnit(4)
        this.setState({initializing:false,refModelShape,rotatedObject},this.handleXY)
    }

    resetHandleYZ = ()=>{
        console.log ('Reset Angles')
        
        this.sunAzimuth=this.degToRad(180,-180) // => 30 degC
        this.objAzimuth=this.degToRad(180,-90) // => 90 degC
        this.elevation=this.degToRad(0,-90)// Zenith
        this.model.setObjAzimuth (this.objAzimuth)
        this.model.setSunAzimuth (this.sunAzimuth)
        this.model.setElevation(this.elevation)
        const refModelShape = this.model.getRefModelShapeByUnit(4)
        const rotatedObject = this.model.getRefModelByUnit(4)
        this.setState({initializing:false,refModelShape,rotatedObject},this.handleXY)
    }

    isPeripheral =(index, references) => {
        return references && references.length >0 && references.some(id=>id===index.toString())
    }

    handleXY =()=>{
        console.log ('==========================', this.state.rotatedObject) 

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
            objAzimuth: this.objAzimuth,
            pointIndexes: this.model.getPeripheralPointIndexes()
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

    render =()=> {
        return(
        <>
        <h1>3D object projected in a plane orthogonal to sun beams</h1>
        <ReactSelect options={this.options} onChange={(model)=>this.selectModelFrom(model.value)} placeholder={`Select a Model`}/>
            {this.state.initializing?
                <div className='description'>
                    <h2>Behaviour</h2>
                    The software projects the selected model in the plane orthogonal to the sun beams. The yellow points are defining the model 'external contour' in this plane, the blue points are inside the contour.
                    The projected 3D model is recalculated when the user is changing the configuration parameters.
                    <h2>Parameters</h2>
                    The user can change 3 Parameters :
                    <ul>
                        <li>Objet azimuth: The orientation of the object in the horizontal plane</li>
                        <li>Sun azimuth : The angle of the projected position of the sun in the horizontal plane</li>
                        <li>Elevation :  The angle of between the direction to the sun at the origin in the horizontal plane</li>
                    </ul>
                    There are 3 visual indicators showing the impact of each parameters.
                    <h2>Models</h2>
                    This software includes 2 models.
                    <h3>House Model</h3>
                    It is the 3D Model of an house with 4 vertical walls (dimensions :14x5 and 9x5) and a 4 slopes roof. The model includes 10 points or summits and 17 segments.
                    <h3>Tree Model</h3>
                    The tree is represented by a 2D model and an axis of rotation. The total height of the tree is 18 and its width is 5. The axis of symmetry is located at 2.5. The model includes 12 points or summits and 10 segments.

                </div> :
                <>
                    <div>
                        <div className ="configurator">
                            <h3>Object Azimuth</h3>
                            <input id="objAzimuthHandler" 
                            type="range" 
                            min="0" max="360" 
                            value={this.radToDeg(this.state.objAzimuth,90)} 
                            onChange={this.handleObjAzimuth}
                            step="2"/>
                        </div>
                        <div className ="configurator">
                            <h3>Sun Azimuth</h3>
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
                            <h3>Object View in</h3>
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