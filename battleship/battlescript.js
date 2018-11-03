function renderGamefields(gameField, fieldName) {
    var field = ["<tr><th>" + fieldName + "</th></tr>"];  // html
    var fieldEl = document.getElementById(fieldName);

    for (let y=0; y < gameField.length; y++) {
        field.push("<tr style=\"display: flex; justify-content: center;\">");
        for (let x=0; x < gameField.length; x++) {
            var image = gameField[y][x];
            if (gameField[y][x] == "X") {
                image = "<img src=battleshipFront.png>"
            } else if (gameField[y][x] == "x") {
                image = "<img src=battleshipBack.png>"
            }
            if (fieldName == "opponent") {
                image = "";
            }
            field.push("<td class=field id=" + x + "-" + y + " onclick=\"boxClick(this, '"+ fieldName + "')\">"+ image +"</td>")
        }
        field.push("</tr>")
    }
    fieldEl.innerHTML = field.join("\n");
}

var gameField = [];
var opponentField = [];


function renderAll() {
    renderGamefields(gameField, "player");
    renderGamefields(opponentField, "opponent");
}


function createGameField(gridSize) {
    var field = []
    for (var y = 0; y < gridSize; y++) {
        field[y] = [];
        for (var x=0; x < gridSize; x++) {
            field[y][x] = '';
        }
    }
    return field
}

var playerTurns = 0;  //mitmes move
var opponentTurns = 0; //mitmes move
var playerScore = 0; // mitu laeva osa pihta saanud
var opponentScore = 0; // mitu laeva osa pihta saanud

var shipsToDestroy = 0; // mitu laeva tuleb destroyda
var gameOver = false;

var results = 0;

function isGameOver() {
    var scoreBoardEl = document.getElementById("scoreBoard"); 
    console.log("is game over?")
    var winner = null;
    if (opponentScore == shipsToDestroy) {
        winner = "Lose";
    } else if (playerScore == shipsToDestroy) {
        winner = "Win";
    } else {
        return false;
    }

    

    if (winner != null) {
        console.log("game over bitch!!")
        results++;

        if(results > 10) {
            document.getElementById("scoreBoard").deleteRow(0);
        } 
    
        var line = ["<tr>"]
            line.push("<td>" + gameNumber + "</td>");
            line.push("<td>" + gameField.length + "</td>");
            line.push("<td>" + shipCount + "</td>");
            line.push("<td>" + playerTurns + "</td>");
            line.push("<td>" + opponentTurns + "</td>");
            line.push("<td>" + value + " s</td>");
            line.push("<td>" + winner + "</td>");
            line.push("</tr>")
        
        scoreBoardEl.innerHTML += line.join("\n");
        gameOver = true;
        gameNumber++;
        stopTimer();
        var name1 = document.getElementById("nameInput").value;

        //using URLSearchParamas to get all javascript values to server
        var searchParams = new URLSearchParams();

        searchParams.append("name1", name1)
        searchParams.append("name2", "computer")
        searchParams.append("timeStart", timeStarted.getTime());
        searchParams.append("playerShots", playerTurns);
        searchParams.append("opponentShots", opponentTurns);
        searchParams.append("time", value);

        console.log(searchParams.toString())

        fetch("../cgi-bin/results.py?" + searchParams.toString()) //lingib py failiga
        alert("You " + winner + ", you shot: " + playerTurns + ", opponent shot: " + opponentTurns);
        return true;

    }
};

function boxClick(box, fieldName) {
    if(gameOver) {
        return;
    }
    console.log("player turn");
    var x = box.id[0];
    var y = box.id[2];
    console.log(x + "and" + y + "was clicked by player");

    if (fieldName == "opponent") {
       if(opponentField[y][x].toUpperCase() == "X") {
        box.innerHTML = "<img src=fire.jpg>";
        opponentField[y][x] = "O";
        playerTurns++;
        playerScore++;
        }   
        if (opponentField[y][x].toUpperCase() == "") {
            box.style.background = "SkyBlue ";
            opponentField[y][x] = "O";
            playerTurns++;
            opponentTurn();
        }
    }
    if (isGameOver()){
        return;
    }
}

