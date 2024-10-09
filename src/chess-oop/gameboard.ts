import Player from "./player";
import { Piece } from "./piece/piece";
import { Pawn } from "./piece/pawn";
import { Rook } from "./piece/rook";
import { EmptyPiece } from "./piece/EmptyPiece";
import { pos_atk_t, pos_move_t, highlight_pos } from "./piece/piece";
import { Bishop } from "./piece/bishop";
import { Horse } from "./piece/horse";
import { Queen } from "./piece/queen";
import { King } from "./piece/king";

function createMatrix(N: number, M: number) {
    var matrix: board = new Array(N); // Array with initial size of N, not fixed!

    for (var i = 0; i < N; ++i) {
        let arr: Piece[] = Array(M);
        arr = arr.fill(new EmptyPiece());
        matrix[i] = arr;
    }

    return matrix;
}

export type board = Piece[][];

export default class GameBoard {
    private readonly board: board;
    private readonly players: Player[];
    private turn_is_white: boolean;
    //             [B   , W   ]
    private kings: [King, King];

    public constructor(
        height: number = 8,
        width: number = 8,
        board: board | null
    ) {
        this.turn_is_white = true;
        if (board != null) {
            this.board = board;
        } else {
            this.board = createMatrix(height, width);
            this.board[1][0] = new Pawn(true, [1, 0]);
            this.board[1][1] = new Pawn(true, [1, 1]);
            this.board[1][2] = new Pawn(true, [1, 2]);
            this.board[1][3] = new Pawn(true, [1, 3]);
            this.board[1][4] = new Pawn(true, [1, 4]);
            this.board[1][5] = new Pawn(true, [1, 5]);
            this.board[1][6] = new Pawn(true, [1, 6]);
            this.board[1][7] = new Pawn(true, [1, 7]);

            this.board[0][0] = new Rook(true, [0, 0]);
            this.board[0][1] = new Horse(true, [0, 1]);
            this.board[0][2] = new Bishop(true, [0, 2]);
            this.board[0][3] = new Queen(true, [0, 3]);
            this.board[0][4] = new King(true, [0, 4]);
            this.board[0][5] = new Bishop(true, [0, 5]);
            this.board[0][6] = new Horse(true, [0, 6]);
            this.board[0][7] = new Rook(true, [0, 7]);

            this.board[6][0] = new Pawn(false, [6, 0]);
            this.board[6][1] = new Pawn(false, [6, 1]);
            this.board[6][2] = new Pawn(false, [6, 2]);
            this.board[6][3] = new Pawn(false, [6, 3]);
            this.board[6][4] = new Pawn(false, [6, 4]);
            this.board[6][5] = new Pawn(false, [6, 5]);
            this.board[6][6] = new Pawn(false, [6, 6]);
            this.board[6][7] = new Pawn(false, [6, 7]);

            this.board[7][0] = new Rook(false, [7, 0]);
            this.board[7][1] = new Horse(false, [7, 1]);
            this.board[7][2] = new Bishop(false, [7, 2]);
            this.board[7][3] = new King(false, [7, 3]);
            this.board[7][4] = new Queen(false, [7, 4]);
            this.board[7][5] = new Bishop(false, [7, 5]);
            this.board[7][6] = new Horse(false, [7, 6]);
            this.board[7][7] = new Rook(false, [7, 7]);

            this.kings = [this.board[7][3], this.board[0][4]];
        }
    }

    public get_turn_iswhite(): boolean {
        return this.turn_is_white;
    }

