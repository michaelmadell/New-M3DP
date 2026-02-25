'use client'

import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei'
import * as THREE from 'three'

interface Model3DViewerProps {
  modelData: ArrayBuffer
  fileType: string
}

function Model({ modelData, fileType }: { modelData: ArrayBuffer; fileType: string }) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Parse the model data based on file type
  const geometry = parseModelData(modelData, fileType)

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial color="#3b82f6" />
    </mesh>
  )
}

// Simple parser for STL files (binary format)
function parseModelData(data: ArrayBuffer, fileType: string): THREE.BufferGeometry {
  if (fileType === 'stl') {
    return parseSTL(data)
  }
  // Add more parsers for OBJ, 3MF etc.
  return new THREE.BoxGeometry(1, 1, 1)
}

function parseSTL(data: ArrayBuffer): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry()
  const view = new DataView(data)
  
  // Skip header (80 bytes)
  const triangles = view.getUint32(80, true)
  
  const vertices: number[] = []
  const normals: number[] = []
  
  for (let i = 0; i < triangles; i++) {
    const offset = 84 + i * 50
    
    // Read normal
    const nx = view.getFloat32(offset, true)
    const ny = view.getFloat32(offset + 4, true)
    const nz = view.getFloat32(offset + 8, true)
    
    // Read 3 vertices
    for (let j = 0; j < 3; j++) {
      const vOffset = offset + 12 + j * 12
      vertices.push(
        view.getFloat32(vOffset, true),
        view.getFloat32(vOffset + 4, true),
        view.getFloat32(vOffset + 8, true)
      )
      normals.push(nx, ny, nz)
    }
  }
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  geometry.computeBoundingSphere()
  
  return geometry
}

export default function Model3DViewer({ modelData, fileType }: Model3DViewerProps) {
  return (
    <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Model modelData={modelData} fileType={fileType} />
          <Environment preset="studio" />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  )
}