function computerTryMove(x, y) {
    if(gameOver) {
        return;
    }
    if(gameField[y][x].toUpperCase() == "X") {
        document.getElementById(x + "-" + y).innerHTML = "<img src=fire.jpg>";
        opponentScore++;
        opponentTurns++;
        gameField[y][x] = "O";
        return false;
    }  
    if (gameField[y][x].toUpperCase() == "") {
        document.getElementById(x + "-" + y).style.background = "SkyBlue ";
        opponentTurns++;
        gameField[y][x] = "O";
        return true;
    }
    if(gameField[y][x] == "O") {
        return false;
    }  
    if (isGameOver()){
        return;
    }
    return false;
}


function opponentTurn() {
    console.log("opponent turn")
    do {
        var x = getRandomInt(gameField.length);
        var y = getRandomInt(gameField.length); 
    }
    while(!computerTryMove(x, y));
}

function enoughShips(gridSize, shipCount) {
    if (shipCount > gridSize - 1) {
      alert("your ships don't fit on the grid, please choose a smaller amount of ships");
      return false;
    }
    return true;
}  
    
    
function getRandomInt(max){
    return Math.floor(Math.random()*max);
}



function tryToPlaceShip(gameField, x, y) {
    if (gameField[y][x].toUpperCase() == "X") {
        return false;
    } 

    console.log("first ship:","y",y,"x",x)
    if (x == 0 && y == 0) { // kontrollin aint alt ja paremalt 0,0
        if (gameField[y][x+2].toUpperCase() != "X" && gameField[y][x+1].toUpperCase() != "X" && gameField[y+1][x].toUpperCase() != "X" 
        && gameField[y+1][x+1].toUpperCase() != "X") {
            gameField[y][x] = "x";
            gameField[y][x+1] = "X"
            return true;         
        }
    } 

    if (y == 0 && x == gameField.length-1) { // kontrollin aint vasakult ja alt 0,2
        if (gameField[y][x-1].toUpperCase() != "X" && gameField[y][x-2].toUpperCase() != "X" && gameField[y+1][x].toUpperCase() != "X" 
        && gameField[y+1][x-1].toUpperCase() != "X") {
            gameField[y][x] = "X";
            gameField[y][x-1] = "x"
            return true; 
        }
    }   


    if (y == gameField.length - 1 && x == 0) { //kontrollin aint paremalt ja 6levalt, 2,0
        if(gameField[y][x+2].toUpperCase() != "X" && gameField[y][x+1].toUpperCase() != "X" && gameField[y-1][x].toUpperCase() != "X" 
        && gameField[y-1][x+1].toUpperCase() != "X") {
            gameField[y][x] = "x";
            gameField[y][x+1] = "X"
            return true; 
        }
    }

    if (y == gameField.length -1 && x == gameField.length - 1) { // kontrollin vasakult ja 6levalt 2,2
        if (gameField[y][x-2].toUpperCase() != "X" && gameField[y][x-1].toUpperCase() != "X" && gameField[y-1][x].toUpperCase() != "X" 
        && gameField[y-1][x-1].toUpperCase() != "X") {
            gameField[y][x] = "X";
            gameField[y][x-1] = "x"
            return true; 
        }
    }

    if (x == 0) {  //1,0 
        if(y < gameField.length - 2 && y > 0 && gameField[y-1][x].toUpperCase() != "X" && gameField[y-1][x+1].toUpperCase() != "X" && gameField[y+1][x].toUpperCase() != "X" 
            && gameField[y+1][x+1].toUpperCase() != "X" && gameField[y][x+2].toUpperCase() != "X" && gameField[y][x+1].toUpperCase() != "X") {
                gameField[y][x] = "x";
                gameField[y][x+1] = "X"
                return true;
        } else {
            console.log("i hate js");
            return false;
        }
    }

    if (x == gameField.length - 1) { // 1,2
        if(y < gameField.length - 2 && y > 0 && gameField[y-1][x].toUpperCase() != "X" && gameField[y-1][x-1].toUpperCase() != "X" && gameField[y+1][x].toUpperCase() != "X" 
            && gameField[y+1][x-1].toUpperCase() != "X" && gameField[y][x-2].toUpperCase() != "X" && gameField[y][x-1].toUpperCase() != "X") {
                gameField[y][x] = "X";
                gameField[y][x-1] = "x"
                return true;
            
        } else {
            console.log("i hate js");
            return false;
        }
    }

    if (y == gameField.length - 1) { // kontrollin vasakult, alt, 6levatl 2,1
         // kontrollin paremalt, vasakult ja alt 0,whateever
         if(x < gameField.length - 2 && x > 0 && gameField[y][x+2].toUpperCase() != "X" && gameField[y][x+1].toUpperCase() != "X" && gameField[y-1][x].toUpperCase() != "X" 
                && gameField[y-1][x+1].toUpperCase() != "X" && gameField[y][x-1].toUpperCase() != "X") {
                gameField[y][x] = "x";
                gameField[y][x+1] = "X"
                return true; 
                
        } else {
            console.log("i hate");
            return false;
        }
    }

    if (y == 0) { 
         // kontrollin paremalt, vasakult ja alt 0,whateever

         if(x < gameField.length - 2 && x > 0 && gameField[y][x+2].toUpperCase() != "X" && gameField[y][x+1].toUpperCase() != "X" && gameField[y+1][x].toUpperCase() != "X" 
                && gameField[y+1][x+1].toUpperCase() != "X" && gameField[y][x-1].toUpperCase() != "X") {
                    gameField[y][x] = "x";
                    gameField[y][x+1] = "X"
                    return true; 
         } else {
             console.log("bla");
             return false;
         }
    }

    if (x < gameField.length - 2 && x > 1 && gameField[y][x+2].toUpperCase() != "X" && gameField[y][x+1].toUpperCase() != "X" && gameField[y+1][x].toUpperCase() != "X" 
    && gameField[y+1][x+1].toUpperCase() != "X" && gameField[y-1][x].toUpperCase() != "X" && gameField[y-1][x+1].toUpperCase() != "X"
    && gameField[y-1][x-1].toUpperCase() != "X" && gameField[y][x-2].toUpperCase() != "X" && gameField[y][x-1].toUpperCase() != "X" 
    && gameField[y+1][x-1].toUpperCase() != "X") {
        gameField[y][x] = "x";
        gameField[y][x+1] = "X"
        return true; 
    }
    return false;
}


