import {useEffect, useState } from 'react';
import './App.css';

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState('X');
  const [aiTurn, setAiTurn] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const opponent = player === "X" ? "O" : "X"
  const messages = {
    X: "X won the game!",
    O: "O won the game!",
    'draw': "Draw!",
    false: ""
  }

useEffect(()=>{
  setBoard(board)
}, [board])


  const winningPos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ]
  // a function to check if someone won
  const checkWinner = (board) =>{
    var winner = false;
    winningPos.forEach(([x,y,z] )=> {
      if(board[x] && board[y] && board[z] && board[x] === board[y] && board[y] === board[z]){
        winner =  board[x];
      }
    })
    if(board.includes(null) === false && winner === false){
      winner = 'draw';
      }
    return winner;
  }

  // returns all the available spots to play in
  const getEmptyPositions = (board) => {
    const positions = []
    for(let i = 0; i<board.length; i++){
      if (board[i] == null){
        positions.push(i);
      }
    }
    return positions
  }

  
  const handleChoice = (id) =>{
    setGameStarted(true)
      if(board[id] == null && checkWinner(board) === false){
        board[id] = player;
        AiMove();
        setAiTurn(!aiTurn)
        
        
      }
      
      
  }

  // Resets the game
  const handleReset = () => {
    for(let i = 0; i < board.length; i++){
      board[i] = null
    }
    setAiTurn(false)
    setGameStarted(false)
  } 


  let scores  = {
    X: player === 'X' ? -10 : 10,
    O: player === 'X' ? 10 : -10,
    'draw': 0
  }


    // minimax algorithm
    const miniMax = (board, isMax) =>{
      const winner = checkWinner(board);
      if(board.includes(null) === false && winner === false){
        return scores['draw']
      }else if (winner !== false){
        return scores[winner]
      }

      //player is maximizing
      if(isMax){
        let bestScore = -1000
        getEmptyPositions(board).forEach(move=>{
          board[move] = opponent;
          let score = miniMax(board, false);
          board[move] = null; 
          bestScore = Math.max(score, bestScore)
        })
        return bestScore

      // player is minimizing
      }else{
        let bestScore = 1000
        getEmptyPositions(board).forEach(move=>{
          board[move] = player;
          let score = miniMax(board, true);
          board[move] = null; 
          bestScore = Math.min(score, bestScore);
        })
        return bestScore;
      }
  }

  const AiMove = () => {
    let bestScore = -1000;
    let bestMove = null;
    getEmptyPositions(board).forEach(move =>{
      board[move] = opponent;
      let score = miniMax(board, false);
      console.log(score)
      board[move] = null; // or make a copy of the board
      if(score > bestScore){
        bestScore = score;
        bestMove = move;
      } 
    })
    board[bestMove] = opponent
    setAiTurn(!aiTurn)
  }

  return (
    <div className="App">
      <h1 className = "title">Tic-Tac-Toe</h1>
      {messages[checkWinner(board)] && <h1>{messages[checkWinner(board)]}</h1>}
      
      {/* Creating the board */}
      <div className="board" style = {{gridTemplateColumns: `repeat(3, ${'110px'})`}}>
        {board.map((row, id)=> <div key={id} className = {"cell " + board[id]}
        onClick={()=>handleChoice(id)}>{board[id]}</div>)}
      </div>
      {checkWinner(board) !== false && <div className = "btn" onClick = {()=> handleReset()}>Reset</div>}
      
      {!gameStarted && <>
      <div className="option">Select Player</div>
      <div className = "player_selection">
        <div className = {"cell " + (player === "X"? "selected": "not_selected")} onClick = {()=>setPlayer("X")}>X</div>
        <div className = {"cell " + (player === "O"? "selected": "not_selected")} onClick ={()=>setPlayer("O")}>O</div>
      </div>
      </>}

    </div>

  );

}

export default App;
