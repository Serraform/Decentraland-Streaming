import React, {  HTMLProps } from 'react'

const  IndeterminateCheckbox = ({
    indeterminate,
    className = '',
    ...rest
  }: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) => {
    const ref = React.useRef<HTMLInputElement>(null!)
  
    React.useEffect(() => {
      if (typeof indeterminate === 'boolean') {
        ref.current.indeterminate = !rest.checked && indeterminate
      }
    }, [ref, indeterminate, rest.checked])
  
    return (
      <input
        type="checkbox"
        ref={ref}
        className={className + ' cursor-pointer !bg-transparent'}
        {...rest}
      />
    )
  }

  export default IndeterminateCheckbox