import { EditorHandle } from '@rolebase/editor/react'
import React, { ForwardedRef, forwardRef, RefAttributes } from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import SimpleEditor from './SimpleEditor'

interface Props<Values extends FieldValues> {
  name: Path<Values>
  control: Control<Values>
  placeholder?: string
  autoFocus?: boolean
  minHeight?: string
}

function EditorController<Values extends FieldValues>(
  { name, placeholder, autoFocus, control, minHeight }: Props<Values>,
  ref: ForwardedRef<EditorHandle>
) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={'' as any}
      render={({ field }) => (
        <SimpleEditor
          ref={ref}
          value={field.value as string}
          onChange={field.onChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          minH={minHeight === undefined ? '4em' : minHeight}
        />
      )}
    />
  )
}

export default forwardRef(EditorController) as any as <
  Values extends FieldValues,
>(
  props: Props<Values> & RefAttributes<EditorHandle>
) => ReturnType<typeof EditorController>
