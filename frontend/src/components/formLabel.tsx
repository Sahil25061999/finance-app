import React from 'react'

export function FormLabel({htmlFor, label}) {
  return (
    <label className=" text-xs text-stone" htmlFor={htmlFor}>{label}</label>
  )
}
