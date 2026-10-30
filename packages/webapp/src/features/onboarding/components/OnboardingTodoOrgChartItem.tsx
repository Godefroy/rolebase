import { useNavigateOrg } from '@/org/hooks/useNavigateOrg'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { track } from 'src/analytics'
import useOrgChartTourStatus from '../hooks/useOrgChartTourStatus'
import OnboardingTodoItem from './OnboardingTodoItem'

interface Props {
  done: boolean
}

// Todo line (re)starting the org chart tour on the org chart
export default function OnboardingTodoOrgChartItem({ done }: Props) {
  const { t } = useTranslation()
  const navigateOrg = useNavigateOrg()
  const { status, setStatus } = useOrgChartTourStatus()

  const handleClick = () => {
    if (!done && status !== 'started') {
      track('org_tour_started', { source: 'todo' })
      setStatus('started')
    }
    navigateOrg('roles')
  }

  return (
    <OnboardingTodoItem
      done={done}
      label={t('OnboardingTodo.items.orgChart')}
      onClick={handleClick}
    />
  )
}
