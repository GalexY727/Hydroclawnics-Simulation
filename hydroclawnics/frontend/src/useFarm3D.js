const STATUS_COLOR = {
  healthy: '#4ade80',
  warning: '#facc15',
  critical: '#f87171',
}

export default function useFarm3D(pods) {
  return pods.map((pod, idx) => ({
    pod_id: pod.id,
    status: pod.status,
    ageScale: Math.min(1, Math.max(0.3, 0.3 + (Number(pod.age_hours || 0) / 240) * 0.7)),
    color: STATUS_COLOR[pod.status] || STATUS_COLOR.healthy,
    position: [((idx % 5) - 2) * 2.3, 0, (Math.floor(idx / 5) - 1.5) * 2.3],
  }))
}
