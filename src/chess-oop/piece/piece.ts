import Player from "../player";
import GameBoard, { board } from "../gameboard";

type pos_move_t = [[number, number]];
//                new_position      delete_position
type pos_atk_t = [[number, number], [number, number]];
type highlight_pos = {
    red?: [number, number];
    green?: [number, number];
};

export abstract class Piece {
    public is_white: boolean;
    private pos: [number, number];
    public readonly symbol: string;

    public constructor(
        pos: [number, number],
        is_white: boolean,
        symbol: string
    ) {
        this.pos = pos;
        this.is_white = is_white;
        this.symbol = symbol;
    }

    public abstract get_symbol();

    public get_key() {
        return this.symbol;
    }

    public abstract moves(
        board: GameBoard
    ): [(pos_move_t | pos_atk_t)[], highlight_pos[]];

    public set_pos(pos: [number, number]) {
        this.pos = pos;
    }

    public get_pos(): [number, number] {
        return this.pos;
    }

    public get_is_white(): boolean {
        return this.is_white;
    }

    public is_empty(): boolean {
        return false;
    }

    abstract can_kill(i: number, j: number, board: GameBoard): boolean;
}

export type { pos_move_t, highlight_pos, pos_atk_t };
