// Fork of an original work by Coder on the Road (https://codepen.io/coderontheroad/pen/GdxEo)
var gameField = new Array();
var board = document.getElementById("game-table");
var userScore = document.getElementById("playerScore");
var computerScore = document.getElementById("computerScore");
var networkWarning = document.getElementById("networkWarning");
var buttonRequest = document.getElementById("buttonRequest");
var buttonPlay = document.getElementById("buttonPlay");
var currentCol;
var currentRow;
var currentPlayer;
var balance;
var id = 1;


if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

web3.version.getNetwork((err, netId) => {
    switch (netId) {
      case "1":
        console.log('This is mainnet');
        networkWarning.innerHTML = "This is mainnet, switch to Ropsten test network"
        break
      case "2":
        console.log('This is the deprecated Morden test network.');
        networkWarning.innerHTML = "This is the Morden network, switch to Ropsten test network"
        break
      case "3":
        console.log('This is the ropsten test network.');
        break
      case "4":
        console.log('This is the Rinkeby test network.');
        networkWarning.innerHTML = "This is the Rinkeby network, switch to Ropsten test network"
        break
      case "42":
        console.log('This is the Kovan test network.');
        networkWarning.innerHTML = "This is the Kovan network, switch to Ropsten test network"
        break
      default:
        console.log('This is an unknown network.');
        networkWarning.innerHTML = "This is an unknown network, switch to Ropsten test network"
    }
});

// setTimeout(function(){ 
//     var xhr = new XMLHttpRequest();
//     xhr.open('POST', '/getAddress', true);
//     xhr.addEventListener('load', function(){
//         if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
//             console.log(web3.eth.accounts[0]);
//         }
//     });
//     xhr.send(web3.eth.accounts[0]);
// }, 2000);

//newgame();

var ct4Token = web3.eth.contract([{
                                  "anonymous": false,
                                  "inputs": [
                                    {
                                      "indexed": true,
                                      "name": "from",
                                      "type": "address"
                                    },
                                    {
                                      "indexed": true,
                                      "name": "to",
                                      "type": "address"
                                    },
                                    {
                                      "indexed": false,
                                      "name": "value",
                                      "type": "uint256"
                                    }
                                  ],
                                  "name": "Transfer",
                                  "type": "event"
                                },
                                {
                                  "anonymous": false,
                                  "inputs": [
                                    {
                                      "indexed": true,
                                      "name": "owner",
                                      "type": "address"
                                    },
                                    {
                                      "indexed": true,
                                      "name": "spender",
                                      "type": "address"
                                    },
                                    {
                                      "indexed": false,
                                      "name": "value",
                                      "type": "uint256"
                                    }
                                  ],
                                  "name": "Approval",
                                  "type": "event"
                                },
                                {
                                  "constant": false,
                                  "inputs": [
                                    {
                                      "name": "_spender",
                                      "type": "address"
                                    },
                                    {
                                      "name": "_value",
                                      "type": "uint256"
                                    }
                                  ],
                                  "name": "approve",
                                  "outputs": [
                                    {
                                      "name": "",
                                      "type": "bool"
                                    }
                                  ],
                                  "payable": false,
                                  "stateMutability": "nonpayable",
                                  "type": "function"
                                },
                                {
                                  "constant": false,
                                  "inputs": [
                                    {
                                      "name": "_spender",
                                      "type": "address"
                                    },
                                    {
                                      "name": "_subtractedValue",
                                      "type": "uint256"
                                    }
                                  ],
                                  "name": "decreaseApproval",
                                  "outputs": [
                                    {
                                      "name": "",
                                      "type": "bool"
                                    }
                                  ],
                                  "payable": false,
                                  "stateMutability": "nonpayable",
                                  "type": "function"
                                },
                                {
                                  "constant": false,
                                  "inputs": [
                                    {
                                      "name": "_spender",
                                      "type": "address"
                                    },
                                    {
                                      "name": "_addedValue",
                                      "type": "uint256"
                                    }
                                  ],
                                  "name": "increaseApproval",
                                  "outputs": [
                                    {
                                      "name": "",
                                      "type": "bool"
                                    }
                                  ],
                                  "payable": false,
                                  "stateMutability": "nonpayable",
                                  "type": "function"
                                },
                                {
                                  "constant": false,
                                  "inputs": [
                                    {
                                      "name": "_to",
                                      "type": "address"
                                    },
                                    {
                                      "name": "_value",
                                      "type": "uint256"
                                    }
                                  ],
                                  "name": "transfer",
                                  "outputs": [
                                    {
                                      "name": "",
                                      "type": "bool"
                                    }
                                  ],
                                  "payable": false,
                                  "stateMutability": "nonpayable",
                                  "type": "function"
                                },
                                {
                                  "constant": false,
                                  "inputs": [
                                    {
                                      "name": "_from",
                                      "type": "address"
                                    },
                                    {
                                      "name": "_to",
                                      "type": "address"
                                    },
                                    {
                                      "name": "_value",
                                      "type": "uint256"
                                    }
                                  ],
                                  "name": "transferFrom",
                                  "outputs": [
                                    {
                                      "name": "",
                                      "type": "bool"
                                    }
                                  ],
                                  "payable": false,
                                  "stateMutability": "nonpayable",
                                  "type": "function"
                                },
                                {
                                  "inputs": [],
                                  "payable": false,
                                  "stateMutability": "nonpayable",
                                  "type": "constructor"
                                },
                                {
                                  "constant": true,
                                  "inputs": [
                                    {
                                      "name": "_owner",
                                      "type": "address"
                                    },
                                    {
                                      "name": "_spender",
                                      "type": "address"
                                    }
                                  ],
                                  "name": "allowance",
                                  "outputs": [
                                    {
                                      "name": "",
                                      "type": "uint256"
                                    }
                                  ],
                                  "payable": false,
                                  "stateMutability": "view",
                                  "type": "function"
                                },
                                {
                                  "constant": true,
                                  "inputs": [
                                    {
                                      "name": "_owner",
                                      "type": "address"
                                    }
                                  ],
                                  "name": "balanceOf",
                                  "outputs": [
                                    {
                                      "name": "",
                                      "type": "uint256"
                                    }
                                  ],
                                  "payable": false,
                                  "stateMutability": "view",
                                  "type": "function"
                                },
                                {
                                  "constant": true,
                                  "inputs": [],
                                  "name": "decimals",
                                  "outputs": [
                                    {
                                      "name": "",
                                      "type": "uint8"
                                    }
                                  ],
                                  "payable": false,
                                  "stateMutability": "view",
                                  "type": "function"
                                },
                                {
                                  "constant": true,
                                  "inputs": [],
                                  "name": "INITIAL_SUPPLY",
                                  "outputs": [
                                    {
                                      "name": "",
                                      "type": "uint256"
                                    }
                                  ],
                                  "payable": false,
                                  "stateMutability": "view",
                                  "type": "function"
                                },
                                {
                                  "constant": true,
                                  "inputs": [],
                                  "name": "name",
                                  "outputs": [
                                    {
                                      "name": "",
                                      "type": "string"
                                    }
                                  ],
                                  "payable": false,
                                  "stateMutability": "view",
                                  "type": "function"
                                },
                                {
                                  "constant": true,
                                  "inputs": [],
                                  "name": "symbol",
                                  "outputs": [
                                    {
                                      "name": "",
                                      "type": "string"
                                    }
                                  ],
                                  "payable": false,
                                  "stateMutability": "view",
                                  "type": "function"
                                },
                                {
                                  "constant": true,
                                  "inputs": [],
                                  "name": "totalSupply",
                                  "outputs": [
                                    {
                                      "name": "",
                                      "type": "uint256"
                                    }
                                  ],
                                  "payable": false,
                                  "stateMutability": "view",
                                  "type": "function"
                                }]);

