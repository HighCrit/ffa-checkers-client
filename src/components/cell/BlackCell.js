import React from 'react';
import { DropTarget } from 'react-dnd';
import DragType from '../../enums/DragType';
import GameUtils from '../../game/GameUtils';
import Piece from '../piece/Piece';
import PlayerPiece from '../piece/PlayerPiece';
import Cell from './Cell';

class BlackCell extends Cell {
    render() {
        const { playerColor, position, isKing, isMine, isOver, canDrop, connectDropTarget } = this.props;
        let piece = null;
        if (playerColor) {
            if (isMine) {
                piece = <PlayerPiece { ...{ playerColor, position, isKing }}/>;
            } else {
                piece = <Piece { ...{ playerColor, position, isKing }}/>;
            }
        }
        const className = 'board-cell black' + (isOver && canDrop ? ' hovering' : '') + (canDrop ? ' droppable' : '') + (this.props.lastMove ? ' last-move' : '');

        return connectDropTarget(
            <div className={className}>
                {piece}
            </div>
        );
    }
}
 
export default DropTarget(DragType.PIECE, { 
    drop: (props, monitor) => {
        GameUtils.sendMove(monitor.getItem().position, props.index);
    },
    canDrop: (props, monitor) => GameUtils.canMove(monitor.getItem().position, props.index)
}, (connect, monitor) => {
    return { 
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        connectDropTarget: connect.dropTarget() 
    };
})(BlackCell);