function placeShips(gameField, shipCount) {  // esialgsed laevad paika
    for (var i = 0; i < shipCount; i++) {
        var x = getRandomInt(gameField.length);
        var y = getRandomInt(gameField.length);
        if (!tryToPlaceShip(gameField, x, y)) {
            i--; 
            console.log("try again " + i);
        }
        console.log("x=" + x + " y="+ y);   
    }
}
var gameNumber = 1;
var shipCount = 0;
var timeStarted = 0;

function startGame() {
    timeStarted = new Date();
    document.getElementById("timeStarted").innerHTML = timeStarted.toUTCString();
    gameOver = false;
    playerTurns = 0;
    playerScore = 0;
    opponentScore = 0;
    opponentTurns = 0;

    var gridSize = document.getElementById("gridForm").value;

    shipCount = document.getElementById("shipForm").value;
    console.log("shipCount = ", shipCount, ",gridsize = ", gridSize);

    if (!enoughShips(gridSize, shipCount)) {
        console.log("abort ")
        return; //abort start xd
    }
    gameField = createGameField(gridSize);
    opponentField = createGameField(gridSize);
    

    shipsToDestroy = shipCount * 2;
    placeShips(gameField, shipCount);
    placeShips(opponentField, shipCount);
    renderAll();
    startTimer();

}

var timeInterval = null;

function setTimerInHtml() {
    document.getElementById("timer").innerHTML = "Game time: " + value++;
}

function startTimer() {
    stopTimer();
    value = 0;
    timeInterval = setInterval(setTimerInHtml, 1000);
}

function stopTimer() {
    clearInterval(timeInterval);
}