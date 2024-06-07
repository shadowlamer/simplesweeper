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
            rowContainer.append(createCell(row, column, mineOrEmpty))
            fieldArray[row][column] = mineOrEmpty;
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
    switch (e.buttons) {
        case 0: // left button
            openCell(e.target);
            break;
        case 2: // right button
            markCell(e.target);
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

function openCell(e) {
    e.classList.remove("closed");
    e.classList.add("opened");
    const row = e.getAttribute('data-row')
    const column = e.getAttribute('data-column')
    if (fieldArray[row][column] === "mine") {
      alert("GameOver!");
    } else {
        let mineCount = calcNeighbours(row, column);
        e.innerHTML = mineCount;
        e.classList.add(`count-${mineCount}`)
    }
}

function calcNeighbours(row, column) {
    let mineCount = 0;
    for (let dx = 0; dx < 3; dx++) {
        for (let dy = 0; dy < 3; dy++) {
            let r = row - 1 + dx;
            let c = column - 1 + dy;
            if (c >= 0 && c < MAX_COLUMNS && r >= 0 && r < MAX_ROWS && fieldArray[r][c] === "mine") mineCount++;
        }
    }
    return mineCount;
}

window.addEventListener("load", initField);