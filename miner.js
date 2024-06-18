const MAX_ROWS = 20
const MAX_COLUMNS = 20

const fieldArray = []
let mineCount = 0
let clearCount = 0

function getMineOrEmpty() {
    return (Math.random() > 0.9) ? "mine" : "empty";
}

function initField() {
    mineCount = 0;
    clearCount = 0

    const field = document.getElementById('field')
    field.innerHTML = ''
    for (let row = 0; row < MAX_ROWS; row++) {
        let rowContainer = createRowContainer();
        fieldArray[row] = []
        for (let column = 0; column < MAX_COLUMNS; column++) {
            let cell = (createCell(row, column));
            rowContainer.append(cell);
            fieldArray[row][column] = cell;
        }
        field.append(rowContainer);
    }
    printStats();
}

function createRowContainer() {
    const rowContainer = document.createElement("div");
    rowContainer.classList.add("field-row");
    return rowContainer;
}

function createCell(row, column) {
    const mineOrEmpty = getMineOrEmpty();
    if (mineOrEmpty === "mine") mineCount++;
    const cell = document.createElement("div");
    cell.classList.add("cell", "closed", mineOrEmpty);
    cell.setAttribute("data-row", row);
    cell.setAttribute("data-column", column);
    cell.addEventListener("click", cellClickHandler);
    cell.addEventListener("contextmenu", cellClickHandler);
    return cell;
}

function cellClickHandler(e) {
    e.preventDefault();

    const row = e.target.getAttribute('data-row')
    const column = e.target.getAttribute('data-column')

    switch (e.buttons) {
        case 0: // left button
            if (isOpened(row, column)) {
                openNeighbourCells(row, column);
            } else {
                openCellRecursive(row, column);
            }
            break;
        case 2: // right button
            markCell(row, column);
            break;
    }
    return false;
}

function markCell(row, column) {
    const cell = fieldArray[row][column]
    if (cell.classList.contains("marked")) {
        cell.classList.remove("marked");
    } else {
        cell.classList.add("marked");
    }
}

function openNeighbourCells(row, column) {
    forAllNeighbourCells(row, column, function(r, c) {
        if (!isMarked(r, c)) openCellRecursive(r, c);
    })
}

function openCellRecursive(row, column) {
    openCell(row, column);
    if (countNeighbourMines(row, column) === 0) {
        forAllNeighbourCells(row, column, function(r, c) {
            if (!isMine(r, c) && !isOpened(r, c)) openCellRecursive(r, c);
        })
    }
}

function forAllNeighbourCells(row, column, lambda) {
    for (let dx = 0; dx < 3; dx++) {
        for (let dy = 0; dy < 3; dy++) {
            let r = row - 1 + dx;
            let c = column - 1 + dy;
            if (c >= 0 && c < MAX_COLUMNS && r >= 0 && r < MAX_ROWS) {
                lambda(r, c);
            }
        }
    }
}

function openCell(row, column) {
    const cell = fieldArray[row][column]
    cell.classList.remove("closed");
    cell.classList.add("opened");
    let mineCount = countNeighbourMines(row, column);
    if (mineCount > 0) {
        cell.innerHTML = mineCount;
        cell.classList.add(`count-${mineCount}`)
    }
    if (isMine(row,column)) {
        overGame();
    } else {
        clearCount++;
    }
    printStats();
}

function printStats() {
    const stats = document.getElementById('stats')
    stats.innerHTML = `Очищено ${clearCount} из ${MAX_ROWS * MAX_COLUMNS - mineCount}`
}

function overGame() {
    alert("GameOver!");
}

function isMine(row, column) {
    return fieldArray[row][column].classList.contains("mine")
}

function isMarked(row, column) {
    return fieldArray[row][column].classList.contains("marked");
}

function isOpened(row, column) {
    return fieldArray[row][column].classList.contains("opened");
}

function countNeighbourMines(row, column) {
    if (isMine(row, column)) return -1;
    let mineCount = 0;
    forAllNeighbourCells(row, column, function(r, c) {
        if (isMine(r, c)) mineCount++;
    })
    return mineCount;
}

window.addEventListener("load", initField);