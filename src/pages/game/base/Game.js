import { Component } from 'react';
import Piece from '../../../game/objects/Piece';
import { MoveSequence, moveSequenceToString } from '../../../game/objects/MoveSequence';
import GameState from '../../../enums/GameState';
import socket from '../../../socketApi';
import Move from '../../../game/objects/Move';
import { FenToPlayerColor } from '../../../enums/PlayerColor';
import GameUtils from '../../../game/GameUtils';

class Game extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            players: {},
            playerColor: null,
            currentPlayer: null,
            winner: null,
            pieces: [],
            lastMove: null,
            gameState: GameState.WAITING,
        };

        this.moveSet = [];
        this.moveSequence = new MoveSequence();

        this.sendMove = this.sendMove.bind(this);
        this.canMove = this.canMove.bind(this);
        GameUtils.sendMove = this.sendMove;
        GameUtils.canMove = this.canMove;
    }

    componentDidMount() {
        // Reset before use
        this.reset();
    }

    reset() {
        this.setState({
            players: {},
            playerColor: null,
            currentPlayer: null,
            winner: null,
            pieces: [],
            gameState: GameState.WAITING,
        });

        this.moveSet = [];
        this.moveSequence = new MoveSequence();
    }

    setGameState(gameState) {
        this.setState({ gameState });
    }

    setPlayers(players) {
        this.setState({ players });
    }

    setPlayerColor(playerColor) {
        this.setState({ playerColor });
    }

    setMoves(moveSet) {
        this.moveSet = moveSet;
        this.moveSequence = new MoveSequence();
    }

    setWinner(winner) {
        this.setState({ winner });
    }

    setCurrentPlayer(currentPlayer) {
        this.setState({ currentPlayer });
        this.moveSet = [];
    }

    constructBoard(fen) {
        const pieces = new Array(162);
        const playerInfos = fen.split(':');

        playerInfos.forEach((playerInfo) => {
            const playerColor = FenToPlayerColor[playerInfo.charAt(0)];
            const pieceStrings = playerInfo.substring(1).split(',');
            pieceStrings.forEach((piece) => {
                const isKing = piece.charAt(0) === 'K';
                const p = new Piece(playerColor, parseInt(isKing ? piece.substring(1) : piece, 10), isKing);
                pieces[p.position] = p;
            });
        });

        this.setState({ pieces });
    }

    canMove(start, end) {
        if (this.moveSet.length > 0) {
            if (this.moveSet[0].sequence) { // If it's a movesequence i.e. capturing moves
                const lastMove = this.moveSequence.last();
                // Check if we use the same piece to continue the sequence
                if (lastMove === null || lastMove.end === start) {
                    const moveSequenceString = this.moveSequence.sequence.length > 0 ? this.moveSequence.toString() + 'x' + end : start + 'x' + end;
                    return this.moveSet.some(ms => {
                        const msString = moveSequenceToString.apply(ms);
                        return msString.startsWith(moveSequenceString + 'x') || msString === moveSequenceString;
                    });
                }
            } else {
                return this.moveSet.some(m => m.start === start && m.end === end);
            }
        }

        return false;
    }

    sendMove(start, end) {
        socket.socket.emit('game-move-action', new Move(start, end));
    }

    executeMove(move) {
        const pieces = this.state.pieces.slice();
        const piece = pieces[move.start];

        if (piece) {
            piece.position = move.end;
            pieces[move.start] = null;
            pieces[move.end] = piece;
    
            if (move.takes) {
                pieces[move.takes.position] = null;
            }

            if (move.promoting) {
                piece.isKing = true;
            }
            
            this.moveSequence.addMove(move);
    
            this.setState({ pieces, lastMove: move });
        } else {
            console.error('Detected de-sync on move:', move);
        } 
    }

    undoMove(move) {
        const pieces = this.state.pieces.slice();
        const piece = pieces[move.end];

        if (piece) {
            piece.position = move.start;
            pieces[move.end] = null;
            pieces[move.start] = piece;

            if (move.takes) {
                pieces[move.takes.position] = move.takes;
            }

            if (move.promoting) {
                piece.isKing = false;
            }

            this.setState({ pieces });
        } else {
            console.error('Detected de-sync on move:', move);
        } 
    }
}

export default Game;