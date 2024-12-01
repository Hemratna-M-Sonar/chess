import { Chess } from 'chess.js'
import { GAME_OVER, INIT_GAME, MOVE } from './message.js';

export class Game {
    
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.moveCount = 0;
        this.startTime = new Date();
        // this.gameover = false;

        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white"
            }
        }))
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black"
            }
        }))
    }

    game_over(move) {
         // Check if game is over
        if (this.board.isGameOver()) {
            // this.gameover = true;
            const winnerColor = this.board.turn() === "w" ? "black" : "white";
            const winner = winnerColor === "black" ? this.player2 : this.player1;
            const loser = winner === this.player1 ? this.player2 : this.player1;
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: move,
                result: {
                    winner: winnerColor,
                    message: winner === this.player1 ? "You win!" : "Opponent wins!"
                }
            }))
            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload: move,
                result: {
                    winner: winnerColor,
                    message: loser === this.player1 ? "You win!" : "Opponent wins!"
                }
            }))
            console.log("result sent to both players")
            return true;

        }
        return false;
    }

    makeMove(socket, move) {

        // validations
        // restricting player 1 and 2 after playing 1 move
        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            return;
        }
        if (this.moveCount % 2 === 1 && socket !== this.player2) {
            return;
        }

        // Is the move valid
        try {
            this.board.move(move);            
        } catch (error) {
            console.log(error);
            return;
        }

        if (this.game_over(move)) {
            console.log("inside this.game_over")
            return;
        }

        if (this.moveCount % 2 === 0) {
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        } else {
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        }
        this.moveCount++;
        // send the updated board to both players
    }
}