import React, { useState } from 'react'

const ChessBoard = ({socket, board, setBoard, chess}) => {

    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);

  return (
    <div className='text-white'>
        {
            board.map((row, i) => {
                return <div key={i} className='flex'>
                    {
                        row.map((square, j) => {

                            // current square representation
                            const sqrRepr = String.fromCharCode(97 + (j % 8)) + "" + (8 - i);

                            return <div onClick={() => {
                                if (!from) {
                                    setFrom(sqrRepr)
                                } else {
                                    // setTo(square?.square ?? null);
                                    socket.send(JSON.stringify({
                                        type: "move",
                                        payload: {
                                            move: {
                                                from: from,
                                                to: sqrRepr
                                            }
                                        }
                                    }))
                                    setFrom(null);
                                    chess.move({
                                        from,
                                        to: sqrRepr
                                    })
                                    setBoard(chess.board());
                                    console.log({
                                        from, to:sqrRepr
                                    })
                                }
                            }} key={j} className={`w-16 h-16 ${(i+j)%2 === 1 ? 'bg-lime-600 opacity-80' : 'bg-gray-200'}`}>
                                <div className='w-full flex justify-center h-full'>
                                    <div className='h-full flex flex-col justify-center text-black'>
                                        {
                                            square ? <img className='w-12' src={`/${square?.color === "b" ? square?.type : `${square.type?.toUpperCase()} copy`}.svg`} /> : null
                                        }
                                    </div>
                                </div>
                            </div>
                        })  
                    }
                </div>
            })
        }
    </div>
  )
}

export default ChessBoard