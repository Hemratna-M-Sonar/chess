import React from 'react'
import Button from './Button'
import { useNavigate } from 'react-router-dom'

const Result = ({result}) => {
    const navigate = useNavigate();
  return (
    <div>   
        <div className='w-80 h-80 bg-neutral-800 flez justify-center border border-white'>
            <div className='w-full h-24 bg-neutral-700 flex justify-center items-center'>
                <img className='w-14' src={result === "You win!" ? "./trophy.png" : "./loser.png"} alt="" />
            </div>
            <div className='w-full h-56 flex justify-evenly items-center flex-col'>
                <div className='text-white flex flex-col items-center'>
                    <p className='font-bold text-3xl'>{result}</p>
                    <p>By Checkmate</p>
                </div>
                <div>
                    <Button onClick={() => navigate("/")}>
                        New Match
                    </Button>
                </div>
            </div>
        </div>
    </div>
    
  )
}

export default Result