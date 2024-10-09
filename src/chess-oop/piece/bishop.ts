import GameBoard from "../gameboard";
import { Piece } from "./piece";
import { board } from "../gameboard";
import { EmptyPiece } from "./EmptyPiece";
import { pos_move_t, pos_atk_t, highlight_pos } from "./piece";
import WB from "../../assets/piece_img/WB.png";
import BB from "../../assets/piece_img/BB.png";

function pos_in_board(pos: [number, number]) {
    return 0 <= pos[0] && pos[0] < 8 && 0 <= pos[1] && pos[1] < 8;
}

export class Bishop extends Piece {
    public constructor(is_white: boolean, pos: [number, number]) {
        super(pos, is_white, "B");
    }

    public get_symbol() {
        if (this.is_white) {
            return WB;
        } else {
            return BB;
        }
    }

    public moves(
        gameBoard: GameBoard
    ): [(pos_move_t | pos_atk_t)[], highlight_pos[]] {
        let board: board = gameBoard.display();
        let pos: [number, number] = super.get_pos();
        let moves_func: [(pos_move_t | pos_atk_t)[], highlight_pos[]] = [
            [],
            [],
        ];
        // Normal moves SE
        let i = 1;
        for (
            i = 1;
            pos[0] + i < 8 &&
            pos[1] + i < 8 &&
            board[pos[0] + i][pos[1] + i].is_empty();
            i++
        ) {
            moves_func[0].push([[pos[0] + i, pos[1] + i]]);
            moves_func[1].push({ green: [pos[0] + i, pos[1] + i] });
        }
        // ATK SE
        if (
            pos[0] + i < 8 &&
            pos[1] + i < 8 &&
            gameBoard.has_enemy([pos[0] + i, pos[1] + i], this.get_is_white())
        ) {
            moves_func[0].push([
                [pos[0] + i, pos[1] + i],
                [pos[0] + i, pos[1] + i],
            ]);
            moves_func[1].push({ green: [pos[0] + i, pos[1] + i] });
        }

        // Normal moves NW
        i = -1;
        for (
            i = -1;
            pos[0] + i >= 0 &&
            pos[1] + i >= 0 &&
            board[pos[0] + i][pos[1] + i].is_empty();
            i--
        ) {
            moves_func[0].push([[pos[0] + i, pos[1] + i]]);
            moves_func[1].push({ green: [pos[0] + i, pos[1] + i] });
        }
        // ATK NW
        if (
            pos[0] + i >= 0 &&
            pos[1] + i >= 0 &&
            gameBoard.has_enemy([pos[0] + i, pos[1] + i], this.get_is_white())
        ) {
            moves_func[0].push([
                [pos[0] + i, pos[1] + i],
                [pos[0] + i, pos[1] + i],
            ]);
            moves_func[1].push({ green: [pos[0] + i, pos[1] + i] });
        }

        // Normal moves NE
        i = 1;
        for (
            i = 1;
            pos[0] - i >= 0 &&
            pos[1] + i < 8 &&
            board[pos[0] - i][pos[1] + i].is_empty();
            i++
        ) {
            moves_func[0].push([[pos[0] - i, pos[1] + i]]);
            moves_func[1].push({ green: [pos[0] - i, pos[1] + i] });
        }
        // ATK NW
        if (
            pos[0] - i >= 0 &&
            pos[1] + i < 8 &&
            gameBoard.has_enemy([pos[0] - i, pos[1] + i], this.get_is_white())
        ) {
            moves_func[0].push([
                [pos[0] - i, pos[1] + i],
                [pos[0] - i, pos[1] + i],
            ]);
            moves_func[1].push({ green: [pos[0] - i, pos[1] + i] });
        }

        // Normal moves NE
        i = -1;
        for (
            i = -1;
            pos[0] - i < 8 &&
            pos[1] + i >= 0 &&
            board[pos[0] - i][pos[1] + i].is_empty();
            i--
        ) {
            moves_func[0].push([[pos[0] - i, pos[1] + i]]);
            moves_func[1].push({ green: [pos[0] - i, pos[1] + i] });
        }
        // ATK NW
        if (
            pos[0] - i < 8 &&
            pos[1] + i >= 0 &&
            gameBoard.has_enemy([pos[0] - i, pos[1] + i], this.get_is_white())
        ) {
            moves_func[0].push([
                [pos[0] - i, pos[1] + i],
                [pos[0] - i, pos[1] + i],
            ]);
            moves_func[1].push({ green: [pos[0] - i, pos[1] + i] });
        }

        return moves_func;
    }

    public can_kill(i: number, j: number, board: GameBoard): boolean {
        let moves: (pos_move_t | pos_atk_t)[] = this.moves(board)[0];

        for (let move_i = 0; move_i < moves.length; move_i++) {
            // check if move is attack
            if (this.get_pos()[0] == 6 && this.get_pos()[1] == 4) {
                console.log("OK", moves[move_i]);
            }
            if (moves[move_i].length == 2) {
                // check if deleted piece is at position i,j
                if (moves[move_i][0][0] == i && moves[move_i][0][1] == j) {
                    return true;
                }
            }
        }

        return false;
    }
}
