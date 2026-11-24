import { ChakraProps } from '@chakra-ui/react'

// Title of a list item: up to 2 lines in stacked rows, one truncated line otherwise
export function getListItemTitleProps(stacked: boolean): ChakraProps {
  return stacked
    ? {
        display: 'block',
        noOfLines: 2,
        wordBreak: 'break-word',
        fontSize: '14px',
        lineHeight: 'short',
      }
    : {
        display: 'block',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }
}
