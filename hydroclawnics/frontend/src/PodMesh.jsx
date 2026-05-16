export default function PodMesh({ pod, onPodSelect }) {
  return (
    <group position={pod.position} onClick={() => onPodSelect?.(pod.pod_id)}>
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.65, 32]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>
      <mesh position={[0, 1.05, 0]} scale={pod.ageScale}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color={pod.color} />
      </mesh>
    </group>
  )
}
