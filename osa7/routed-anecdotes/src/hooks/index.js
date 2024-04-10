import { useState } from 'react'

export const useField = (initialValue) => {
  const [value, setValue] = useState('')

  const onChange = (e) => {
    setValue(e.target.value)
  }

  const reset = () => {
    setValue(initialValue);
  };

  return {
    value,
    onChange,
    reset
  }
}
