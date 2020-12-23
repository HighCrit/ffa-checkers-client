import React from 'react';
import { DropTarget } from 'react-dnd';
import DragType from '../../enums/DragType';
import Game from '../../game/Game';
import Piece from '../piece/Piece';
import PlayerPiece from '../piece/PlayerPiece';
import Cell from './Cell';

class BlackCell extends Cell {
    constructor(props) {
        super(props);
        const { playerColor, position, isKing } = this.props;
        this.state = {
            playerColor, position, isKing
        };
    }

    componentDidUpdate(prevProps) {
        const { playerColor, position, isKing } = this.props;
        if (playerColor !== prevProps.playerColor || position !== prevProps.position || isKing !== prevProps.isKing) {
            this.setState({ playerColor, position, isKing });
        }
    }

    render() {
        let piece = null;
        if (this.props.playerColor) {
            if (this.props.playerColor === Game.playerColor) {
                piece = <PlayerPiece {...this.state}/>;
            } else {
                piece = <Piece {...this.state}/>;
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
        Game.sendMove(monitor.getItem().position, props.index);
    },
    canDrop: (props, monitor) => Game.canMove(monitor.getItem().position, props.index)
}, (connect, monitor) => {
    return { 
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        connectDropTarget: connect.dropTarget() 
    };
})(BlackCell);
