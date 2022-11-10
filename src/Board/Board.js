import {React, Component} from 'react';
import Point from '../Point/Point';
import './Board.css'
class Board extends Component { 
    constructor (){
        super()
        this.sunAzimuth=0 // => 90 degC
        this.objAzimuth=0 // => 90 degC
        this.elevation=0/180*Math.PI // Zenith
        
        this.initModel=[
            {x:0, y:0, z:0},
            {x:0, y:0, z:5},
            {x:1, y:0, z:0},
            {x:1, y:0, z:5},
            {x:.66, y:0.5, z:7},
            {x:1, y:1, z:0},
            {x:1, y:1, z:5},
            {x:0, y:1, z:0},
            {x:0, y:1, z:5},
            {x:.33, y:0.5, z:7},
        ]
        this.refModel=[
            {x:0, y:0, z:0},
            {x:0, y:0, z:5},
            {x:1, y:0, z:0},
            {x:1, y:0, z:5},
            {x:.66, y:0.5, z:7},
            {x:1, y:1, z:0},
            {x:1, y:1, z:5},
            {x:0, y:1, z:0},
            {x:0, y:1, z:5},
            {x:.33, y:0.5, z:7},
        ]
      this.state={
        model:[
            {x:0, y:0, z:0},
            {x:0, y:0, z:5},
            {x:1, y:0, z:0},
            {x:1, y:0, z:5},
            {x:.66, y:0.5, z:7},
            {x:1, y:1, z:0},
            {x:1, y:1, z:5},
            {x:0, y:1, z:0},
            {x:0, y:1, z:5},
            {x:.33, y:0.5, z:7},
        ],
        sunAzimuth :this.sunAzimuth,
        objAzimuth :this.objAzimuth,
        elevation : this.elevation
    }
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
    
    rotate =(model)=>{
        const cosOAz=Math.cos(this.objAzimuth)
        const sinOAz=Math.sin(this.objAzimuth)

        const cosSAz=Math.cos(this.sunAzimuth)
        const sinSAz=Math.sin(this.sunAzimuth)
        
        const cosEl=Math.cos(this.elevation)
        const sinEl=Math.sin(this.elevation)
        
        let Y= [
            [cosEl, 0, sinEl],
            [0, 1, 0],
            [-sinEl, 0, cosEl]];
        let ZObj= [
            [cosOAz,-sinOAz,0],
            [sinOAz,cosOAz,0],
            [0,0,1]];
        let ZAz= [
            [cosSAz,-sinSAz,0],
            [sinSAz,cosSAz,0],
            [0,0,1]];
        let X= [
            [1,0,0],
            [0,cosEl,-sinEl],
            [0,sinEl,cosEl]];
        
       
        const rotationMAtrix = this.multiply( Y,ZAz)
        const rotationMAtrixT = this.transpose(rotationMAtrix)

        let modelVectorized = model.map(point=>[[point.x], [point.y], [point.z]])
        return model.map(point=>this.multiply(rotationMAtrixT, point)).map(point=>({x:point[0], y:point[1],z:point[2]}))
        //console.log ("Rotatez", this.model)
    }  



    updateModel = ()=>{
        //let model = this.rotateZ(this.refModel)
            //console.log ('rotateZ', model)
        //model = this.rotateY(model)
            //console.log ('rotateY', model)
        let model = this.rotate(this.refModel)
        return model
    }

    handleIncreaseObjAzimuth = ()=>{
        this.objAzimuth +=5/180*Math.PI
        this.handleXY()
        const model =this.updateModel()

        this.setState({model, objAzimuth:this.objAzimuth})   
    }

    handleDecreaseObjAzimuth = ()=>{
        this.objAzimuth -=5/180*Math.PI
        this.handleXY()

        const model =this.updateModel()
        this.setState({model, objAzimuth:this.objAzimuth})   
    }

    handleIncreaseSunAzimuth = ()=>{
        this.sunAzimuth +=5/180*Math.PI
        
        const model =this.updateModel()
        this.setState({model, sunAzimuth:this.sunAzimuth})   
    }

    handleDecreaseSunAzimuth = ()=>{
        this.sunAzimuth -=5/180*Math.PI
        const model =this.updateModel()
        this.setState({model, sunAzimuth:this.sunAzimuth})   
    }

    handleDecreaseElevation  = ()=>{
        this.elevation -= 1/180*Math.PI
        const model =this.updateModel()
        this.setState({model,elevation:this.elevation})   
    }

    handleIncreaseElevation  = ()=>{
        this.elevation += 1/180*Math.PI
        const model =this.updateModel()
        this.setState({model,elevation:this.elevation})   
    }

    handleXY = () =>{
        this.refModel=this.initModel.map(point=>({ x:point.x, y:-point.y, z:point.z }))

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
        
        this.setState({model})
    }
    handleYZ = () =>{
        this.refModel=this.initModel.map(point=>({ x:point.y, y:-point.z, z:point.x }))
        const model=this.updateModel()
        this.setState({model})
    }
    handleXZ = () =>{
        this.refModel=this.initModel.map(point=>({ x:point.x, y:-point.z, z:point.y }))
        const model=this.updateModel()
        console.log (model)
        this.setState({model})
    }

    render () {
        return(
        <div>
            <div>
                <button onClick={this.handleDecreaseObjAzimuth}>Object Az -5 {(3.14/2+this.state.objAzimuth) /3.14*180}</button>
                <button onClick={this.handleIncreaseObjAzimuth}>Object Az +5 {(3.14/2+this.state.objAzimuth) /3.14*180}</button>
                
                <button onClick={this.handleDecreaseSunAzimuth}>Sun Az -5 {(3.14/2+this.state.sunAzimuth) /3.14*180}</button>
                <button onClick={this.handleIncreaseSunAzimuth}>Sun Az +5 {(3.14/2+this.state.sunAzimuth) /3.14*180}</button>

                <button onClick={this.handleDecreaseElevation}>Elevation -1 {(3.14/2-this.state.elevation)/3.14*180}</button>
                <button onClick={this.handleIncreaseElevation}>Elevation +1 {(3.14/2-this.state.elevation)/3.14*180}</button>
                <button onClick={this.handleXY}>XY plane </button>
                <button onClick={this.handleXZ}>XZ plane </button>
                <button onClick={this.handleYZ}>YZ plane </button>
            </div>
            <div>
                <svg viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg">
                    {this.state.model.map((point,index)=> <Point point={point} key={index}/>)}
                </svg>
            </div>
            
        </div>
        )
    }
        
    
}

export default Board;