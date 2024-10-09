import GameBoard from "../gameboard";
import { Piece } from "./piece";
import { board } from "../gameboard";
import { pos_move_t, pos_atk_t, highlight_pos } from "./piece";
import WK from "../../assets/piece_img/WK.png";
import BK from "../../assets/piece_img/BK.png";

function pos_in_board(pos: [number, number]) {
    return 0 <= pos[0] && pos[0] < 8 && 0 <= pos[1] && pos[1] < 8;
}

export class King extends Piece {
    public constructor(is_white: boolean, pos: [number, number]) {
        super(pos, is_white, "K");
    }

    public get_symbol() {
        if (this.is_white) {
            return WK;
        } else {
            return BK;
        }
    }

    public moves(
        gameBoard: GameBoard
    ): [(pos_move_t | pos_atk_t)[], highlight_pos[]] {
        const calc_moves = (new_pos: [number, number]) => {
            if (pos_in_board(new_pos)) {
                if (board[new_pos[0]][new_pos[1]].is_empty()) {
                    moves_func[0].push([new_pos]);
                    moves_func[1].push({ green: new_pos });
                } else if (gameBoard.has_enemy(new_pos, piece.get_is_white())) {
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
        let piece: Piece = board[pos[0]][pos[1]];
        // S
        let new_pos: [number, number] = [pos[0] + 1, pos[1]];
        calc_moves(new_pos);

        // NE
        new_pos = [pos[0] + 1, pos[1] + 1];
        calc_moves(new_pos);

        // E
        new_pos = [pos[0], pos[1] + 1];
        calc_moves(new_pos);

        //NE
        new_pos = [pos[0] - 1, pos[1] + 1];
        calc_moves(new_pos);

        // N
        new_pos = [pos[0] - 1, pos[1]];
        calc_moves(new_pos);

        // NW
        new_pos = [pos[0] - 1, pos[1] - 1];
        calc_moves(new_pos);

        // W
        new_pos = [pos[0], pos[1] - 1];
        calc_moves(new_pos);

        // SW
        new_pos = [pos[0] + 1, pos[1] - 1];
        calc_moves(new_pos);

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
