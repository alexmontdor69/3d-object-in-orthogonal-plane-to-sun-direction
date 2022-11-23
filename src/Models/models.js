const models={
    "house": {
        name:"house",
        points:
        [
            {x:0, y:0, z:0, label:'1'},
            {x:0, y:0, z:5, label:'2'},
            {x:9, y:0, z:0, label:'3'},
            {x:9, y:0, z:5, label:'4'},
            {x:4.5, y:4.62, z:7.5, label:'5'},
            {x:9, y:14, z:0, label:'6'},
            {x:9, y:14, z:5, label:'7'},
            {x:0, y:14, z:0, label:'8'},
            {x:0, y:14, z:5, label:'9'},
            {x:4.5, y:9.24, z:7.5, label:'10'},
        ],
        segments:
        [
            [0,1],[0,2],[0,7],[3,4],[1,3],[1,8],
            [2,3],[3,6],[8,9],[1,4],[6,9],[6,8],
            [6,9],[5,7],[5,6],[2,5],[7,8], [4,9]
        ],
        twoDModel: false,
        width:9,
        depth:14,
        height:5,
        x0:0,
        y0:0,
        symetrical:true
    },
    "tree": {
        name:"Tree",
        points:    [
            {x:2.75, y:0, z:0/9*18, label:'1'},
            {x:2.75, y:0, z:1.5/9*18, label:'2'},
            {x:5, y:0, z:3/9*18, label:'3'},
            {x:5, y:0, z:5/9*18, label:'4'},
            {x:3.5, y:0, z:8/9*18, label:'5'},
            {x:2.5, y:0, z:9/9*18, label:'6'},
            {x:1.5, y:0, z:8/9*18, label:'7'},
            {x:0, y:0, z:5/9*18, label:'8'},
            {x:0, y:0, z:3/9*18, label:'9*18'},
            {x:2.25, y:0, z:1.5/9*18, label:'10'},
            {x:2.25, y:0, z:0/9*18, label:'11'},
        ],
        segments:
        [
            [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],
            [6,7],[7,8],[8,9],[9,10],[10,0]
        ],
        width:5,
        depth:1,
        height:18,
        x0:2.5,
        y0:0,
        symetrical:true
    }
}

export default models