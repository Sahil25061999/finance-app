import React from "react";

export function FormInput({
  onChange,
  type,
  name,
  id,
  required = true,
  ...rest
}) {
  return (
    <input
      {...rest}
      className=" rounded-md p-1 bg-stone-800"
      onChange={onChange}
      type={type}
      name={name}
      id={id}
      required={required}
    />
  );
}
