function GameBoard() {
    let board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    const getBoard = () => board.map(row => [...row]);

    const isCellEmpty = (row, col) => board[row][col] === '';

    const placeMark = (row, col, mark) => {
        if (isCellEmpty(row, col)) {
            board[row][col] = mark;
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
    }
    return { getBoard, isCellEmpty, placeMark, resetBoard };

}

function Player(name, mark) {
    const getName = () => name;
    const getMark = () => mark;
    return { getName, getMark };
}

function GameController(Player1, Player2) {
    const board = GameBoard();
    let currentPlayer = Player1
    let gameOver = false;
    let Winner = null;
    let movesCount = 0;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === Player1 ? Player2 : Player1;
    };

    const checkWin = () => {
        const b = board.getBoard();

        const lines = [
            // Rows
            [b[0][0], b[0][1], b[0][2]],
            [b[1][0], b[1][1], b[1][2]],
            [b[2][0], b[2][1], b[2][2]],
            // Columns
            [b[0][0], b[1][0], b[2][0]],
            [b[0][1], b[1][1], b[2][1]],
            [b[0][2], b[1][2], b[2][2]],
            // Diagonals
            [b[0][0], b[1][1], b[2][2]],
            [b[0][2], b[1][1], b[2][0]],
        ];
        return lines.some(line =>
            line[0] !== '' &&
            line[0] === line[1] &&
            line[1] === line[2]);

    };
    const playMove = (row, col) => {
        if (gameOver) return false;
        const success = board.placeMark(row, col, currentPlayer.getMark());
        if (!success) return false;

        movesCount++;
        if (checkWin()) {
            gameOver = true;
            Winner = currentPlayer;
        } else if (movesCount === 9) {
            gameOver = true; // Draw
        } else {
            switchPlayer();
        }

        return true;
    }

    const resetGame = () => {
        board.resetBoard();
        currentPlayer = Player1;
        gameOver = false;
        Winner = null;
        movesCount = 0;
    };
    const getBoard = () => board.getBoard();
    const getCurrentPlayer = () => currentPlayer;
    const getStatus = () => {
        if (Winner) return `${Winner.getName()} wins!`;
        if (gameOver) return "It's a draw!";
        return `${currentPlayer.getName()}'s turn.`;
    };

    return { playMove, getBoard, getCurrentPlayer, getStatus, resetGame };
};

const DisplayController = (function () {
    let game = null;
    const boardElement = document.getElementById('board');
    const statusElement = document.getElementById('status');
    const restartButton = document.getElementById('restart');

    const Player1Input = document.getElementById('player1-name');
    const Player2Input = document.getElementById('player2-name');

    const startGame = () => {
        const name1 = Player1Input.value || "Player 1";
        const name2 = Player2Input.value || "Player 2";

        const player1 = Player(name1, "X");
        const player2 = Player(name2, "O");
        game = GameController(player1, player2);
        renderBoard();
        updateStatus();
    };


    const createBoard = () => {
        boardElement.innerHTML = '';

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const cell = document.createElement('div');
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.classList.add('cell');
                boardElement.appendChild(cell);
            }
        }
    };

    const renderBoard = () => {
        const board = game.getBoard();
        const cells = document.querySelectorAll(".cell");

        cells.forEach(cell => {
            const row = cell.dataset.row;
            const col = cell.dataset.col;
            cell.textContent = board[row][col];
        });
    };
    const updateStatus = () => {
        statusElement.textContent = game.getStatus();
    };
    const handleCellClick = (e) => {
        if (!game) return;
        const row = e.target.dataset.row;
        const col = e.target.dataset.col;

        if (row === undefined || col === undefined) return;

        const success = game.playMove(Number(row), Number(col));
        if (!success) return;

        renderBoard();
        updateStatus();
    };


    const addEventListeners = () => {
        boardElement.addEventListener("click", handleCellClick);
        restartButton.addEventListener("click", startGame);
    };

    const restartGame = () => {
        game.resetGame();
        renderBoard();
        updateStatus();
    };
    const init = () => {
        createBoard();
        addEventListeners();
    };

    init();


    return {};
})();