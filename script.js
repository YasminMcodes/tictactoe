function GameBoard() {
    board = [
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
        if (success) {
            movesCount++;
            if (checkWin()) {
                gameOver = true;
                Winner = currentPlayer;
            } else if (movesCount === 9) {
                gameOver = true; // Draw
            } else {
                switchPlayer();
            }
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
