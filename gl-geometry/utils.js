export const generateWireframeIndices = (indices, isUint16Array = true) => {
	let wireframeIndices = []

	for (let i = 0; i < indices.length / 3; i += 1) {
		wireframeIndices.push(indices[3 * i])
		wireframeIndices.push(indices[3 * i + 1])

		wireframeIndices.push(indices[3 * i + 1])
		wireframeIndices.push(indices[3 * i + 2])

		wireframeIndices.push(indices[3 * i + 2])
		wireframeIndices.push(indices[3 * i])
	}

	wireframeIndices = isUint16Array ? new Uint16Array(wireframeIndices) : new Uint32Array(wireframeIndices);
	return wireframeIndices;
}