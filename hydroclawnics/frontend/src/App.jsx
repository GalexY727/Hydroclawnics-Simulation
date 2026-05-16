import { useMemo, useState } from 'react'
import AgentLog from './AgentLog'
import Farm3D from './Farm3D'
import Navbar from './Navbar'
import PhysicalPot from './PhysicalPot'
import PodDetailModal from './PodDetailModal'
import PodGrid from './PodGrid'
import TabSwitcher from './tabSwitcher'
import useWebSocket from './useWebSocket'

export default function App() {
  const { pods, agentLog, connectionStatus } = useWebSocket()
  const [selectedPodId, setSelectedPodId] = useState('pod_01')
  const [detailPodId, setDetailPodId] = useState(null)
  const [viewMode, setViewMode] = useState('grid')

  const podList = useMemo(() => Object.values(pods), [pods])

  const selectedPod = useMemo(
    () => pods[selectedPodId] || podList[0],
    [podList, pods, selectedPodId],
  )

  const healthSummary = useMemo(() => {
    return podList.reduce(
      (summary, pod) => {
        summary[pod.status] = (summary[pod.status] || 0) + 1
        return summary
      },
      { healthy: 0, warning: 0, critical: 0 },
    )
  }, [podList])

  const openPodDetail = (podId) => {
    setSelectedPodId(podId)
    setDetailPodId(podId)
  }

  return (
    <div className="min-h-screen xl:flex xl:h-screen xl:overflow-hidden" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <div className="flex min-h-screen w-full flex-col xl:min-h-0">
      <Navbar connectionStatus={connectionStatus} healthSummary={healthSummary} />

      <main className="grid gap-3 px-3 py-3 md:px-4 xl:min-h-0 xl:flex-1 xl:grid-cols-[minmax(0,3fr)_minmax(340px,2fr)]">
        <section className="flex min-h-0 flex-col gap-3">
          <PhysicalPot pods={pods} selectedPod={selectedPod} />

          <TabSwitcher value={viewMode} onChange={setViewMode} />

          {viewMode === 'grid' ? (
            <PodGrid pods={pods} onSelect={openPodDetail} />
          ) : (
            <Farm3D pods={pods} onPodSelect={openPodDetail} />
          )}
        </section>

        <section className="min-h-0">
          <AgentLog entries={agentLog} connectionStatus={connectionStatus} />
        </section>
      </main>

      <PodDetailModal pod={detailPodId ? pods[detailPodId] : null} agentLog={agentLog} onClose={() => setDetailPodId(null)} />
      </div>
    </div>
  )
}
