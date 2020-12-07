import React from 'react';
import { DropTarget } from 'react-dnd';
import DragType from '../../enums/DragType';
import Game from '../../game/Game';
import Move from '../../game/objects/Move';
import Piece from '../piece/Piece';
import PlayerPiece from '../piece/PlayerPiece';
import Cell from './Cell';

class BlackCell extends Cell {  
    constructor(props) {
        super(props);
        this.state = {
            piece: null
        };
    }

    update() {
        this.setState({ piece: Game.getPiece(this.props.index) });
    }

    render() {
        let piece = null;
        if (this.state.piece !== null) {
            if (this.state.piece.playerColor === Game.playerColor) {
                piece = <PlayerPiece {...this.state.piece}/>;
            } else {
                piece = <Piece {...this.state.piece}/>;
            }
        }
        const { isOver, canDrop, connectDropTarget } = this.props;
        const className = 'board-cell black' + (isOver && canDrop ? ' hovering' : '') + (canDrop ? ' droppable' : '');

        return connectDropTarget(
            <div className={className}>
                {piece}
            </div>
        );
    }
}
 
export default DropTarget(DragType.PIECE, { 
    drop: (props, monitor) => {
        Game.executeMove(new Move(monitor.getItem().position, props.index));
    },
    canDrop: (props, monitor) => Game.canMove(monitor.getItem().position, props.index)
}, (connect, monitor) => {
    return { 
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        connectDropTarget: connect.dropTarget() 
    };
})(BlackCell);
