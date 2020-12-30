class Move {
    constructor(start, end, takes = null) {
        this.start = start;
        this.end = end;
        this.takes = takes;
        this.promoting = false;
    }
}

export default Move;
