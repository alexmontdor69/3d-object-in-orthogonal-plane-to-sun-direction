
import convexHull from 'convex-hull';


class SolarPlaneCalculator {

    constructor (model, objAzimuth, sunAzimuth, elevation){
        this.model = model
        this.sunAzimuth = sunAzimuth
        this.objAzimuth = objAzimuth
        this.elevation = elevation
        this.initSegment =[]
        this.initModel =[]
        this.points =[]
        // parsing Model
        this.init()

        this.rotationMatrix=this.buildRotationMatrix()
        this.transformedPoints=[]
        this.transformModel()
    }

    init(){
        console.log (`Init Model`)
        this.initSegment=this.model.segments
        this.initModel=this.model.points
        this.objConfig={
            width:this.model.width,
            depth:this.model.depth,
            height:this.model.height,
        }

        console.log (`Create a reference ${this.initModel.length} points Model to dimension W, D, P`, 
            this.objConfig.width,
            this.objConfig.depth, 
            this.objConfig.height)
        
            this.rotateModel() // =>this.refModel
    }

    rotateModel (){
        console.log ('.. Adjust Object Position')
        const cosOAz=Math.cos(this.objAzimuth)
        const sinOAz=Math.sin(this.objAzimuth)

        let ZObj= [
            [cosOAz,-sinOAz,0],
            [sinOAz,cosOAz,0],
            [0,0,1]];

        this.refModel = this.initModel
                            .map(point=>({ 
                                            x:point.x*this.objConfig.width, 
                                            y:-point.y*this.objConfig.depth, 
                                            z:point.z*this.objConfig.height
                                        }))
                            .map(point=>([[point.x],[point.y],[point.z]])) // refModel being an array of points vector 3x1
                            .map(point=>this.multiply(ZObj,point))
    }

    buildRotationMatrix (){
        console.log ('.. Adjust Solar Plane in function of sun azimuth and elevation')

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

        const rotationMAtrix = this.multiply( XT, ZAzT)
        return rotationMAtrix
    }

    formatZone=(model)=>{
        //console.log ('... Format Zone info')
        let zone = model.map(point=>([point.x, point.y]))
        return zone
    }
    
    findPeripheralZone= (model)=>{
        let pointsCluster = this.formatZone(model)
        const peripheralZone=convexHull(pointsCluster)
        return peripheralZone        
    }

    transformModel (){
        this.transformedPoints = this.refModel.map(point=>this.multiply(this.rotationMatrix, point)).map((point)=>({x:point[0][0], y:point[1][0], z:point[2][0]}))
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
    
// __________________________________________________________________________________________________________

    getPoints () {
        console.log (`Display ${this.transformedPoints.length} Points`)
        return this.transformedPoints
    }

    getPeripheralPointIndexes (){
        if (this.transformedPoints.length ==0)
            return []
        const zone = this.findPeripheralZone(this.transformedPoints)
        const pointIndexes=  [... new Set(zone.join().split(','))]
        console.log (`... Detect ${pointIndexes.length} peripheral points (orange)`)
        return pointIndexes
        
    }

    setObjAzimuth (angle){
        console.log (`Set Object Azimuth`)
        this.objAzimuth = angle
        this.rotateModel ()
        this.transformModel()
    }

    setSunAzimuth (angle){
        console.log (`Set Sun Azimuth`)
        this.sunAzimuth = angle
        this.rotationMatrix=this.buildRotationMatrix ()
        this.transformModel()
    }

    setElevation(angle){
        console.log (`Set Sun Elevation`)       
        this.elevation = angle
        this.rotationMatrix=this.buildRotationMatrix ()
        this.transformModel()
    }
    getSegments = (model)=>{
        let segments = this.initSegment.map((points)=>([this.transformedPoints[points[0]],this.transformedPoints[points[1]]]))  
        console.log (`Display ${segments.length} Segments`)
        return segments
    }

}
export default SolarPlaneCalculator;
