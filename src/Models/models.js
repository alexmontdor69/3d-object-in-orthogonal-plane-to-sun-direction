const models={
    "house": {
        name:"House",
        points:
        [
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
        x0:0,
        y0:0,
        symetrical:true
    },
    "treePoints": {
        name:"Tree",
        points:    [
            {x:2.75, y:0, z:0/9, point:'1'},
            {x:2.75, y:0, z:1.5/9, point:'2'},
            {x:5, y:0, z:3/9, point:'3'},
            {x:5, y:0, z:5/9, point:'4'},
            {x:3.5, y:0, z:8/9, point:'5'},
            {x:2.5, y:0, z:9/9, point:'6'},
            {x:1.5, y:0, z:8/9, point:'7'},
            {x:0, y:0, z:5/9, point:'8'},
            {x:0, y:0, z:3/9, point:'9'},
            {x:2.25, y:0, z:1.5/9, point:'10'},
            {x:2.25, y:0, z:0/9, point:'11'},
      
        ],
        segments:
        [
            [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],
            [6,7],[7,8],[8,9],[9,10],[10,0]
        ],
        width:1,
        depth:1,
        height:18,
        x0:2.5,
        y0:0,
        symetrical:true
    }
}

export default models