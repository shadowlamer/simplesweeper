const MAX_ROWS = 20
const MAX_COLUMNS = 20

const fieldArray = []

function getMineOrEmpty() {
    return (Math.random() > 0.9) ? "mine" : "empty";
}

function initField() {
    const field = document.getElementById('field')
    field.innerHTML = ''
    for (let row = 0; row < MAX_ROWS; row++) {
        let rowContainer = createRowContainer();
        fieldArray[row] = []
        for (let column = 0; column < MAX_COLUMNS; column++) {
            const mineOrEmpty = getMineOrEmpty();
            let cell = (createCell(row, column, mineOrEmpty));
            rowContainer.append(cell);
            fieldArray[row][column] = {mineOrEmpty: mineOrEmpty, cell: cell};
        }
        field.append(rowContainer);
    }
}

function createRowContainer() {
    const rowContainer = document.createElement("div");
    rowContainer.classList.add("field-row");
    return rowContainer;
}

function createCell(row, column, mineOrEmpty) {
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

    const cell = e.target;
    const row = cell.getAttribute('data-row')
    const column = cell.getAttribute('data-column')

    switch (e.buttons) {
        case 0: // left button
            openCellRecursive(row, column);
            break;
        case 2: // right button
            markCell(cell);
            break;
    }
    return false;
}

function markCell(e) {
    if (e.classList.contains("marked")) {
        e.classList.remove("marked");
    } else {
        e.classList.add("marked");
    }
}

function openCellRecursive(row, column) {
    openCell(row, column);
    if (isMine(row, column)) {
        overGame();
    } else if (calcNeighbours(row, column) === 0) {
        for (let dx = 0; dx < 3; dx++) {
            for (let dy = 0; dy < 3; dy++) {
                let r = row - 1 + dx;
                let c = column - 1 + dy;
                if (c >= 0 && c < MAX_COLUMNS && r >= 0 && r < MAX_ROWS) {
                    let cell = fieldArray[r][c]['cell'];
                    if (!isMine(r, c) && cell.classList.contains("closed")) openCellRecursive(r, c);
                }
            }
        }
    }
}

function openCell(row, column) {
    const cell = fieldArray[row][column]['cell']
    cell.classList.remove("closed");
    cell.classList.add("opened");
    let mineCount = calcNeighbours(row, column);
    if (mineCount > 0) {
        cell.innerHTML = mineCount;
        cell.classList.add(`count-${mineCount}`)
    }
}

function overGame() {
    alert("GameOver!");
}

function isMine(row, column) {
    return fieldArray[row][column]['mineOrEmpty'] === "mine"
}

function calcNeighbours(row, column) {
    if (isMine(row, column)) return -1;
    let mineCount = 0;
    for (let dx = 0; dx < 3; dx++) {
        for (let dy = 0; dy < 3; dy++) {
            let r = row - 1 + dx;
            let c = column - 1 + dy;
            if (c >= 0 && c < MAX_COLUMNS && r >= 0 && r < MAX_ROWS && isMine(r, c)) mineCount++;
        }
    }
    return mineCount;
}

window.addEventListener("load", initField);