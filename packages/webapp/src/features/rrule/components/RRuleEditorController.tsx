import React from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import RRuleEditor, { RRuleEditorProps } from './RRuleEditor'

interface Props<Values extends FieldValues> extends Omit<
  RRuleEditorProps,
  'value' | 'onChange'
> {
  name: Path<Values>
  control: Control<Values>
}

export default function RRuleEditorController<Values extends FieldValues>({
  name,
  control,
  ...editorProps
}: Props<Values>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <RRuleEditor
          {...editorProps}
          value={field.value}
          onChange={(value) => field.onChange(value)}
        />
      )}
    />
  )
}
