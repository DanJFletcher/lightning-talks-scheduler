import React from 'react'

interface ButtonProps {
    type: 'button' | 'submit' | 'reset' 
    buttonText: string
    handleClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const Button: React.FC<ButtonProps> = ({type, buttonText, handleClick}) => {
    return (
        <button
            className="block text-center text-white bg-gray-800 p-3 duration-300 rounded-sm hover:bg-black w-full"
            type={type}
            onClick={handleClick}
      >{ buttonText }</button>
    )
}

export default Button