var ct4TokenInstance = ct4Token.at("0x52f2b1aa9a8aa1780f03c99f6cbe01720840c72a");

setInterval(function(){
  ct4TokenInstance.balanceOf(web3.eth.accounts[0], (error, result) => {
      if(!error){
        balance = JSON.stringify(result);
        console.log(balance);
      } else {
        console.error(error);
      }
  });
}, 3000);

buttonRequest.onclick = function(event){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/requestTokens', true);
    xhr.addEventListener('load', function(){
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
            console.log(web3.eth.accounts[0]);
        }
    });
    xhr.send(web3.eth.accounts[0]);
}

buttonPlay.onclick = function(){
  if (balance == 0){
    alert("Your balance is 0! Please request tokens.");
    return
  }

  web3.eth.defaultAccount = web3.eth.accounts[0];
  var params = {
    from: web3.eth.defaultAccount,
    gas: 100000,
  };

  ct4TokenInstance.transfer("0x6f3fF3E713372fABAdb8Be469861B9EddE95809f", 1, params, (error, result) => {
    if(!error){
      console.log(JSON.stringify(result));
    } else {
      console.error(error);
    }
  });

  buttonPlay.disabled = true;
  newgame();
  //$(document).ready(function() {
  //   $("#buttonPlay").addClass("disable");
  //  $("#buttonPlay").prop("disabled", true);
  //}); 
}

function newgame(){
  prepareField();
  placeDisc(Math.floor(Math.random()*2)+1);
}

function checkForVictory(row,col){
  if(getAdj(row,col,0,1)+getAdj(row,col,0,-1) > 2){
    return true;
  } else {
    if(getAdj(row,col,1,0) > 2){
      return true;
    } else {
      if(getAdj(row,col,-1,1)+getAdj(row,col,1,-1) > 2){
        return true;
      } else {
        if(getAdj(row,col,1,1)+getAdj(row,col,-1,-1) > 2){
          return true;
        } else {
          return false;
        }
      }
    }
  }
}

