import React from 'react'

interface SelectProps {
  labelName: string
  labelId: string
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  options: { text: string; id: number }[]
  selected: string
}

const Select: React.FC<SelectProps> = ({
  labelId,
  handleChange,
  labelName,
  options,
  selected,
}) => {
  return (
    <div className="my-5 text-sm">
      <label htmlFor={labelId} className="block text-black">
        {labelName}
      </label>
      <select
        id={labelId}
        className="rounded-sm px-4 py-3 mt-3 focus:outline-none bg-gray-100 w-full"
        onChange={handleChange}
      >
        {options.map((x) => (
          <option
            key={x.id}
            selected={!!options.find((x) => x.text === selected)}
          >
            {x.text}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Select
