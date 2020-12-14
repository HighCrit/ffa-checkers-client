import Piece from './objects/Piece';
import MoveSequence from './objects/MoveSequence';
import Move from './objects/Move';
import GameState from '../enums/GameState';
import socket from '../socketApi';

class Game {
    constructor() {
        this.board = null;
        this.game = null;

        this.playerColor = null;
        this.pieces = new Array(162);
        this.gameState = GameState.WAITING;

        this.moveSet = [new MoveSequence([new Move(97, 78), new Move(78, 95)])]; // TODO: remove inner list
        this.moveSequence = new MoveSequence();

        this.fen = 'Y128,129,130,131,132,137,138,139,140,141,146,147,148,149,150,155,156,157,158,159:B36,37,45,46,54,55,63,64,72,73,81,82,90,91,99,100,108,109,117,118:G2,3,4,5,6,11,12,13,14,15,20,21,22,23,24,29,30,31,32,33:R43,44,52,53,61,62,70,71,79,80,88,89,97,98,106,107,115,116,124,125';
    }

    registerListeners() {
        socket.socket.on('game-state', (data) => {
            this.gameState = data;
            this.game.setState({ gameState: data });
        });

        socket.socket.on('game-board', (data) => {
            this.constructBoard(data);
        });

        // Let the server know we're done loading
        socket.socket.emit('game-loaded');
    }

    setPlayerColor(playerColor) {
        this.playerColor = playerColor;
    }

    setBoard(board) {
        this.board = board;
    }

    setGame(game) {
        this.game = game;
    }

    constructBoard(fen) {
        const playerInfos = fen.split(':');
        playerInfos.forEach((playerInfo) => {
            const playerColor = playerInfo.charAt(0);
            const pieces = playerInfo.substring(1).split(',');
            pieces.forEach((piece) => {
                const isKing = piece.charAt(0) === 'K';
                const p = new Piece(playerColor, parseInt(piece, 10), isKing);
                this.pieces[p.position] = p;
                this.emitChangesTo(p.position);
            });
        });
    }

    getPiece(position) {
        return this.pieces[position];
    }

    setMoves(moveSet) {
        this.moveSet = moveSet;
        this.moveSequence = new MoveSequence();
    }

    canMove(oldPosition, newPosition) {
        if (this.moveSet.length > 0) {
            if (this.moveSet[0].sequence) { // If it's a movesequence i.e. capturing moves
                const lastMove = this.moveSequence.last();
                // Check if we use the same piece to continue the sequence
                if (lastMove === null || lastMove.newPosition === oldPosition) {
                    const moveSequenceString = this.moveSequence.sequence.length > 0 ? this.moveSequence.toString() + 'x' + newPosition : oldPosition + 'x' + newPosition;
                    return this.moveSet.some(ms => ms.toString().startsWith(moveSequenceString));
                }
            } else {
                return this.moveSet.some(m => m.oldPosition === oldPosition && m.newPosition === newPosition);
            }
        }

        return false;
    }

    executeMove(move) {
        const piece = this.pieces[move.oldPosition];
        piece.position = move.newPosition;
        this.pieces[move.oldPosition] = null;
        this.pieces[move.newPosition] = piece;

        if (move.takes !== null) {
            this.pieces[move.takes.position] = null;
            this.emitChangesTo(move.takes.position);
        }

        this.emitChangesTo(move.oldPosition);
        this.emitChangesTo(move.newPosition);

        this.moveSequence.addMove(move);
    }

    emitChangesTo(index) {
        this.board.onChange(index);
    }
}

const game = new Game();
export default game;
