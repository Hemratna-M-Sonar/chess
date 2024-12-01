import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx';

const Landing = () => {

    const navigate = useNavigate();
  return (
    <div className='flex justify-center'>
        <div className='pt-8 max-w-screen-lg'>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className='flex justify-center'>
                    <img src={"./chessboard.png"} alt="" className='max-w-96'/>
                </div>
                <div className='pt-16'>
                    <div className="flex justify-center">
                        <h1 className='text-5xl font-bold text-white text-center'>
                            Play Chess Online on the #1 Site!
                        </h1>
                    </div>
                    <div className='mt-8 flex justify-center'>
                        <Button onClick={() => {navigate("/game")}} >
                            Play Online
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Landing