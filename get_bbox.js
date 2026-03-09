import fs from 'fs';

const buffer = fs.readFileSync('./public/models/c64_monitor.glb');

const magic = buffer.readUInt32LE(0);
const version = buffer.readUInt32LE(4);
const length = buffer.readUInt32LE(8);

const chunk0Length = buffer.readUInt32LE(12);
const chunk0Type = buffer.readUInt32LE(16);
const jsonBuffer = buffer.subarray(20, 20 + chunk0Length);
const json = JSON.parse(jsonBuffer.toString('utf8'));

console.log("Nodes:", json.nodes.map((n, i) => `${i}: ${n.name} (mesh ${n.mesh})`));

const mesh = json.meshes[0];
const primitive = mesh.primitives[0];
const positionAccessorIndex = primitive.attributes.POSITION;
const accessor = json.accessors[positionAccessorIndex];

console.log("\nBounding Box from GLB Accessor:");
console.log("Min:", accessor.min);
console.log("Max:", accessor.max);

const node = json.nodes.find(n => n.mesh === 0 || n.name?.includes("Monitor") || n.name?.includes("Mesh_Default_0"));
if (node) {
    console.log("\nNode Transform:", {
        translation: node.translation || [0, 0, 0],
        rotation: node.rotation || [0, 0, 0, 1],
        scale: node.scale || [1, 1, 1]
    });
}
