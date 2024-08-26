let player = 'A';
let gameStarted = false;
let currentTurn = 'A';
let selectedPiece = null;

const board = Array(5).fill().map(() => Array(5).fill(null));
const boardDiv = document.getElementById('board');
const pieceSelectionDiv = document.getElementById('pieceSelection');
const messageDiv = document.getElementById('message');

let socket = new WebSocket("ws://localhost:8000/ws");

socket.onopen = function(event) {
    console.log("Connected to WebSocket server");
};

socket.onmessage = function(event) {
    let message = JSON.parse(event.data);
    if (message.type === 'update') {
        updateBoard(message.board);
        currentTurn = message.currentTurn;
        document.getElementById('turn').textContent = `Player ${currentTurn}'s Turn`;
    } else if (message.type === 'alert') {
        alert(message.text);
    } else if (message.type === 'player') {
        player = message.player;
        document.getElementById('player').textContent = `You are Player ${player}`;
        if (player === 'A') {
            messageDiv.textContent = "Game starts only when player B also chooses their pieces.";
        }
    } else if (message.type === 'game_over') {
        alert(`Game over! Player ${message.winner} wins!`);
        location.reload();
    }
};

function sendMove(move) {
    socket.send(JSON.stringify(move));
}

function renderBoard() {
    boardDiv.innerHTML = '';
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            const cell = document.createElement('div');
            cell.dataset.row = row;
            cell.dataset.col = col;
            if (board[row][col]) {
                cell.textContent = board[row][col].piece;
                cell.classList.add(board[row][col].player === 'A' ? 'playerA' : 'playerB');
                if (board[row][col].player !== player) {
                    cell.classList.add('disabled');
                }
            }
            cell.addEventListener('click', () => selectPiece(row, col));
            boardDiv.appendChild(cell);
        }
    }
}

function selectPiece(row, col) {
    if (board[row][col] && board[row][col].player === currentTurn && board[row][col].player === player) {
        selectedPiece = { row, col, piece: board[row][col].piece };
        renderBoard();
        document.querySelector(`[data-row="${row}"][data-col="${col}"]`).classList.add('selected');
        showActions(selectedPiece.piece);
    }
}

function showActions(piece) {
    const actionsDiv = document.getElementById('actions');
    actionsDiv.innerHTML = '';

    let availableActions = [];
    if (piece === 'Pawn') {
        availableActions = ['L', 'R', 'F', 'B'];
    } else if (piece === 'Hero1') {
        availableActions = ['L', 'R', 'F', 'B'];
    } else if (piece === 'Hero2') {
        availableActions = ['FL', 'FR', 'BL', 'BR'];
    }

    availableActions.forEach(action => {
        const btn = document.createElement('button');
        btn.textContent = action;
        btn.addEventListener('click', () => movePiece(action));
        actionsDiv.appendChild(btn);
    });
}

function movePiece(action) {
    const { row, col, piece } = selectedPiece;
    let newRow = row, newCol = col;

    if (action === 'L') newCol -= 1;
    if (action === 'R') newCol += 1;
    if (action === 'F') newRow += (currentTurn === 'A' ? 1 : -1);
    if (action === 'B') newRow -= (currentTurn === 'A' ? 1 : -1);
    if (action === 'FL') { newRow += (currentTurn === 'A' ? 1 : -1); newCol -= 1; }
    if (action === 'FR') { newRow += (currentTurn === 'A' ? 1 : -1); newCol += 1; }
    if (action === 'BL') { newRow -= (currentTurn === 'A' ? 1 : -1); newCol -= 1; }
    if (action === 'BR') { newRow -= (currentTurn === 'A' ? 1 : -1); newCol += 1; }

    sendMove({ type: 'move', row, col, newRow, newCol, piece, player: currentTurn });
}

function updateBoard(newBoard) {
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            board[row][col] = newBoard[row][col];
        }
    }
    renderBoard();
}

document.getElementById('startGame').addEventListener('click', () => {
    const pieces = [
        document.getElementById('piece1').value,
        document.getElementById('piece2').value,
        document.getElementById('piece3').value,
        document.getElementById('piece4').value,
        document.getElementById('piece5').value
    ];

    sendMove({ type: 'start', pieces, player });
    pieceSelectionDiv.style.display = 'none';
    messageDiv.style.display = 'none';
});

renderBoard();
