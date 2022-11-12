import {React, Component} from 'react';
import Point from '../Point/Point';
import Segment from '../Segment/Segment';
import './Board.css'
import convexHull from 'convex-hull';
import models from '../Models/models';
import ReactSelect from 'react-select';

class Board extends Component { 
    constructor (){
        super()
        this.sunAzimuth=this.degToRad(30,-180) // => 30 degC
        this.objAzimuth=this.degToRad(0,-90) // => 90 degC
        this.elevation=this.degToRad(30,-90)// Zenith

        this.initSegment=[]
        this.initModel=[]
        
        this.state={
            initializing:true,
            model:[],
            segments : [],
            sunAzimuth :this.sunAzimuth,
            objAzimuth :this.objAzimuth,
            elevation : this.elevation
        }
        this.options=Object.keys(models).map(value=>({value,label:models[value].name}))
        
    }

    componentDidMount(){

        // initialization
        this.selectModelFrom('treePoints')
        
    }
s
    selectModelFrom= (choice)=> {
        console.log (`Display the model ${choice}` ,choice)
        this.initSegment=models[choice].segments
        this.initModel=models[choice].points
        this.objConfig={
            width:models[choice].width,
            depth:models[choice].depth,
            height:models[choice].height,
        }
        this.handleXY()
    }

    transpose(array){
        return  array[0].map((_, colIndex) => array.map(row => row[colIndex]));
    }

    multiply(a, b) {
        let aNumRows = a.length, aNumCols = a[0].length,
            bNumRows = b.length, bNumCols = b[0].length,
            m = new Array(aNumRows);  // initialize array of rows
        for (let r = 0; r < aNumRows; ++r) {
          m[r] = new Array(bNumCols); // initialize the current row
          for (let c = 0; c < bNumCols; ++c) {
            m[r][c] = 0;             // initialize the current cell
            for (let i = 0; i < aNumCols; ++i) {
              m[r][c] += a[r][i] * b[i][c];
            }
          }
        }
        return m;
      }
    
    handleIncreaseObjAzimuth = ()=>{
        this.objAzimuth +=5/180*Math.PI
        this.setState({objAzimuth:this.objAzimuth},this.handleXY)   
    }

    handleDecreaseObjAzimuth = ()=>{
        this.objAzimuth -=5/180*Math.PI
        this.setState({ objAzimuth:this.objAzimuth},this.handleXY)   
    }

    handleIncreaseSunAzimuth = ()=>{
        this.sunAzimuth +=5/180*Math.PI
        this.setState({ sunAzimuth:this.sunAzimuth},this.handleXY)   
    }

    handleDecreaseSunAzimuth = ()=>{
        this.sunAzimuth -=5/180*Math.PI
        this.setState({ sunAzimuth:this.sunAzimuth},this.handleXY)   
    }

    handleDecreaseElevation  = ()=>{
        this.elevation -= 1/180*Math.PI
        this.setState({elevation:this.elevation},this.handleXY)   
    }

    handleIncreaseElevation  = ()=>{
        this.elevation += 1/180*Math.PI
        this.setState({elevation:this.elevation},this.handleXY)   
    }

    rotate =(model)=>{
        const cosSAz=Math.cos(this.sunAzimuth)
        const sinSAz=Math.sin(this.sunAzimuth)
        
        const cosEl=Math.cos(this.elevation)
        const sinEl=Math.sin(this.elevation)
        // rotation Matrix around Z for Azimut
        const ZAz= [
            [cosSAz,-sinSAz,0],
            [sinSAz,cosSAz,0],
            [0,0,1]];
        // rotation Matrix around X for Elevation
        const X= [
            [1,0,0],
            [0,cosEl,-sinEl],
            [0,sinEl,cosEl]]; 
        
        const ZAzT=this.transpose(ZAz)
        const XT=this.transpose(X)

        const rotationMAtrix = this.multiply( XT,ZAzT)

        return model.map(point=>this.multiply(rotationMAtrix, point)).map(point=>({x:point[0], y:point[1], z:point[2], color:''}))
    }  

    updateModel = ()=> {
        console.log ('Rotate orthogonal plane to sun beam (azimuth and elevation)')
        let model = this.rotate(this.refModel)
        const zone = this.selectPoints(model)
        const points=  [... new Set(zone.join().split(','))]
        console.log (`... Detect ${points.length} peripheral point (orange)`)
        points.map((index)=> {model[index]= {...model[index], 'color' :'orange'}})
        return model
    }

    updateSegments = (model)=>{
        let segments = this.initSegment.map((points)=>([model[points[0]],model[points[1]]]))  
        console.log (`Create ${segments.length} Segments`)
        return segments
    }

    resetHandleXY = ()=>{
        console.log ('Reset Angles')
        
        this.sunAzimuth=this.degToRad(180,-180) // => 30 degC
        this.objAzimuth=this.degToRad(90,-90) // => 90 degC
        this.elevation=this.degToRad(90,-90)// Zenith
        this.setState({
            sunAzimuth:this.sunAzimuth,
            objAzimuth:this.objAzimuth,
            elevation:this.elevation
        }, this.handleXY())
    }

    handleXY = () =>{
        console.log ('_____________________________________') 
        console.log (`Create a reference ${this.initModel.length} points Model to dimension W, D, P`, 
        this.objConfig.width,
        this.objConfig.depth, 
        this.objConfig.height)
        this.refModel=this.initModel.map(point=>({ 
            x:point.x*this.objConfig.width, 
            y:-point.y*this.objConfig.depth, 
            z:point.z*this.objConfig.height
        }))

        console.log (`... Position object as per its angle`)
        const cosOAz=Math.cos(this.objAzimuth)
        const sinOAz=Math.sin(this.objAzimuth)

        let ZObj= [
            [cosOAz,-sinOAz,0],
            [sinOAz,cosOAz,0],
            [0,0,1]];
        
        this.refModel = this.refModel
                            .map(point=>([[point.x],[point.y],[point.z]]))
                            .map(point=>this.multiply(ZObj,point))

        const model=this.updateModel()
        const segments =this.updateSegments(model)

        console.log ('... Display the model')
        this.setState({model, segments, initializing:false})
    }

    formatZone=(model)=>{
        //console.log ('... Format Zone info')
        let zone = model.map(point=>([point.x[0], point.y[0]]))
        return zone
    }

    selectPoints= (model)=>{
        let zone = this.formatZone(model)
        const convexHullZone=convexHull(zone)
        return convexHullZone        
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
                    </div>
                    <div>
                        <svg viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg">
                            {this.state.segments.map((points,index)=> <Segment points={points} key={"s"+this.state.segments.length+this.state.model.length+index}/>)}
                            {this.state.model.map((point,index)=> <Point point={point} key={"p"+this.state.segments.length+this.state.model.length+index}/>)}
                        </svg>
                    </div>
                </>
    }
        </>
        )
    }
        
    
}

export default Board;