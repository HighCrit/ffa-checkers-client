class Move {
    constructor(start, end, takes = null) {
        this.start = start;
        this.end = end;
        this.takes = takes;
    }
}

export default Move;
