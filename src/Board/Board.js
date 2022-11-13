import {React, Component} from 'react';
import Point from '../Point/Point';
import Segment from '../Segment/Segment';
import './Board.css'
import models from '../Models/models';
import ReactSelect from 'react-select';
import SolarPlaneCalculator from '../solar-plane-calculator/solar-plane-calculator';

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

    componentDidMount(){

        // initialization
        // this.selectModelFrom('treePoints')
        
    }

    selectModelFrom= (choice)=> {
        console.log (`Display the model ${choice}`)

        this.model=new SolarPlaneCalculator(models[choice], this.objAzimuth, this.sunAzimuth, this.elevation)

        this.setState({initializing:false},this.handleXY)
    }


    handleIncreaseObjAzimuth = ()=>{
        this.objAzimuth +=5/180*Math.PI
        this.model.setObjAzimuth (this.objAzimuth)
        this.handleXY()
    }

    handleDecreaseObjAzimuth = ()=>{
        this.objAzimuth -=5/180*Math.PI
        this.model.setObjAzimuth (this.objAzimuth)
        this.handleXY()
    }

    handleIncreaseSunAzimuth = ()=>{
        this.sunAzimuth +=5/180*Math.PI
        this.model.setSunAzimuth (this.sunAzimuth)
        this.handleXY()
    }

    handleDecreaseSunAzimuth = ()=>{
        this.sunAzimuth -=5/180*Math.PI
        this.model.setSunAzimuth (this.sunAzimuth)
        this.handleXY()
    }

    handleDecreaseElevation  = ()=>{
        this.elevation -= 1/180*Math.PI
        this.model.setElevation(this.elevation)
        this.handleXY()
    }

    handleIncreaseElevation  = ()=>{
        this.elevation += 1/180*Math.PI
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

        this.handleXY()
    }

    resetHandleXZ = ()=>{
        console.log ('Reset Angles')
        
        this.sunAzimuth=this.degToRad(180,-180) // => 30 degC
        this.objAzimuth=this.degToRad(90,-90) // => 90 degC
        this.elevation=this.degToRad(0,-90)// Zenith
        this.model.setObjAzimuth (this.objAzimuth)
        this.model.setSunAzimuth (this.sunAzimuth)
        this.model.setElevation(this.elevation)

        this.handleXY()
    }

    resetHandleYZ = ()=>{
        console.log ('Reset Angles')
        
        this.sunAzimuth=this.degToRad(180,-180) // => 30 degC
        this.objAzimuth=this.degToRad(180,-90) // => 90 degC
        this.elevation=this.degToRad(0,-90)// Zenith
        this.model.setObjAzimuth (this.objAzimuth)
        this.model.setSunAzimuth (this.sunAzimuth)
        this.model.setElevation(this.elevation)

        this.handleXY()
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
                        <button onClick={this.handleDecreaseObjAzimuth}>Object Az -5 {this.radToDeg(this.state.objAzimuth,90)}</button>
                        <button onClick={this.handleIncreaseObjAzimuth}>Object Az +5 {this.radToDeg(this.state.objAzimuth,90)}</button>
                        
                        <button onClick={this.handleDecreaseSunAzimuth}>Sun Az -5 {this.radToDeg(this.state.sunAzimuth,180)}</button>
                        <button onClick={this.handleIncreaseSunAzimuth}>Sun Az +5 {this.radToDeg(this.state.sunAzimuth,180)}</button>

                        <button onClick={this.handleDecreaseElevation}>Elevation -1 {this.radToDeg(this.state.elevation,90)}</button>
                        <button onClick={this.handleIncreaseElevation}>Elevation +1 {this.radToDeg(this.state.elevation,90)}</button>
                        
                        <button onClick={this.resetHandleXY}>XY plane</button>
                        <button onClick={this.resetHandleXZ}>XZ plane</button>
                        <button onClick={this.resetHandleYZ}>YZ plane</button>
                    </div>
                    <div>
                        <svg viewBox="-50 -50 150 150" xmlns="http://www.w3.org/2000/svg">
                            {this.state.segments.map((points,index)=> <Segment points={points} key={"s"+this.state.segments.length+this.state.points.length+index}/>)}
                            {this.state.points.map((point,index)=> <Point point={point} key={"p"+this.state.segments.length+this.state.points.length+index}/>)}
                        </svg>
                    </div>
                </>
    }
        </>
        )
    }
        
    
}

export default Board;