var board = [];   //Game board
var whosTurn;   //Holds the information of whos's turn
var turnPlayer;   //Keeps track of who started the game
var tds = document.getElementsByTagName("td");   //Array of table cells
var tableControl = [];   //This is used to control table status with IsTableFull function
var result;
var computer = 'x', user = 'o';

//If the second player is selected
function secondPlayer() {
    var x = Math.floor(Math.random() * 9);
    tds[x].textContent = computer;
    tds[x].style.color = 'red';
}

$(function () {

    var resultText = document.getElementById("result");

    $("#container").on("click", "td", tdClick);

    //When the table cells are clicked
    function tdClick() {
        if (!IsTableFull() && $(this).text() === '' && whosTurn === 'o') {
            $(this).text(user);
            $(this).css('color', 'blue');
            whosTurn = 'x';
            tableControl = [];
            isOver();
            setTimeout(computerTurn, 1000);
        }
    }

    //When computer plays
    function computerTurn() {

        if (!IsTableFull()) {
            tableToArray();
            var move = findBestMove(board);
            $("tr:eq(" + move.row + ") td:eq(" + move.col + ")").text(computer);
            $("tr:eq(" + move.row + ") td:eq(" + move.col + ")").css('color', 'red');
            tableControl = [];
            isOver();
        }
        whosTurn = 'o';
    }

    //Check to see if the game is over
    function isOver() {
        board = [];
        tableToArray();
        result = calculate(board);

        if (IsTableFull() && result === 0) {
            resultText.innerHTML = "DRAW!";
            setTimeout(clearTable, 3000);
        }
        if (result === 10) {
            resultText.innerHTML = "YOU LOST!";
            $("#container").off("click", "td");
            setTimeout(clearTable, 3000);
        }
        if (result === -10) {
            resultText.innerHTML = "YOU WON!";
            $("#container").off("click", "td");
            setTimeout(clearTable, 3000);
        }
        tableControl = [];
        board = [];
    }

    function IsTableFull() {
        for (var i = 0; i < 9; i++) {
            tableControl.push(tds[i].textContent);
        }
        if (tableControl.indexOf('') === -1) {
            return true;
        }
        return false;
    }

    //Convert table to array
    function tableToArray() {
        $("table#theTable tr").each(function () {
            var arrayOfThisRow = [];
            var tableData = $(this).find('td');
            if (tableData.length > 0) {
                tableData.each(function () { arrayOfThisRow.push($(this).text()); });
                board.push(arrayOfThisRow);
            }
        });
    }

    function clearTable() {
        for (var i = 0; i < 9; i++) {
            tds[i].textContent = '';
        }
        if (turnPlayer === 2) {
            setTimeout(secondPlayer, 200);
        }
        resultText.innerHTML = "";
        $("#container").on("click", "td", tdClick);
    }
});

//Check that there is any move to play
function isThereAnyMove(board) {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (board[i][j] === '') {
                return true;
            }
        }
    }
    return false;
}

//This function gives points according to the game state
//If X wins, +10 point. If O wins, -10 points.
function calculate(board) {
    for (var row = 0; row < 3; row++) {
        if (board[row][0] === board[row][1] &&
            board[row][1] === board[row][2]) {
            if (board[row][0] === computer)
                return +10;
            else if (board[row][0] === user)
                return -10;
        }
    }

    for (var col = 0; col < 3; col++) {
        if (board[0][col] === board[1][col] &&
            board[1][col] === board[2][col]) {
            if (board[0][col] === computer)
                return +10;
            else if (board[0][col] === user)
                return -10;
        }
    }

    if (board[0][0] === board[1][1] &&
        board[1][1] === board[2][2]) {
        if (board[0][0] === computer)
            return +10;
        else if (board[0][0] === user)
            return -10;
    }

    if (board[0][2] === board[1][1] &&
        board[1][1] === board[2][0]) {
        if (board[0][2] === computer)
            return +10;
        else if (board[0][2] === user)
            return -10;
    }
    return 0;
}

//This function finds all possible movements
function minimax(board, depth, isMax) {
    var score = calculate(board);

    if (score === 10)
        return score;

    if (score === -10)
        return score;

    if (isThereAnyMove(board) === false)
        return 0;

    if (isMax) {
        var best = -1000;

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    board[i][j] = computer;
                    best = Math.max(best,
                        minimax(board, depth + 1, !isMax));
                    board[i][j] = '';
                }
            }
        }
        return best;
    }

    else {
        best = 1000;

        for (i = 0; i < 3; i++) {
            for (j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    board[i][j] = user;
                    best = Math.min(best,
                        minimax(board, depth + 1, !isMax));
                    board[i][j] = '';
                }
            }
        }
        return best;
    }
}


//This function finds the best move by using minimax function.
function findBestMove(board) {
    var bestVal = -1000;
    var bestMove = {};
    bestMove.row = -1;
    bestMove.col = -1;

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (board[i][j] === '') {
                board[i][j] = computer;
                var moveVal = minimax(board, 0, false);
                board[i][j] = '';
                if (moveVal > bestVal) {
                    bestMove.row = i;
                    bestMove.col = j;
                    bestVal = moveVal;
                }
            }
        }
    }
    return bestMove;
}
