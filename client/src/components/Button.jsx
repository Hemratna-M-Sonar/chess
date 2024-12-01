import React from 'react'

const Button = ({onClick, children}) => {
  return (
    <div>
        <button onClick={onClick} className='py-4 px-8 bg-lime-600 hover:bg-lime-300 text-white font-bold rounded'>
            {children}
        </button>
    </div>
  )
}

export default Button