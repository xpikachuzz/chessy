export default class Game {
    private readonly player: Player[];

    constructor(height: number = 8, width: number = 8) {
        this.board = createMatrix(height, width);
        console.log(this.board);
    }

    display(): string[][] {
        return this.board;
    }
}
