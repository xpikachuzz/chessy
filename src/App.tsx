import { useRef, useState } from "react";
import React from "react";
import "./App.css";
import GameBoard from "./chess-oop/gameboard";
import { pos_atk_t, pos_move_t, highlight_pos } from "./chess-oop/piece/piece";
import BB from "./assets/piece_img/BB.png";

function App() {
    // white piece at top row.
    let [board, setBoard] = useState<GameBoard>(new GameBoard(8, 8, null));
    let [isPieceHeld, setIsPieceHeld] = useState<Boolean>(false);
    let [pieceHeld, setPieceHeld] = useState<[number, number]>([-1, -1]);
    let [isDefeat, setIsDefeat] = useState<string>("");
    let [hover, setHover] = useState<[number, number]>([-1, -1]);

    const get_board = () => {
        if (isPieceHeld == false) {
            return (
                <div
                    className="board"
                    style={{ gridTemplateColumns: `auto `.repeat(8) }}
                >
                    {board.display().map((brd_row, i) => {
                        return brd_row.map((brd_cell, j) => {
                            return (
                                <button
                                    className="brd_cell"
                                    key={i * 10 + j}
                                    onClick={() => {
                                        setIsPieceHeld(true);
                                        setPieceHeld([i, j]);
                                    }}
                                    onMouseEnter={() => {
                                        setHover([i, j]);
                                    }}
                                    onMouseLeave={() => setHover([-1, -1])}
                                >
                                    <img src={brd_cell.get_symbol()}></img>
                                </button>
                            );
                        });
                    })}
                </div>
            );
        } else {
            // get legal moves
            let [moves, moves_highlight]: [
                (pos_move_t | pos_atk_t)[],
                highlight_pos[]
            ] = board.get_legal_moves([pieceHeld[0], pieceHeld[1]]);
            // Check if moves exist.
            if (moves.length == 0) {
                setIsPieceHeld(false);
            }

            return (
                <div
                    className="board"
                    style={{ gridTemplateColumns: `auto `.repeat(8) }}
                >
                    {board.display().map((brd_row, i) => {
                        return brd_row.map((brd_cell, j) => {
                            let includ: number = -1;
                            //
                            let k: number;
                            for (k = 0; k < moves_highlight.length; k++) {
                                if (moves_highlight[k]["green"] !== undefined) {
                                    if (
                                        moves_highlight[k]["green"][0] == i &&
                                        moves_highlight[k]["green"][1] == j
                                    ) {
                                        includ = 1;
                                        break;
                                    }
                                }
                            }

                            if (includ == 1) {
                                return (
                                    <button
                                        className="brd_cell-walk"
                                        key={i * 10 + j}
                                        onClick={() => {
                                            //making the move;
                                            board.move(moves[k], pieceHeld);
                                            setIsPieceHeld(false);
                                        }}
                                        onMouseEnter={() => {
                                            setHover([i, j]);
                                        }}
                                        onMouseLeave={() => setHover([-1, -1])}
                                    >
                                        <img src={brd_cell.get_symbol()}></img>
                                    </button>
                                );
                            } else {
                                return (
                                    <button
                                        className="brd_cell"
                                        key={i * 10 + j}
                                        onClick={() => {
                                            setIsPieceHeld(false);
                                        }}
                                        onMouseEnter={() => {
                                            setHover([i, j]);
                                        }}
                                        onMouseLeave={() => setHover([-1, -1])}
                                    >
                                        <img src={brd_cell.get_symbol()}></img>
                                    </button>
                                );
                            }
                        });
                    })}
                </div>
            );
        }
    };

    let fade_q: string =
        isDefeat !== "" ? "fade-in 2s forwards" : "fade-out 2s forwards";
    return (
        <div>
            <button
                onClick={() => {
                    if (isDefeat !== "") {
                        return;
                    }
                    setIsDefeat("White");
                }}
            >
                Commit defeat!
            </button>
            <button
                onKeyDown={({ key: e }) => {
                    let is_white_edit: boolean = true;
                    if (!(hover[0] === -1 && hover[1] === -1)) {
                        console.log(e.toLowerCase());
                        if (
                            ["p", "r", "h", "b", "k", "q"].includes(
                                e.toLowerCase()
                            )
                        ) {
                            board.set_piece(is_white_edit, e, hover);
                            setPieceHeld([pieceHeld[0] * 2, pieceHeld[1] * 2]);
                        } else if (e.toLowerCase() === "backspace") {
                            board.del_piece(hover);
                        }
                    }
                }}
            >
                ✏️
            </button>
            <div
                className={isDefeat == "" ? "" : "defeat_div"}
                style={{
                    animation: fade_q,
                }}
            >
                <div className="defeat_popup">
                    <h5>{isDefeat} has given up!</h5>
                    <button
                        className="restart-btn"
                        onClick={() => {
                            setIsDefeat("");
                            setBoard(new GameBoard(8, 8, null));
                        }}
                    >
                        Restart
                    </button>
                </div>
            </div>
            <div>{get_board()}</div>
            <button
                onKeyDown={({ key: e }) => {
                    let is_white_edit: boolean = false;
                    if (!(hover[0] === -1 && hover[1] === -1)) {
                        console.log(e.toLowerCase());
                        if (
                            ["p", "r", "h", "b", "k", "q"].includes(
                                e.toLowerCase()
                            )
                        ) {
                            board.set_piece(is_white_edit, e, hover);
                            setPieceHeld([pieceHeld[0] * 2, pieceHeld[1] * 2]);
                        } else if (e.toLowerCase() === "backspace") {
                            board.del_piece(hover);
                        }
                    }
                }}
            >
                ✏️
            </button>
            <button
                onClick={() => {
                    if (isDefeat !== "") {
                        return;
                    }
                    setIsDefeat("Black");
                }}
            >
                Commit defeat!
            </button>
        </div>
    );
}

export default App;
