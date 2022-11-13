# Display a 3D object in a Solar Plane

## Objectives
Simulate the position of point in the plane orthogonal to direction of the sun beams

With the help of the range bar, The user can vary either :

- The position of the object in the X-Y Plane
- Change the position of the azimuth of the sun
- Change the position of the elevation of the sun

The User can reset the position of the object and access to different plane view. The azimuth and elevation angle are changed.

## SolarPlaneCalculator Class

Class that calculate the plane that is orthogonal to direction of the sun beams.

It is a rotation Matrix computed from the position of the sun.
The position of the sun is defined by the azimuth and the elevation angle (standard definition)

### Model Input
__the models format__
<code>
{
    value: {
        name:"House",
        points:
        [
            {x:0, y:0, z:0, label:'1'},
            {x:0, y:0, z:1, label:'2'},
            {x:1, y:0, z:0, label:'3'},
            {x:1, y:0, z:1, label:'4'},
            {x:.33, y:0.5, z:1.5, label:'5'},
            {x:1, y:1, z:0, label:'6'},
            {x:1, y:1, z:1, label:'7'},
            {x:0, y:1, z:0, label:'8'},
            {x:0, y:1, z:1, label:'9'},
            {x:.66, y:0.5, z:1.5, label:'10'},
        ],
        segments:
        [
            [0,1],[0,2],[0,7],[8,4],[1,3],[1,8],
            [2,3],[3,6],[3,9],[1,4],[4,9],[6,8],
            [6,9],[5,7],[5,6],[2,5],[7,8]
        ],
        width:14,
        depth:9,
        height:5,
        x0:number,
        y0:number,
        z0:number,

    }
}
</code>

where :

- value : code of the model
- name : name of the model
- points : array of the points defining the shape of the model. the point are defined by {x:number, y:number, z:numer, label:name},
- segments : array of the pair of point indexes defining a segment
- width : number defining the width of the model
- depth : number defining the depth of the model
- height : number defining the height of the model
- x0,y0,z0 are number defining the coordinates of the symetrical axis 


__the Class methods__
- getPoints :  Get the coordinates of the model point in the new Plane
- getSegments : Get all the pair of point indexes describing the object
- getPeripheralPointIndexes :  Get the indexes of the point in peripheral of the object shape in the new plane
- setObjAzimuth : Set the azimuth angle (radian) of the object
- setSunAzimuth : Set the azimuth angle (radian) of the sun
- setElevation : Set the elevation angle (radian) of the sun

## Matrix Lib
Simple Matrix library to calculate:
- matrix transpose
- 2 matrices multiplication

### `npm start` 
 
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.
