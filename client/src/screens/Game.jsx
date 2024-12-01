import React, { useEffect, useRef, useState } from 'react'
import { Chess } from 'chess.js'
import ChessBoard from '../components/ChessBoard.jsx'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx';
import { useSocket } from '../hooks/useSocket.js';
import Result from '../components/Result.jsx';
// import Clock from '../components/Clock.jsx';

const INIT_GAME = "init_game";
const MOVE = "move";
const GAME_OVER = "game_over"

const Game = () => {
    const navigate = useNavigate();
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [started, setStarted] = useState(false);
    const [winner, setWinner] = useState("");
    const [resultmsg, setResultmsg] = useState("");
    const resultDialogBox = useRef(null);


    // For chess clock
    const initialTime = 300; // 5 minutes for each player
    const [whiteTime, setWhiteTime] = useState(initialTime);
    const [blackTime, setBlackTime] = useState(initialTime);
    const [isGameRunning, setIsGameRunning] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState('white');
    const [timer, setTimer] = useState(null);

    // Clock timer
    // Clock timers for white and black players
    useEffect(() => {
        // If the game is running, set intervals for each player
        if (isGameRunning) {
            if (currentPlayer === 'white' && whiteTime > 0) {
                // Start the white timer if it's the white player's turn
                const whiteInterval = setInterval(() => {
                    setWhiteTime((prevTime) => prevTime - 1);
                }, 1000);
                setWhiteTime(whiteInterval);
            } else if (currentPlayer === 'black' && blackTime > 0) {
                // Start the black timer if it's the black player's turn
                const blackInterval = setInterval(() => {
                    setBlackTime((prevTime) => prevTime - 1);
                }, 1000);
                setBlackTime(blackInterval);
            }
        }

        // Clean up the timers when switching players or stopping the game
        return () => {
            if (whiteTime) clearInterval(whiteTime);
            if (blackTime) clearInterval(blackTime);
        };
    }, [isGameRunning, currentPlayer, whiteTime, blackTime]);

    
      const handleStartStop = () => {
        setIsGameRunning(prevState => !prevState);
      };
    
      const handleReset = () => {
        setWhiteTime(initialTime);
        setBlackTime(initialTime);
        setCurrentPlayer('white');
        setIsGameRunning(false);
      };
    
      // Format the time in MM:SS format
      const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      };

    // Socket logic
    useEffect( () => {
        if (!socket) {
            return;
        }
        socket.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            console.log(msg);
            switch (msg.type) {

                case INIT_GAME:
                    setBoard(chess.board());
                    setStarted(true);
                    console.log("Game Initialized");
                    handleStartStop();
                    break;

                case MOVE:
                    const move = msg.payload;
                    chess.move(move);
                    setBoard(chess.board());
                    console.log("Move made")
                    break;

                case GAME_OVER:
                    const finalMove = msg.payload;
                    setBoard(chess.board());
                    // chess.move(finalMove);
                    setWinner(msg.result.winner);
                    setResultmsg(msg.result.message)
                    if (resultDialogBox.current) {
                        setTimeout(() => {
                            resultDialogBox.current.showModal();
                        }, 2000);
                    }
                    console.log(`winner is ${msg.result.winner}`)
                    console.log("Game Over")
                    break;
            
                default:
                    break;
            }
        }
    }, [socket])

    if (!socket) return <div>Connecting...</div>

  return (
    <div className='flex justify-center'>
        
        <div className='pt-8 max-w-screen-lg w-full  flex flex-col items-center'>
            <div className="w-40 h-12 bg-gray-200 border my-5 flex justify-center items-center font-sans font-bold text-xl">
                {formatTime(blackTime)}
            </div>
            <div className='grid grid-cols-6 gap-4 w-full'>
                <div className='col-span-4 w-full flex justify-center'>
                    <ChessBoard socket={socket} board={board} setBoard={setBoard} chess={chess}/>
                </div>
                <div className='col-span-2 bg-stone-700 w-full flex justify-center'>
                    <div className="pt-8">
                        {!started && <Button disabled onClick={() => {
                            socket.send(JSON.stringify({
                                type: INIT_GAME
                            }));

                        }}>
                            Play
                        </Button>} 
                    </div>
                    <div className='w-80 relative'>
                        <dialog ref={resultDialogBox} id='resultbox' className='overflow-hidden'>
                            <button  onClick={() => {resultDialogBox.current.close()}} className='text-white font-extrabold font-sans absolute right-5 top-5'><img src={`./cancel.png`} alt="" className='w-8 text-white bg-white rounded-full border'/></button>
                            <Result result={resultmsg}/>
                        </dialog>
                    </div>
                </div>
            </div>
            <div className="w-40 h-12 bg-gray-200 border my-5 flex justify-center items-center font-sans font-bold text-xl">
                {formatTime(whiteTime)}
            </div>
        </div>
    </div>  
  )
}

export default Game