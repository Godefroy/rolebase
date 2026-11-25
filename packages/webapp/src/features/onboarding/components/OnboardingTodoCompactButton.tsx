import SidebarTopIcon from '@/layout/components/SidebarTopIcon'
import {
  CircularProgress,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import useOnboardingTodo from '../hooks/useOnboardingTodo'
import OnboardingTodo from './OnboardingTodo'

// "Getting started" group in the collapsed sidebar: a progress ring that opens
// the checklist
export default function OnboardingTodoCompactButton() {
  const { t } = useTranslation()
  const { visible, loading, doneCount, total } = useOnboardingTodo()

  if (!visible || loading) return null

  return (
    <Popover placement="right-start" isLazy>
      <PopoverTrigger>
        <SidebarTopIcon
          iconNode={
            <CircularProgress
              value={(doneCount / total) * 100}
              size="22px"
              thickness="14px"
              color="green.400"
              trackColor="blackAlpha.100"
            />
          }
        >
          {`${t('OnboardingTodo.title')} ${doneCount} / ${total}`}
        </SidebarTopIcon>
      </PopoverTrigger>
      <PopoverContent w="300px" border={0} boxShadow="lg" bg="transparent">
        <PopoverBody p={0}>
          <OnboardingTodo />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
