import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button 
            className="square"
            onClick={props.onClick}
            style={props.isWinner ? { background: 'gold' } : {}}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]} 
                onClick={() => this.props.onClick(i)}
                isWinner={this.props.winners.includes(i)}
                key={i}
            />
        );
    }

    render() {
        return (
            <div>
            {Array(3).fill(0).map((_, i) => {
                    return (
                        <div className="board-row" key={i+'-parent'}>
                            {Array(3).fill(0).map((_, k) => {
                                return this.renderSquare(i * 3 + k)
                            })}
                        </div>
                    );
                })}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{ squares: Array(9).fill(null), }],
            stepNumber: 0,
            isXNext: true,
            sortMovesAscending: false,
            winners: [],
        };
    }

    nextPlayer() {
        return this.state.xIsNext ? 'X' : 'O';
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (squares[i] || this.state.winners.length > 0) {
            return;
        }
        squares[i] = this.nextPlayer();
        let winner = calculateWinner(squares)
        let winners = [];
        if (winner) {
            winners = winner.squares;
        }
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            winners: winners,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            let movePos = '';
            if (move > 0 ) {
                let lastMove = history[move - 1].squares;
                let row, col, player;
                step.squares.forEach((square, i) => {
                    if (square && lastMove[i] == null) { 
                        col = i % 3 + 1;
                        // TODO: Is there a better way for this?
                        if (i < 3) {
                            row = 1;
                        } else if (i < 6) {
                            row = 2;
                        } else {
                            row = 3;
                        }
                        player = square;
                    }
                })

                movePos = ` (${col}, ${row}) ${player}`
            }
            const desc = move ?
                'Go to move #' + move + movePos:
                'Go to game start';
            return (
                <li key={move}>
                    <button 
                        onClick={() => this.jumpTo(move)} 
                        style={move === history.length - 1 ? {fontWeight: 'bold'} : {fontWeight: 'normal'}}
                    >{desc}</button>
                </li>
            );
        });


        let status;
        if (winner) {
            status = 'Winner: ' + winner.player;
        } else if(history.length === 10) {
            status = 'Draw';
        } else {
            status = 'Next player: ' + this.nextPlayer();
        }


        if (!this.state.sortMovesAscending) {
            moves.reverse();
        }
        
        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        winners={this.state.winners}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                  <div>{ status }</div>
                  <ol>{ moves }</ol>
                  <button onClick={() => this.setState({sortMovesAscending: !this.state.sortMovesAscending})}>{ this.state.sortMovesAscending ? 'Desc' : 'Asc' }</button>
                  <button onClick={() => this.setState({stepNumber: 0, history: [{ squares: Array(9).fill(null)}], winners: []})}>Restart</button>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
            player: squares[a],
            squares: [a, b, c],
        };
    }
  }
  return null;
}
