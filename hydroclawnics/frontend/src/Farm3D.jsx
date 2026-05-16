import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import PodMesh from './PodMesh'
import useFarm3D from './useFarm3D'

export default function Farm3D({ pods, onPodSelect }) {
  const mappedPods = useFarm3D(pods)

  return (
    <div className="h-[420px] w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
      <Canvas camera={{ position: [0, 9, 12], fov: 50 }}>
        <ambientLight intensity={0.65} />
        <directionalLight position={[5, 10, 6]} intensity={1.1} />
        <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, 0]}>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>

        {mappedPods.map((pod) => (
          <PodMesh key={pod.pod_id} pod={pod} onPodSelect={onPodSelect} />
        ))}

        <OrbitControls autoRotate autoRotateSpeed={0.75} />
      </Canvas>
    </div>
  )
}
