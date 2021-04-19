import React from 'react'

interface SelectProps {
  labelName: string
  labelId: string
  placeholderText: string
  value?: string
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const TextInput: React.FC<SelectProps> = ({
  labelId,
  handleChange,
  labelName,
  placeholderText,
  value,
}) => {
  return (
    <div className="my-5 text-sm">
      <label htmlFor={labelId} className="block text-black">
        {labelName}
      </label>
      <input
        type="text"
        id={labelId}
        className="rounded-sm px-4 py-3 mt-3 focus:outline-none bg-gray-100 w-full"
        placeholder={placeholderText}
        value={value}
        onChange={handleChange}
      />
    </div>
  )
}

export default TextInput
