import React from 'react'
import { Input } from '../ui/input'

const HiddenInput = ({classname}:any) => {
  return (
    <div>
        <Input className={classname}/>
    </div>
  )
}

export default HiddenInput