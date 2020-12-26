import React from 'react';
import Game from '../base/Game';

class ReplayGame extends Game {
    componentDidMount() {
        fetch(process.env.REACT_APP_API_URL + '/replays/' + this.props.id)
            .then((res) => res.json())
            .then((data) => {
                console.warn(data);
            });
    }

    render() { 
        return (
            <div>

            </div>
        );
    }
}
 
export default ReplayGame;
