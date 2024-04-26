import React from "react";

export function PrimaryBtn({ onClick, buttonText }) {
  return (
    <button
      onClick={onClick}
      className=" bg-green-500 text-stone-900 text-sm font-medium p-2 rounded-md"
    >
      {buttonText}
    </button>
  );
}
