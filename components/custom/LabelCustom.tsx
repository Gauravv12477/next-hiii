import React from 'react'

interface LabelCustomTypes {
    label: String,
    className?: String
}

const LabelCustom = ({label, className}: LabelCustomTypes ) => {
  return (
    <div className={`inline font-bold text-4xl ${className}`}>
        {label}
    </div>
  )
}

export default LabelCustom