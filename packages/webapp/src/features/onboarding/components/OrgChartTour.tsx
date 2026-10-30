import { GraphContext } from '@/graph/contexts/GraphContext'
import useCurrentMember from '@/member/hooks/useCurrentMember'
import { useOrgContext } from '@/org/contexts/OrgContext'
import {
  Button,
  Flex,
  Heading,
  ListItem,
  Spacer,
  Text,
  UnorderedList,
} from '@chakra-ui/react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { track } from 'src/analytics'
import useOrgChartTour, {
  OrgChartTourMoreStep,
  orgChartTourMoreSteps,
  OrgChartTourStep,
  orgChartTourSteps,
} from '../hooks/useOrgChartTour'
import useTourTargetRect, { TourTarget } from '../hooks/useTourTargetRect'
import OnboardingProgress from './OnboardingProgress'
import OrgChartTourIllustration from './OrgChartTourIllustration'
import OrgChartTourStage from './OrgChartTourStage'

interface Props {
  // Circle open in the side panel
  circleId?: string
}

// Guided tour of the org chart: a card beside the element to use, and a
// spotlight on it. See useOrgChartTour for the steps.
export default function OrgChartTour({ circleId }: Props) {
  const { t } = useTranslation()
  const { org } = useOrgContext()
  const currentMember = useCurrentMember()
  // Holds the graph by reference: read it when needed, never at render
  const graphContext = useContext(GraphContext)
  const {
    active,
    step,
    rootCircle,
    role,
    roleName,
    unplacedMembers,
    leaderRole,
    representativeRole,
    canGoFurther,
    moreStep,
    moreIndex,
    moreReached,
    startMore,
    goToMore,
    next,
    complete,
    skip,
  } = useOrgChartTour(circleId)

  const targets: Record<OrgChartTourStep, TourTarget | undefined> = {
    openOrg: rootCircle && { nodeId: rootCircle.id },
    addRole: { anchor: 'add-role' },
    // The new role in the list of the open panel, else in the org chart
    openRole:
      role &&
      (role.parentId && role.parentId === circleId
        ? { anchor: `role-${role.id}` }
        : { nodeId: role.id }),
    assignMember: { anchor: 'add-member' },
    placeEveryone: undefined,
  }
  // The explanations point at the open panel, if any: nothing to click
  const moreTargets: Record<OrgChartTourMoreStep, TourTarget | undefined> = {
    leader: { anchor: 'add-role' },
    representative: { anchor: 'add-role' },
    participants: { anchor: 'participants' },
  }
  // A step reached earlier, shown again from the progress bar. Only its card
  // and spotlight come back: the org chart keeps its state, and the next
  // action, or the current segment, returns to the actual step.
  const [reviewIndex, setReviewIndex] = useState<number>()
  useEffect(() => setReviewIndex(undefined), [step])
  const stepIndex = step ? orgChartTourSteps.indexOf(step) : 0
  const shownStep: OrgChartTourStep =
    reviewIndex !== undefined && reviewIndex < stepIndex
      ? orgChartTourSteps[reviewIndex]
      : (step ?? orgChartTourSteps[0])

  const target = !active
    ? undefined
    : moreStep
      ? moreTargets[moreStep]
      : shownStep && targets[shownStep]
  const rect = useTourTargetRect(target)

  // Report each step passed, once the next one shows
  const previousStep = useRef<OrgChartTourStep>()
  useEffect(() => {
    if (!active) return
    const previous = previousStep.current
    if (
      previous &&
      (!step ||
        orgChartTourSteps.indexOf(step) > orgChartTourSteps.indexOf(previous))
    ) {
      track('org_tour_step_done', { step: previous })
    }
    previousStep.current = step
  }, [active, step])

  // Without the parent's panel open, the new role is shown in the org chart:
  // zoom on it, since next to the org's circle it may be too small to be
  // drawn, hence to be clicked (a small screen above all). After the focus on
  // the selected circle, and once the graph has its nodes after a reload.
  useEffect(() => {
    if (!active || step !== 'openRole' || !role || role.parentId === circleId)
      return
    // Framed on its own radius: the default focus keeps a floor that leaves
    // a small org's roles tiny
    const timeout = setTimeout(() => {
      const graph = graphContext?.graph
      const node = graph?.nodes.find((n) => n.data.id === role.id)
      if (node) graph?.zoomTo(node.x, node.y, node.r)
    }, 700)
    return () => clearTimeout(timeout)
  }, [active, step, role?.id, circleId])

  // Below lg the page scrolls as one, the panel under the org chart: bring
  // the target into view, once the page has scrolled back up to the org chart
  // on selection (see CirclesPage)
  const targetKey = target && JSON.stringify(target)
  useEffect(() => {
    if (!target) return
    const timeout = setTimeout(() => {
      const isOffScreen = (top: number, height: number) =>
        top + height / 2 < 0 || top + height / 2 > window.innerHeight
      if ('anchor' in target) {
        const element = document.querySelector(`[data-tour="${target.anchor}"]`)
        const box = element?.getBoundingClientRect()
        if (box && isOffScreen(box.top, box.height)) {
          element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      } else {
        const box = graphContext?.graph?.getNodeClientRect(target.nodeId)
        if (box && isOffScreen(box.top, box.height)) {
          document
            .getElementById('circles-graph')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }, 600)
    return () => clearTimeout(timeout)
  }, [targetKey, circleId])

  // Suggest someone else than the person: the tour is about the team
  const suggestedMember =
    unplacedMembers?.find((m) => m.id !== currentMember?.id) ??
    unplacedMembers?.[0]
  const values = {
    org: org?.name ?? '',
    role: roleName ?? '',
    button: t('CircleRoleSubCircles.addRole'),
    name: suggestedMember?.name ?? '',
    count: unplacedMembers?.length ?? 0,
    leader: leaderRole?.name ?? '',
    representative: representativeRole?.name ?? '',
    names:
      unplacedMembers
        ?.map((m) =>
          m.id === currentMember?.id
            ? t('OrgSetupModal.members.you', { name: m.name })
            : m.name
        )
        .join(', ') ?? '',
  }
  const isEnd = shownStep === 'placeEveryone' && !moreStep
  const { title, text } = moreStep
    ? {
        title: t(`OrgChartTour.more.${moreStep}.title`, values),
        text: t(`OrgChartTour.more.${moreStep}.text`, values),
      }
    : isEnd && values.count === 0
      ? {
          title: t('OrgChartTour.steps.placeEveryone.allPlaced.title'),
          text: t('OrgChartTour.steps.placeEveryone.allPlaced.text'),
        }
      : {
          title: t(`OrgChartTour.steps.${shownStep}.title`, values),
          text: t(`OrgChartTour.steps.${shownStep}.text`, values),
        }
  // Instructions, one per line, shown as a list readable at a glance
  const actions = (
    moreStep === 'leader'
      ? // The add button is in the open panel, if any
        circleId
        ? t('OrgChartTour.more.leader.actions', values)
        : t('OrgChartTour.more.leader.actionsOpenTeam', values)
      : moreStep
        ? ''
        : shownStep === 'addRole'
          ? t('OrgChartTour.steps.addRole.actions', values)
          : isEnd && values.count > 0
            ? t('OrgChartTour.steps.placeEveryone.actions', values)
            : ''
  )
    .split('\n')
    .filter(Boolean)

  return (
    <OrgChartTourStage
      stepKey={
        active && step
          ? `${moreStep ?? shownStep}:${targetKey ?? ''}:${isEnd && values.count === 0}`
          : undefined
      }
      rect={rect}
      hasTarget={!!target}
    >
      <OnboardingProgress
        total={
          moreStep ? orgChartTourMoreSteps.length : orgChartTourSteps.length
        }
        current={moreStep ? moreIndex : orgChartTourSteps.indexOf(shownStep)}
        reached={moreStep ? moreReached : stepIndex}
        onStepSelect={moreStep ? goToMore : setReviewIndex}
        mt={-2}
        mb={2}
      />
      {moreStep && <OrgChartTourIllustration step={moreStep} />}
      <Heading as="h2" size="sm" mb={2}>
        {title}
      </Heading>
      <Text fontSize="sm">{text}</Text>
      {actions.length > 0 && (
        <UnorderedList fontSize="sm" mt={2} spacing={1}>
          {actions.map((action) => (
            <ListItem key={action}>{action}</ListItem>
          ))}
        </UnorderedList>
      )}

      <Flex mt={4} align="center" gap={2}>
        {moreStep ? (
          <Button variant="link" size="sm" onClick={complete}>
            {t('common.close')}
          </Button>
        ) : (
          (!isEnd || canGoFurther) && (
            <Button variant="link" size="sm" onClick={skip}>
              {t('OrgChartTour.skip')}
            </Button>
          )
        )}
        <Spacer />
        {/* The end leads on to leaders and participants, when the model has
            them: skipping stays one click away */}
        {isEnd && (
          <Button
            size="sm"
            colorScheme="blue"
            onClick={canGoFurther ? startMore : complete}
          >
            {canGoFurther ? t('common.continue') : t('OrgChartTour.finish')}
          </Button>
        )}
        {moreStep && (
          <Button size="sm" colorScheme="blue" onClick={next}>
            {moreIndex < orgChartTourMoreSteps.length - 1
              ? t('common.next')
              : t('OrgChartTour.finish')}
          </Button>
        )}
      </Flex>
    </OrgChartTourStage>
  )
}
