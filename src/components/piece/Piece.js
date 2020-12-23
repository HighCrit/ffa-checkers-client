import React, { Component } from 'react';
import './piece.scss';

class Piece extends Component {
    constructor(props) {
        super(props);
        const { playerColor, position, isKing } = this.props;
        this.state = {
            playerColor, position, isKing,
            imgUrl: this.getImgUrl()
        };
    }

    getImgUrl() {
        return process.env.PUBLIC_URL + '/pieces/' + this.props.playerColor + (this.props.isKing ? '_king' : '_piece') + '.png';
    }

    componentDidUpdate(prevProps) {
        const { playerColor, position, isKing } = this.props;
        if (playerColor !== prevProps.playerColor || position !== prevProps.position || isKing !== prevProps.isKing) {
            this.setState({ playerColor, position, isKing, imgUrl: this.getImgUrl() });
        }
    }

    render() {        
        return (
            <div className={'piece'}>
                <img draggable={false} src={this.state.imgUrl}></img>
            </div>
        );
    }
}
 
export default Piece;
