const transpose=(array)=>{
    // https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
    return  array[0].map((_, colIndex) => array.map(row => row[colIndex]));
}

const multiply=(a, b) => {
    // https://stackoverflow.com/questions/27205018/multiply-2-matrices-in-javascript
    let aNumRows = a.length, aNumCols = a[0].length,
        //bNumRows = b.length, 
        bNumCols = b[0].length,
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

export {transpose, multiply};