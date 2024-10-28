// simplex-lp-calculator/backend/simplexLP.js
function simplexLP(A, B, C) {
    const numRows = A.length;
    const numCols = A[0].length;

    let Matrix = [];
    for (let i = 0; i < numRows; i++) {
        let row = A[i].concat(Array(numRows).fill(0));
        row[i + numCols] = 1;
        row.push(B[i]);
        Matrix.push(row);
    }

    let lastRow = C.map(c => -c).concat(Array(numRows + 1).fill(0));
    Matrix.push(lastRow);

    const findPivotColumn = () => {
        let pivotCol = Matrix[numRows].indexOf(Math.min(...Matrix[numRows].slice(0, numCols)));
        return pivotCol >= 0 && Matrix[numRows][pivotCol] < 0 ? pivotCol : -1;
    };

    const findPivotRow = (pivotCol) => {
        let ratios = [];
        for (let i = 0; i < numRows; i++) {
            if (Matrix[i][pivotCol] > 0) {
                ratios.push(Matrix[i][numCols + numRows] / Matrix[i][pivotCol]);
            } else {
                ratios.push(Infinity);
            }
        }
        let minRatio = Math.min(...ratios);
        return minRatio === Infinity ? -1 : ratios.indexOf(minRatio);
    };

    while (true) {
        let pivotCol = findPivotColumn();
        if (pivotCol === -1) break;

        let pivotRow = findPivotRow(pivotCol);
        if (pivotRow === -1) throw new Error("Unbounded solution");

        let pivotElement = Matrix[pivotRow][pivotCol];
        for (let j = 0; j < Matrix[0].length; j++) {
            Matrix[pivotRow][j] /= pivotElement;
        }

        for (let i = 0; i <= numRows; i++) {
            if (i !== pivotRow) {
                let factor = Matrix[i][pivotCol];
                for (let j = 0; j < Matrix[i].length; j++) {
                    Matrix[i][j] -= factor * Matrix[pivotRow][j];
                }
            }
        }
    }

    let optimal = Array(numCols).fill(0);
    for (let i = 0; i < numCols; i++) {
        let col = Matrix.map(row => row[i]);
        if (col.filter(x => x === 1).length === 1 && col.filter(x => x === 0).length === numRows) {
            let rowIndex = col.indexOf(1);
            optimal[i] = Matrix[rowIndex][numCols + numRows];
        }
    }

    let slack = Array(numRows).fill(0);
    for (let i = numCols; i < numCols + numRows; i++) {
        let col = Matrix.map(row => row[i]);
        if (col.filter(x => x === 1).length === 1 && col.filter(x => x === 0).length === numRows) {
            let rowIndex = col.indexOf(1);
            slack[i - numCols] = Matrix[rowIndex][numCols + numRows];
        }
    }

    let value = Matrix[numRows][numCols + numRows];

    return { optimal, slack, value };
}

module.exports = simplexLP;
