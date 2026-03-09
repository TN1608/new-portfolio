import fs from 'fs';

const buffer = fs.readFileSync('./public/models/crt_monitor.glb');

const length = buffer.readUInt32LE(8);
const chunk0Length = buffer.readUInt32LE(12);
const jsonBuffer = buffer.subarray(20, 20 + chunk0Length);
const json = JSON.parse(jsonBuffer.toString('utf8'));

console.log("Nodes:", json.nodes.map(n => n.name));

const mesh = json.meshes[0];
const primitive = mesh.primitives[0];
const positionAccessorIndex = primitive.attributes.POSITION;
const accessor = json.accessors[positionAccessorIndex];

console.log("\nBounding Box from GLB Accessor:");
console.log("Min:", accessor.min);
console.log("Max:", accessor.max);
