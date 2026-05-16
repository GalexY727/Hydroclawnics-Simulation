import { Text } from '@react-three/drei'

export default function PodMesh({ pod, onPodSelect }) {
  return (
    <group
      position={pod.position}
      onClick={(event) => {
        event.stopPropagation()
        // # FIX: Pod clicks now notify the parent so the camera and selection state move together.
        onPodSelect?.(pod.pod_id, pod.position)
      }}
    >
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.65, 32]} />
        <meshStandardMaterial color="#6a6a6a" roughness={0.85} metalness={0.05} />
      </mesh>
      <mesh position={[0, 1.05, 0]} scale={pod.ageScale}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color={pod.color} roughness={0.7} metalness={0.02} />
      </mesh>
      <Text position={[0, -0.05, 0.72]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.28} color="#f5f1de" anchorX="center" anchorY="middle">
        {pod.pod_id}
      </Text>
    </group>
  )
}
