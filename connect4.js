/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2

// represent board in binary, and player moves in their own binary
let board = 0, p1Board = 0, p2Board = 0;

// This function generates a string representing binary, of exact WIDTH
function binString(binary) {
  let binStr = binary.toString(2);
  if (binStr.length < WIDTH) {
    binStr = Array(WIDTH - binStr.length).fill(0).join('') + binStr;
  }
  return binStr;
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // Display current player
  let playerName = document.createElement('h1');
  playerName.classList.add('player');
  playerName.classList.add('p1-text');
  playerName.innerText = `Current Player: ${currPlayer}`;
  document.querySelector('body').prepend(playerName);

  // TODO: get "board" variable from the item in HTML w/ID of "board"
  let boardHTML = document.getElementById('board');

  // TODO: add comment for this code
  let top = document.createElement('tr');
  top.setAttribute('id', 'column-top');
  top.addEventListener('click', handleClick);

  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement('td');
    headCell.setAttribute('id', x);

    // Set hover indicator for next piece
    let hoverPiece = document.createElement('div');
    hoverPiece.classList.add('hover');
    hoverPiece.classList.add('piece');
    hoverPiece.classList.add('p1');
    hoverPiece.classList.add('hidden');
    headCell.addEventListener('mouseover', function () {
      hoverPiece.classList.toggle('hidden');
    });
    headCell.addEventListener('mouseout', function () {
      hoverPiece.classList.toggle('hidden');
    });
    headCell.appendChild(hoverPiece);

    top.append(headCell);
  }
  boardHTML.append(top);

  // Add cells for table!
  for (let y = 0; y < HEIGHT; y++) {
    let row = document.createElement('tr');
    for (let x = 0; x < WIDTH; x++) {
      let cell = document.createElement('td');
      cell.setAttribute('id', `${y}-${x}`);
      row.append(cell);
    }
    boardHTML.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  //grab column at x and store as an integer, to be manipulated with bitwise later
  let colBin = +(binString(board).filter((e, i) i % x === 0));

  //find first 0 from the right, once found return that row location
  for (let y = 0; y < colBin.length; y++) {
    let mask = 1 << y;
    if ((colBin ^ mask) !== colBin) return (board.length - 1 - y);
  }

  return null;
}

/** placeInTable: update DOM to place piece into HTML board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  let pieceDiv = document.createElement('div');
  pieceDiv.classList.add('piece');
  pieceDiv.classList.add(`p${currPlayer}`);
  let targetCell = document.getElementById(`${y}-${x}`);
  targetCell.appendChild(pieceDiv);
}

function updateBoard(y, x) {
  let mask = 1 << ((WIDTH * y) - WIDTH + x);
  board = board | mask;
  if (currPlayer === 1) {
    p1Board = p1Board | mask;
  } else {
    p2Board = p2Board | mask;
  }
}

/** endGame: announce game end */

// check if gameboard is full

function boardIsFull() {
  let boardStr = binString(board)
  return !(/0/g.test(boardStr));
}

function endGame(msg) {
  // TODO: pop up alert message
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x;
  if (evt.target.tagName.toLowerCase() === 'div') {
    x = +evt.target.parentNode.id;
  } else {
    x = +evt.target.id;
  }
  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);
  updateBoard(y, x);

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (boardIsFull()) {
    //call endGame
    return endGame(`The Game is a Tie!`);
  }

  // check for win
  if (checkForWin(currPlayer)) {
    setTimeout(() => endGame(`Player ${currPlayer} won!`), 10);
  }

  let hoverSet = document.getElementsByClassName('hover');

  // change color of hover (remove current player class)
  for (let i = 0; i < hoverSet.length; i++) {
    hoverSet[i].classList.toggle(`p${currPlayer}`);
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1;

  // change color of hover (add new current player class)
  for (let i = 0; i < hoverSet.length; i++) {
    hoverSet[i].classList.toggle(`p${currPlayer}`);
  }
  // Change player name
  showPlayerName();
}

function showPlayerName() {
  let playerName = document.querySelector('.player');
  playerName.innerText = `Current Player: ${currPlayer}`;
  playerName.classList.toggle('p1-text');
  playerName.classList.toggle('p2-text');
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin(currPlayer) {
  let checkBoard = (currPlayer === 1) ? p1Board : p2Board;
  // 6 spaces represents top right to bottom left diagonal connect 4, 8 represents top left to bottom right
  // 7 represents vertical, and {4} in a row is horizontal
  return /(1{4}|1\d{7}1\d{7}1\d{7}1|1\d{6}1\d{6}1\d{6}1|1\d{8}1\d{8}1\d{8}1)/.test(checkBoard);
}

makeHtmlBoard();
