import React from 'react';
import { DragSource } from 'react-dnd';
import Piece from './Piece';
import DragType from '../../enums/DragType';

class PlayerPiece extends Piece {
    componentDidMount() {
        const img = document.createElement('img');
        img.setAttribute('src', this.state.imgUrl);
        this.props.connectDragPreview(img);
    }

    render() {
        const { isDragging, connectDragSource } = this.props;
        return connectDragSource(
            <div className={isDragging ? 'piece dragging' : 'piece'}>
                <img src={this.state.imgUrl}></img>
            </div>
        );
    }
}
 
export default DragSource(DragType.PIECE, { beginDrag: (props) => {
    return { ...props }; 
}  }, (connect, monitor) => {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        item: monitor.getItem(),
        isDragging: monitor.isDragging()
    };
})(PlayerPiece);
