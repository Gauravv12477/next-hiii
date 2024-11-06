import React from 'react'

const CommandDiv = ({label} : {label: string}) => {
  return (
    <div className="border rounded-sm px-1 font-sans">
    {label}
  </div>
  )
}

export default CommandDiv