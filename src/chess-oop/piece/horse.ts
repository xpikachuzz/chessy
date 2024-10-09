import GameBoard from "../gameboard";
import { Piece } from "./piece";
import { board } from "../gameboard";
import { pos_move_t, pos_atk_t, highlight_pos } from "./piece";
import WH from "../../assets/piece_img/WH.png";
import BH from "../../assets/piece_img/BH.png";

function pos_in_board(pos: [number, number]) {
    return 0 <= pos[0] && pos[0] < 8 && 0 <= pos[1] && pos[1] < 8;
}

export class Horse extends Piece {
    public constructor(is_white: boolean, pos: [number, number]) {
        super(pos, is_white, "H");
    }

    public get_symbol() {
        if (this.is_white) {
            return WH;
        } else {
            return BH;
        }
    }

    public moves(
        gameBoard: GameBoard
    ): [(pos_move_t | pos_atk_t)[], highlight_pos[]] {
        const calc_moves = (new_pos: [number, number]) => {
            if (
                new_pos[0] < 8 &&
                new_pos[1] < 8 &&
                new_pos[0] >= 0 &&
                new_pos[1] >= 0
            ) {
                if (board[new_pos[0]][new_pos[1]].is_empty()) {
                    moves_func[0].push([new_pos]);
                    moves_func[1].push({ green: new_pos });
                } else if (gameBoard.has_enemy(new_pos, super.get_is_white())) {
                    moves_func[0].push([new_pos, new_pos]);
                    moves_func[1].push({ green: new_pos });
                }
            }
        };
        let board: board = gameBoard.display();
        let pos: [number, number] = super.get_pos();
        let moves_func: [(pos_move_t | pos_atk_t)[], highlight_pos[]] = [
            [],
            [],
        ];
        // NE [+1,+2], [+2, +1] - Move
        calc_moves([pos[0] + 1, pos[1] + 2]);
        calc_moves([pos[0] + 2, pos[1] + 1]);
        // NW
        calc_moves([pos[0] + 1, pos[1] - 2]);
        calc_moves([pos[0] + 2, pos[1] - 1]);

        // SE
        calc_moves([pos[0] - 1, pos[1] - 2]);
        calc_moves([pos[0] - 2, pos[1] - 1]);

        // SW
        calc_moves([pos[0] - 1, pos[1] + 2]);
        calc_moves([pos[0] - 2, pos[1] + 1]);

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
