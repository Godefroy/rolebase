import { useNavigateOrg } from '@/org/hooks/useNavigateOrg'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { track } from 'src/analytics'
import useOrgChartTourStatus from '../hooks/useOrgChartTourStatus'
import OnboardingTodoItem from './OnboardingTodoItem'

interface Props {
  done: boolean
}

// Todo line starting the org chart tour on the org chart. Once checked, it
// replays the tour from its first step
export default function OnboardingTodoOrgChartItem({ done }: Props) {
  const { t } = useTranslation()
  const navigateOrg = useNavigateOrg()
  const { status, setStatus } = useOrgChartTourStatus()

  const handleClick = () => {
    if (status !== 'started' && status !== 'replay' && status !== 'more') {
      track('org_tour_started', { source: 'todo', replay: done })
      setStatus(done ? 'replay' : 'started')
    }
    navigateOrg('roles')
  }

  return (
    <OnboardingTodoItem
      item="orgChart"
      done={done}
      label={t('OnboardingTodo.items.orgChart')}
      onClick={handleClick}
    />
  )
}
