import type { CirclesGraphViews } from '@rolebase/shared/model/graph'
import type { DemoOrgKey, DemoTexts } from '../../../demo/orgDemoData'
import DemoGraphEditor from './DemoGraphEditor'
import DemoOrgProvider from './DemoOrgProvider'
import DemoProviders from './DemoProviders'

interface Props {
  demo: DemoOrgKey
  texts: DemoTexts
  lang: string
  height: string
  // Org chart framing, driven by the tabs above the island
  view: CirclesGraphViews
}

// Heavy part of the product-preview island (Chakra + Apollo + webapp panels +
// graph + the live in-memory org provider). Loaded lazily by DemoOrgEditor.
export default function DemoOrgEditorInner({
  demo,
  texts,
  lang,
  height,
  view,
}: Props) {
  return (
    <DemoProviders lang={lang}>
      <DemoOrgProvider demo={demo} texts={texts}>
        <DemoGraphEditor ui={texts.ui} height={height} view={view} />
      </DemoOrgProvider>
    </DemoProviders>
  )
}
