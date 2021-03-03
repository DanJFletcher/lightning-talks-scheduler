import React from 'react'

interface FormProps {
    title: string
    handleSubmit: ((event: React.FormEvent<HTMLFormElement>) => void) | undefined
}

const Form: React.FC<FormProps> = ({title, handleSubmit, children}) => {
    return (
        <div className="bg-white lg:w-4/12 md:6/12 w-10/12 m-auto my-10 shadow-md">
            <div className="py-8 px-8 rounded-xl">
                <h1 className="font-medium text-2xl mt-3 text-center">{ title }</h1>
                <form onSubmit={handleSubmit} className="mt-6 text-left">
                    {children}
                </form>
            </div>
        </div>
    )
}

export default Form