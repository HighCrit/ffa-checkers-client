class Move {
    constructor(oldPosition, newPosition, takes = null) {
        this.oldPosition = oldPosition;
        this.newPosition = newPosition;
        this.takes = takes;
    }
}

export default Move;
