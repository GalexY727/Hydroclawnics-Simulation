import { useMemo, useState } from 'react'
import AgentLog from './AgentLog'
import Farm3D from './Farm3D'
import PhysicalPot from './PhysicalPot'
import PodGrid from './PodGrid'
import useWebSocket from './useWebSocket'

export default function App() {
  const { pods, agentLog } = useWebSocket()
  const [selectedPodId, setSelectedPodId] = useState('pod_01')
  const [viewMode, setViewMode] = useState('grid')
  const nextViewMode = viewMode === 'grid' ? 'farm' : 'grid'

  const selectedPod = useMemo(
    () => pods.find((p) => p.id === selectedPodId) || pods[0],
    [pods, selectedPodId],
  )

  return (
    <div className="min-h-screen p-4 md:p-6">
      <header className="mb-4 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-2xl font-bold text-cyan-300">Hydroclawnics</header>
      <main className="grid gap-4 xl:grid-cols-5">
        <section className="space-y-4 xl:col-span-3">
          <PhysicalPot pod={selectedPod} />

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setViewMode(nextViewMode)} className="rounded-md border border-slate-600 px-3 py-1 text-sm hover:bg-slate-800">
              Switch to {viewMode === 'grid' ? '3D Farm' : '2D Pod Grid'}
            </button>
          </div>

          {viewMode === 'grid' ? (
            <PodGrid pods={pods} onSelect={setSelectedPodId} />
          ) : (
            <Farm3D pods={pods} onPodSelect={setSelectedPodId} />
          )}
        </section>

        <section className="xl:col-span-2">
          <AgentLog entries={agentLog} />
        </section>
      </main>
    </div>
  )
}
