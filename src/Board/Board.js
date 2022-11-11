import {React, Component} from 'react';
import Point from '../Point/Point';
import Segment from '../Segment/Segment';
import './Board.css'
import convexHull from 'convex-hull';

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
}
    componentDidMount(){
        // initialization
        this.initSegment=[
            [0,1],
            [0,2],
            [0,7],
            [8,4],
            [1,3],
            [1,8],
            [2,3],
            [3,6],
            [3,9],
            [1,4],
            [4,9],
            [6,8],
            [6,9],
            [5,7],
            [5,6],
            [2,5],
            [7,8]
        ]

        this.initModel=[
            {x:0, y:0, z:0, point:'1'},
            {x:0, y:0, z:1, point:'2'},
            {x:1, y:0, z:0, point:'3'},
            {x:1, y:0, z:1, point:'4'},
            {x:.33, y:0.5, z:1.5, point:'5'},
            {x:1, y:1, z:0, point:'6'},
            {x:1, y:1, z:1, point:'7'},
            {x:0, y:1, z:0, point:'8'},
            {x:0, y:1, z:1, point:'9'},
            {x:.66, y:0.5, z:1.5, point:'10'},
        ]

        this.objConfig={
            width:14,
            depth:9,
            height:5
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


        return model.map(point=>this.multiply(rotationMAtrix, point)).map(point=>({x:point[0], y:point[1],z:point[2], color:''}))
    }  

    updateModel = ()=> {
        console.log ('Rotate plane with the reference Model')
        let model = this.rotate(this.refModel)
        const zone = this.selectPoints(model)
        const points=  [... new Set(zone.join().split(','))]
        points.map(index=> (model[index].color ='orange') )
        return model
    }

    updateSegments = (model)=>{
        console.log ('Create Segment')
        let segments = this.initSegment.map((points)=>([model[points[0]],model[points[1]]]))  
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
        console.log ('Creating a reference Model to dimension')
        this.refModel=this.initModel.map(point=>({ 
            x:point.x*this.objConfig.width, 
            y:-point.y*this.objConfig.depth, 
            z:point.z*this.objConfig.height
        }))

        console.log ('... and rotate the object')
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

        console.log ('Display the the model')
        this.setState({model, segments, initializing:false})
    }

    formatZone=(model)=>{
        console.log ('Format Zone info')
        let zone = model.map(point=>([point.x[0], point.y[0]]))
        return zone
    }

    selectPoints= (model)=>{
        console.log ('Select external points')
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
                            {this.state.segments.map((points,index)=> <Segment points={points} key={"s"+index}/>)}
                            {this.state.model.map((point,index)=> <Point point={point} key={"p"+index}/>)}
                        </svg>
                    </div>
                </>
    }
        </>
        )
    }
        
    
}

export default Board;