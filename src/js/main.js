class Board {
    constructor(rows, cols) {
        this.rows = rows
        this.cols = cols
        this.app = document.getElementById("app")
        this.cells = []
    }

    drawBoard() {
        for (let i = 0; i < this.rows; i++) {
            const row = document.createElement("div")
            row.className = "row"
            
            const rowArr = []
            for (let j = 0; j < this.cols; j++) {
                const cell = document.createElement("div")

                cell.className = "cell"
                cell.dataset.alive = "0"

                cell.addEventListener("click", cellToggle)

                row.appendChild(cell)
                rowArr.push(cell)
            }
            this.app.appendChild(row)
            this.cells.push(rowArr)
        }
    }

    isAlive(row, col) {
        return this.cells[row][col].dataset.alive === "1"
    }

    checkNeighbors(row, col) {
        let aliveCount = 0
        if (row-1 >= 0 && this.isAlive(row-1, col)) {
            aliveCount += 1
        }
        if (row+1 < this.rows && this.isAlive(row+1, col)) {
            aliveCount += 1
        }

        if (col-1 >= 0 && this.isAlive(row, col-1)) {
            aliveCount += 1
        }
        if (col+1 < this.cols && this.isAlive(row, col+1)) {
            aliveCount += 1
        }

        if ((row-1 >= 0 && col-1 >=0) && this.isAlive(row-1, col-1)) {
            aliveCount += 1
        }
        if ((row+1 < this.rows && col+1 < this.cols) && this.isAlive(row+1, col+1)) {
            aliveCount += 1
        }

        if ((row+1 < this.rows && col-1 >= 0) && this.isAlive(row+1, col-1)) {
            aliveCount += 1
        }
        if ((row-1 >= 0 && col+1 < this.cols) && this.isAlive(row-1, col+1)) {
            aliveCount += 1
        }
        return aliveCount
    }

    killCell(row, col) {
        this.cells[row][col].dataset.alive = "0"
    }
    birthCell(row, col) {
        this.cells[row][col].dataset.alive = "1"
    }

    iterateOnce(){
        const birthCellArr = []
        const killCellArr = []

        for (let i=0; i < this.rows; i++) {
            for (let j=0; j < this.cols; j++) {
                const aliveNeighbors = this.checkNeighbors(i, j)
                const alive = this.isAlive(i, j)

                // conditions for the game of life
                if(alive && aliveNeighbors <= 1) {
                    killCellArr.push([i,j])
                }
                if(alive && aliveNeighbors > 3) {
                    killCellArr.push([i,j])
                }
                if (!alive && aliveNeighbors === 3) {
                    birthCellArr.push([i,j])
                }
            }
        }

        birthCellArr.forEach(([row,col]) => this.birthCell(row, col))
        killCellArr.forEach(([row, col]) => this.killCell(row, col))
    }

    randomizeBoard() {
        this.cells.forEach((row) => {
            row.forEach((cell) => {
                if (Math.random() >= 0.7) {
                    cell.dataset.alive = "1"
                } else {
                    cell.dataset.alive = "0"
                }
            })
        })
    }
}

function cellToggle() {
    this.classList.toggle("on")
    if (this.dataset.alive === "0") {
        this.dataset.alive = "1"
    } else {
        this.dataset.alive = "0"
    }

}

const board = new Board(100,200)

board.drawBoard();

let runningSim = null

function runOnceHandler() {
    board.iterateOnce()
}

function clearBoardHandler() {
    board.cells.forEach((row) => {
        row.forEach((cell) => cell.dataset.alive = "0")
    })
}

function randomizeHandler() {
    board.randomizeBoard()
}

function toggleSimHandler() {
    if (runningSim) {
        clearInterval(runningSim)
        runningSim = null

        this.innerText = "Start"
        this.dataset.value = "start"
        return
    }

    const simSpeedMs = document.getElementById("sim-speed-ms").value
    const intervalMs = simSpeedMs ? parseInt(simSpeedMs, 10) : 500

    const interval = setInterval(() => {
        board.iterateOnce();
    }, intervalMs)

    runningSim = interval
    this.innerText = "Stop"
    this.dataset.value = "stop"
}

document.getElementById("run-once").addEventListener("click", runOnceHandler)
document.getElementById("clear-board").addEventListener("click", clearBoardHandler)
document.getElementById("toggle-sim").addEventListener("click", toggleSimHandler)
document.getElementById("randomize").addEventListener("click", randomizeHandler)
