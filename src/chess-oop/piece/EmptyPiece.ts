import GameBoard from "../gameboard";
import { Piece } from "./piece";
import { board } from "../gameboard";
import { pos_move_t, pos_atk_t, highlight_pos } from "./piece";

export class EmptyPiece extends Piece {
    public constructor() {
        super([-1, -1], true, " - ");
    }

    public moves(
        gameBoard: GameBoard
    ): [(pos_move_t | pos_atk_t)[], highlight_pos[]] {
        return [[], []];
    }

    public get_symbol() {
        if (this.is_white) {
            return "";
        } else {
            return "";
        }
    }

    public is_empty(): boolean {
        return true;
    }
}
