import Piece from './objects/Piece';
import { MoveSequence, moveSequenceToString } from './objects/MoveSequence';
import GameState from '../enums/GameState';
import socket from '../socketApi';
import Move from '../game/objects/Move';
import { FenToPlayerColor } from '../enums/PlayerColor';
import { toast } from 'react-toastify';

class Game {
    constructor() {
        this.reset();
    }

    reset() {
        this.board = null;
        this.game = null;

        this.players = {};
        this.playerColor = null;
        this.currentPlayer = null;
        this.winner = null;
        this.pieces = new Array(162);
        this.gameState = GameState.WAITING;

        this.moveSet = [];
        this.moveSequence = new MoveSequence();
    }

    registerListeners() {
        this.unregisterListeners();

        socket.socket.on('game-state', (data) => {
            this.gameState = data;
            if (this.game) {
                this.game.setState({ gameState: data });
            }
        });

        socket.socket.on('game-your-color', (data) => {
            this.playerColor = data;
        });

        socket.socket.on('game-board', (data) => {
            this.constructBoard(data);
        });

        socket.socket.on('game-current-player', (data) => {
            this.currentPlayer = data;
            if (this.game) {
                if (this.currentPlayer === this.playerColor) {
                    toast('It\'s your turn', { autoClose: 3000 });
                }
                this.game.setState({ currentPlayer: this.currentPlayer });
            }
        });

        socket.socket.on('game-move-set', (data) => {
            this.setMoves(data);
        });

        socket.socket.on('game-move-result', (data) => {
            if (!data.success) {
                return;
            }
            this.executeMove(data.move);
        });

        socket.socket.on('game-your-color', (data) => {
            this.playerColor = data;
        });

        socket.socket.on('game-won-by', (data) => {
            this.winner = data;
            if (this.game) {
                this.game.setState({ winner: this.winner });
            }
        });

        socket.socket.on('game-piece-promotion', (data) => {
            const piece = this.pieces[data];
            this.pieces[data] = null;
            if (this.board) {
                this.board.setState({ pieces: this.pieces });
            }
            this.pieces[data] = new Piece(piece.playerColor, piece.position, true);
            if (this.board) {
                this.board.setState({ pieces: this.pieces });
            }
        });

        // Let the server know we're done loading
        socket.socket.emit('game-loaded');
    }

    unregisterListeners() {
        socket.socket.off('game-state');
        socket.socket.off('game-your-color');
        socket.socket.off('game-board');
        socket.socket.off('game-current-player');
        socket.socket.off('game-move-set');
        socket.socket.off('game-move-result');
        socket.socket.off('game-won-by');
        socket.socket.off('game-piece-promotion');
    }

    setPlayers(players) {
        this.players = players;
        if (this.game) {
            this.game.setState({ players });
        }
    }

    setPlayerColor(playerColor) {
        this.playerColor = playerColor;
    }

    setBoard(board) {
        this.board = board;
        if (this.board) {
            this.board.setState({ pieces: this.pieces });
        }
    }

    setGame(game) {
        this.game = game;
        if (this.game) {
            this.game.setState({ currentPlayer: this.currentPlayer, players: this.players, gameState: this.gameState, winner: this.winner });
        }
    }

    constructBoard(fen) {
        const playerInfos = fen.split(':');
        playerInfos.forEach((playerInfo) => {
            const playerColor = FenToPlayerColor[playerInfo.charAt(0)];
            const pieces = playerInfo.substring(1).split(',');
            pieces.forEach((piece) => {
                const isKing = piece.charAt(0) === 'K';
                const p = new Piece(playerColor, parseInt(piece, 10), isKing);
                this.pieces[p.position] = p;
            });
        });

        if (this.board) {
            this.board.setState({ pieces: this.pieces });
        }
    }

    getPiece(position) {
        return this.pieces[position];
    }

    setMoves(moveSet) {
        this.moveSet = moveSet;
        this.moveSequence = new MoveSequence();
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
        if (this.moveSet[0].sequence) { // If it's a movesequence i.e. capturing moves
            const moveSequenceString = this.moveSequence.sequence.length > 0 ? this.moveSequence.toString() + 'x' + end : start + 'x' + end;
            const moveSequence = this.moveSet.find(ms => {
                const msString = moveSequenceToString.apply(ms);
                return msString.startsWith(moveSequenceString + 'x') || msString === moveSequenceString;
            });
            const move = moveSequence.sequence.find(m => m.start === start && m.end === end);
            socket.socket.emit('game-move-action', move);
        } else {
            socket.socket.emit('game-move-action', new Move(start, end));
        }
    }

    executeMove(move) {
        const piece = this.pieces[move.start];
        piece.position = move.end;
        this.pieces[move.start] = null;
        this.pieces[move.end] = piece;

        if (move.takes) {
            this.pieces[move.takes.position] = null;
        }
        
        this.moveSequence.addMove(move);

        if (this.board) {
            this.board.setState({ pieces: this.pieces });
        }
    }
}

const game = new Game();
export default game;
