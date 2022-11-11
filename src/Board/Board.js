import {React, Component} from 'react';
import Point from '../Point/Point';
import Segment from '../Segment/Segment';
import './Board.css'
class Board extends Component { 
    constructor (){
        super()
        this.sunAzimuth=0 // => 90 degC
        this.objAzimuth=0 // => 90 degC
        this.elevation=0/180*Math.PI // Zenith
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
            {x:0, y:0, z:5, point:'2'},
            {x:1, y:0, z:0, point:'3'},
            {x:1, y:0, z:5, point:'4'},
            {x:.33, y:0.5, z:7, point:'5'},
            {x:1, y:1, z:0, point:'6'},
            {x:1, y:1, z:5, point:'7'},
            {x:0, y:1, z:0, point:'8'},
            {x:0, y:1, z:5, point:'9'},
            {x:.66, y:0.5, z:7, point:'10'},
        ]
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
        
        let Y= [
            [cosEl, 0, sinEl],
            [0, 1, 0],
            [-sinEl, 0, cosEl]];

        let ZAz= [
            [cosSAz,-sinSAz,0],
            [sinSAz,cosSAz,0],
            [0,0,1]];
/*         let X= [
            [1,0,0],
            [0,cosEl,-sinEl],
            [0,sinEl,cosEl]]; */
       
        const rotationMAtrix = this.multiply( Y,ZAz)
        const rotationMAtrixT = this.transpose(rotationMAtrix)

        return model.map(point=>this.multiply(rotationMAtrixT, point)).map(point=>({x:point[0], y:point[1],z:point[2]}))
    }  

    updateModel = ()=>{
        let model = this.rotate(this.refModel)
        return model
    }

    updateSegments = (model)=>{
        console.log ("model",model,model[this.initSegment[0][0]], model[this.initSegment[0][1]])
        let segments = this.initSegment.map((points)=>([model[points[0]],model[points[1]]]))  
        return segments
    }

    handleXY = () =>{
        this.refModel=this.initModel.map(point=>({ x:point.x*10, y:-point.y*10, z:point.z*10 }))

        // Creating the reference Model with the correct orientation
        const cosOAz=Math.cos(this.objAzimuth)
        const sinOAz=Math.sin(this.objAzimuth)

        let ZObj= [
            [cosOAz,-sinOAz,0],
            [sinOAz,cosOAz,0],
            [0,0,1]];
    
        this.refModel = this.refModel
                            .map(point=>([[point.x],[point.y],[point.z]]))
                            .map(point=>this.multiply(ZObj,point))

        // Calculation of the coordinates in a plane orthogonal to the sun beams
        const model=this.updateModel()
        const segments =this.updateSegments(model)

        this.setState({model, segments, initializing:false})
    }

/*     handleYZ = () =>{
        this.refModel=this.initModel.map(point=>({ x:point.y, y:-point.z, z:point.x }))
        const model=this.updateModel()
        this.setState({model})
    }
    handleXZ = () =>{
        this.refModel=this.initModel.map(point=>({ x:point.x, y:-point.z, z:point.y }))
        const model=this.updateModel()
        console.log (model)
        this.setState({model})
    } */

    render () {
        return(
        <>
            {this.state.initializing?
                <div>Initializing Boards</div> :
                <>
                    <div>
                        <button onClick={this.handleDecreaseObjAzimuth}>Object Az -5 {(3.14/2+this.state.objAzimuth) /3.14*180}</button>
                        <button onClick={this.handleIncreaseObjAzimuth}>Object Az +5 {(3.14/2+this.state.objAzimuth) /3.14*180}</button>
                        
                        <button onClick={this.handleDecreaseSunAzimuth}>Sun Az -5 {(3.14/2+this.state.sunAzimuth) /3.14*180}</button>
                        <button onClick={this.handleIncreaseSunAzimuth}>Sun Az +5 {(3.14/2+this.state.sunAzimuth) /3.14*180}</button>

                        <button onClick={this.handleDecreaseElevation}>Elevation -1 {(3.14/2-this.state.elevation)/3.14*180}</button>
                        <button onClick={this.handleIncreaseElevation}>Elevation +1 {(3.14/2-this.state.elevation)/3.14*180}</button>
                        <button onClick={this.handleXY}>XY plane </button>
        {/*                 <button onClick={this.handleXZ}>XZ plane </button>
                        <button onClick={this.handleYZ}>YZ plane </button> */}
                    </div>
                    <div>
                        <svg viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg">
                            {this.state.model.map((point,index)=> <Point point={point} key={"p"+index}/>)}
                            {this.state.segments.map((points,index)=> <Segment points={points} key={"s"+index}/>)}
                        </svg>
                    </div>
                </>
    }
        </>
        )
    }
        
    
}

export default Board;