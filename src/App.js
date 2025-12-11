import { useState } from 'react';

function Square({ value, highlight, onSquareClick }) {
  return (
    <button className="square" style={{ '--bg-color': (highlight ? '#ffff00' : '#fff') }} onClick={onSquareClick}>
      {value}
    </button>
    );
}

function Board({ squares, xIsNext, onPlay }) { // squares는 currentSquares
  function handleClick(i) { // i: 사용자가 누른 게임판 좌표
    if(squares[i] || calculateWinner(squares)) return;
    const nextSquares = squares.slice(); // squares 복제
    nextSquares[i] = xIsNext ? "X" : "O"; // 게임판에 ox 표기
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const winningLine = getWinningLine(squares);
  let status = winner ? "Winner: " + winner 
                : squares.includes(null) ? "Next player: " + (xIsNext ? "X" : "O") 
                : "Draw!";
  const board = [];

  for(let i = 0; i < 3; i++) {
    const boardRow = [];
    
    for(let j = 0; j < 3; j++) {
      const idx = j + i * 3
      boardRow.push(<Square key={idx} value={squares[idx]} highlight={winningLine.includes(idx)} onSquareClick={() => handleClick(idx)} />)
    }
    board.push(<div key={i} className='board-row'>{boardRow}</div>);
  }

  return (
    <>
      <div className='status'>{status}</div>
      {board}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isDes, setIsDes] = useState(false);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleToggle() {
    setIsDes(!isDes);
  }

  let moves = history.map((squares, move) => {
    let description = move > 0 ? 'Go to move #' + move : 'Go to game start';
    return (
      <li key={move}>
        {move === currentMove 
        ? <span>You are at move #{move}</span> 
        : <button onClick={() => jumpTo(move)}>{description}</button>}
      </li>
    );
  });

  if(isDes) moves = moves.slice().reverse();

  return (
    <div className='game'>
      <div className='game-board'>
        <Board squares={currentSquares} xIsNext={xIsNext} onPlay={handlePlay}/>
      </div>
      <div className='game-info'>
        <div className='toggle-wrapper'>
          <input type='checkbox' id='sort-toggle' className='toggle-input' checked={isDes} onChange={handleToggle} />
          <label htmlFor='sort-toggle' className='toggle-label'>
            <span className='toggle-text left'>DES</span>
            <span className='toggle-text right'>ASC</span>
            <span className='toggle-slider'></span>{/* 손잡이 */}
          </label>
        </div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for(let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

function getWinningLine(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for(let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }

  return [];
}