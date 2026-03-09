import React, { useRef } from 'react'
import { useTexture, RoundedBox, Box } from '@react-three/drei'
import * as THREE from 'three'

export function FlatMonitor({ image, ...props }) {
    const texture = useTexture(image || '/img/placeholder.jpg', (tex) => {
        tex.flipY = true;
        tex.colorSpace = THREE.SRGBColorSpace;
    })

    return (
        <group {...props}>
            {/* Main Monitor Body (Beige/Retro Plastic) */}
            <RoundedBox
                args={[10, 8, 8]} // Width, Height, Depth
                radius={0.3}
                smoothness={4}
                position={[0, 0, 0]}
            >
                <meshStandardMaterial color="#c0bca8" roughness={0.7} />
            </RoundedBox>

            {/* Screen Bezel (Dark Gray) */}
            <RoundedBox
                args={[8.5, 6.5, 0.2]}
                radius={0.1}
                position={[0, 0, 4.01]} // Just slightly protruding from the main body
            >
                <meshStandardMaterial color="#222" roughness={0.8} />
            </RoundedBox>

            {/* Flat Screen Glass / Texture Plane */}
            <mesh position={[0, 0, 4.12]}>
                {/* Slightly smaller than bezel to look like it's inside */}
                <planeGeometry args={[7.8, 5.8]} />
                {/* We use MeshBasicMaterial so the image isn't affected by scene lighting/shadows perfectly */}
                <meshBasicMaterial map={texture} toneMapped={false} />
            </mesh>

            {/* Monitor Stand */}
            <Box args={[3, 0.5, 4]} position={[0, -4.25, 0]}>
                <meshStandardMaterial color="#c0bca8" roughness={0.7} />
            </Box>
            {/* Stand Neck */}
            <Box args={[1.5, 1, 1.5]} position={[0, -4, 0]}>
                <meshStandardMaterial color="#a09c88" roughness={0.5} />
            </Box>

            {/* Retro details (e.g. floppy drive slit) */}
            <Box args={[2, 0.1, 0.1]} position={[2.5, -3, 4.01]}>
                <meshBasicMaterial color="#111" />
            </Box>

        </group>
    )
}