    public is_being_attakcked(i: number, j: number): boolean {
        let piece_is_white = this.board[i][j].get_is_white();
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                // check if piece is enemy && is attack [i,j]
                if (this.has_enemy([row, col], piece_is_white)) {
                    if (this.board[row][col].can_kill(i, j, this)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    public get_legal_moves(
        pos: [number, number]
    ): [(pos_move_t | pos_atk_t)[], highlight_pos[]] {
        let piece: Piece = this.board[pos[0]][pos[1]];
        let piece_moves_func: [(pos_move_t | pos_atk_t)[], highlight_pos[]] =
            piece.moves(this);

        // Other restrictions
        // check if the piece belongs to the person whose turn it is.
        if (
            this.get_piece(pos[0], pos[1]).get_is_white() !=
            this.get_turn_iswhite()
        ) {
            return [[], []];
        }
        // check if king is being attacked
        let king_pos: [number, number];
        if (this.get_turn_iswhite()) {
            king_pos = this.kings[1].get_pos();
        } else {
            king_pos = this.kings[0].get_pos();
        }

        return piece_moves_func;
    }

    public display(): board {
        return this.board;
    }

    public get_piece(i: number, j: number): Piece {
        return this.board[i][j];
    }

    public has_enemy(pos: [number, number], is_white: boolean): boolean {
        return (
            this.board[pos[0]][pos[1]].is_white != is_white &&
            !this.board[pos[0]][pos[1]].is_empty()
        );
    }

    public move(moves: pos_move_t | pos_atk_t, pos: [number, number]) {
        let rollback: Piece[] = [];
        // Move move
        if (moves.length === 1) {
            let move = moves[0];
            this.board[move[0]][move[1]] = this.board[pos[0]][pos[1]];
            this.board[move[0]][move[1]].set_pos(move);
            this.board[pos[0]][pos[1]] = new EmptyPiece();
        }
        // Attack move
        if (moves.length === 2) {
            let del_move = moves[0];
            rollback.push(this.board[del_move[0]][del_move[1]]);
            this.board[del_move[0]][del_move[1]] = new EmptyPiece();
            let move = moves[1];
            this.board[move[0]][move[1]] = this.board[pos[0]][pos[1]];
            this.board[move[0]][move[1]].set_pos(move);
            this.board[pos[0]][pos[1]] = new EmptyPiece();
        }

        // is the king being attacked now?
        let king_pos: [number, number];
        if (this.get_turn_iswhite()) {
            king_pos = this.kings[1].get_pos();
        } else {
            king_pos = this.kings[0].get_pos();
        }
        if (this.is_being_attakcked(king_pos[0], king_pos[1])) {
            // since king is being attacked rollback.
            // Was move Move?
            if (moves.length == 1) {
                let move = moves[0];
                this.board[pos[0]][pos[1]] = this.board[move[0]][move[1]];
                this.board[pos[0]][pos[1]].set_pos(pos);
                this.board[move[0]][move[1]] = new EmptyPiece();
                return;
            } else if (moves.length == 2) {
                // was move Atk?
                // undo move
                let move = moves[1];
                this.board[pos[0]][pos[1]] = this.board[move[0]][move[1]];
                this.board[pos[1]][pos[1]].set_pos(pos);
                this.board[move[0]][move[1]] = new EmptyPiece();
                // undo delete
                let del_move = moves[0];
                this.board[del_move[0]][del_move[1]] = rollback[0];
                return;
            }
        }

        this.turn_is_white = !this.turn_is_white;
    }

    public str_to_piece(
        is_white: boolean,
        piece_str: string,
        pos: [number, number]
    ): Piece {
        piece_str = piece_str.toLowerCase();
        let piece: Piece = new EmptyPiece();
        //if (e.toLowerCase() in ["p", "r", "h", "b", "k", "q"])
        if (piece_str === "k") {
            piece = new King(is_white, pos);
        } else if (piece_str === "q") {
            piece = new Queen(is_white, pos);
        } else if (piece_str === "b") {
            piece = new Bishop(is_white, pos);
        } else if (piece_str === "h") {
            piece = new Horse(is_white, pos);
        } else if (piece_str === "r") {
            piece = new Rook(is_white, pos);
        } else if (piece_str === "p") {
            piece = new Pawn(is_white, pos);
        }

        return piece;
    }

    public set_piece(
        is_white: boolean,
        piece_str: string,
        pos: [number, number]
    ) {
        this.board[pos[0]][pos[1]] = this.str_to_piece(
            is_white,
            piece_str,
            pos
        );
    }

    public del_piece(pos: [number, number]) {
        this.board[pos[0]][pos[1]] = new EmptyPiece();
    }
}