function getAdj(row,col,row_inc,col_inc){
  if(cellVal(row,col) == cellVal(row+row_inc,col+col_inc)){
    return 1+getAdj(row+row_inc,col+col_inc,row_inc,col_inc);
  } else {
    return 0;
  }
}

function cellVal(row,col){
  if(gameField[row] == undefined || gameField[row][col] == undefined){
    return -1;
  } else {
    return gameField[row][col];
  }
}

function firstFreeRow(col,player){
  for(var i = 0; i<6; i++){
    if(gameField[i][col]!=0){
      break;
    }
  }
  gameField[i-1][col] = player;
  return i-1;
}

function possibleColumns(){
  var moves_array = new Array();
  for(var i=0; i<7; i++){
    if(gameField[0][i] == 0){
      moves_array.push(i);
    }
  }
  return moves_array;
}

function think(){
  var possibleMoves = possibleColumns();
  var aiMoves = new Array();
  var blocked;
  var bestBlocked = 0;
  
  for(var i=0; i<possibleMoves.length; i++){
    for(var j=0; j<6; j++){
      if(gameField[j][possibleMoves[i]] != 0){
        break;
      }
    }
    
    gameField[j-1][possibleMoves[i]] = 1;
    blocked = getAdj(j-1,possibleMoves[i],0,1)+getAdj(j-1,possibleMoves[i],0,-1);
    blocked = Math.max(blocked,getAdj(j-1,possibleMoves[i],1,0));
    blocked = Math.max(blocked,getAdj(j-1,possibleMoves[i],-1,1));
    blocked = Math.max(blocked,getAdj(j-1,possibleMoves[i],1,1)+getAdj(j-1, possibleMoves[i],-1,-1));
    
    if(blocked >= bestBlocked){
      if(blocked>bestBlocked){
        bestBlocked = blocked;
        aiMoves = new Array();
      }
      aiMoves.push(possibleMoves[i]);
    }
    gameField[j-1][possibleMoves[i]] = 0;
  }
  
  return aiMoves;
}

function Disc(player){
  this.player = player;
  this.color = player == 1 ? 'red' : 'yellow';
  this.id = id.toString();
  id++;
  
  this.addToScene = function(){
    board.innerHTML += '<div id="d'+this.id+'" class="disc '+this.color+'"></div>';
    if(currentPlayer==2){
      //computer move
      var possibleMoves = think();
      var cpuMove = Math.floor( Math.random() * possibleMoves.length);
      currentCol = possibleMoves[cpuMove];
      document.getElementById('d'+this.id).style.left = (14+60*currentCol)+"px";
      dropDisc(this.id,currentPlayer);
    }
  }
  
  var $this = this;
  document.onmousemove = function(evt){
    if(currentPlayer == 1){
    currentCol = Math.floor((evt.clientX - board.offsetLeft)/60);
    if(currentCol<0){currentCol=undefined;}
    if(currentCol>6){currentCol=undefined;}
    document.getElementById('d'+$this.id).style.left = (14+60*currentCol)+"px";
    document.getElementById('d'+$this.id).style.top = "-55px";
    }
  }
  document.onload = function(evt){
    if(currentPlayer == 1){
    currentCol = Math.floor((evt.clientX - board.offsetLeft)/60);
    if(currentCol<0){currentCol=undefined;}
    if(currentCol>6){currentCol=undefined;}
    document.getElementById('d'+$this.id).style.left = (14+60*currentCol)+"px";
    document.getElementById('d'+$this.id).style.top = "-55px";
    }
  }
  
  document.onclick = function(evt){
    if(currentPlayer == 1){
      if(possibleColumns().indexOf(currentCol) != -1){
        dropDisc($this.id,$this.player);
      }
    }
  }
}

function dropDisc(cid,player){
  currentRow = firstFreeRow(currentCol,player);
  moveit(cid,(14+currentRow*60));
  currentPlayer = player;
  checkForMoveVictory();
}

function checkForMoveVictory(){
  if(!checkForVictory(currentRow,currentCol)){
    placeDisc(3-currentPlayer);
  } else {
    var ww = currentPlayer == 2 ? 'Computer' : 'Player';
    placeDisc(3-currentPlayer);
    alert(ww+" win!");
    if(ww == 'Player'){
      var userCurrent = parseInt(userScore.textContent);
      userScore.innerHTML = userCurrent + 1;
    } else {
      var computerCurrent = parseInt(computerScore.textContent);
      computerScore.innerHTML = computerCurrent + 1;
    }
    board.innerHTML = "<table class='center'><thead><tr><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th></tr></thead><tbody><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table>";
    //newgame();
    buttonPlay.disabled = false;
  }
}

function placeDisc(player){
  currentPlayer = player;
  var disc = new Disc(player);
  disc.addToScene();
}

function prepareField(){
  gameField = new Array();
  for(var i=0; i<6; i++){
    gameField[i] = new Array();
    for(var j=0; j<7; j++){
      gameField[i].push(0);
    }
  }
}

function moveit(who,where){
    document.getElementById('d'+who).style.top = where+'px';
}