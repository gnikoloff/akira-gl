import { Geometry } from '../../gl-core/geometry'

export class CubeGeometry extends Geometry {
    constructor (width = 1, height = 1, depth = 1, widthSegments = 1, heightSegments = 1, depthSegments = 1, isWire = false) {
        super()

        this.type = 'Cube'
        this.isWire = isWire

        widthSegments = Math.floor(widthSegments)
        heightSegments = Math.floor(heightSegments)
        depthSegments = Math.floor(depthSegments)

        this.vertices = this.makeVertices(width, height, depth, widthSegments, heightSegments, depthSegments)
        const indices = this.makeIndices(widthSegments, heightSegments, depthSegments)

        this.addAttribute(
            'a_position',
            this.vertices,
            3
        )

        if (isWire) {
            this.indices = this.generateWireframeIndices(indices)
        } else {
            this.indices = indices
        }
		this.addIndiceAttribute(this.indices)	
        

    }

    makeVertices (width, height, depth, widthSegments, heightSegments, depthSegments) {

		let vertices = []
		let verticeNum = 0
		const widthRate = 1 / widthSegments
		const heightRate = 1 / heightSegments
		const depthRate = 1 / depthSegments
		const halfWidth = width / 2
		const halfHeight = height / 2
		const halfDepth = depth / 2

		for (let y = 0; y <= heightSegments; y += 1) {
			let posy = -halfHeight + height * heightRate * y

			for (let x = 0; x <= widthSegments; x += 1) {
				vertices[verticeNum++] = width * widthRate * x - halfWidth
				vertices[verticeNum++] = posy
				vertices[verticeNum++] = halfDepth
			}
			for (let z = 1; z <= depthSegments; z += 1) {
				vertices[verticeNum++] = halfWidth
				vertices[verticeNum++] = posy
				vertices[verticeNum++] = halfDepth - z * depthRate * depth
			}
			for (let x = widthSegments - 1; x >= 0; x -= 1) {
				vertices[verticeNum++] = width * widthRate * x - halfWidth
				vertices[verticeNum++] = posy
				vertices[verticeNum++] = -halfDepth
			}

			for (let z = depthSegments - 1; z > 0; z -= 1) {
				vertices[verticeNum++] = -halfWidth
				vertices[verticeNum++] = posy
				vertices[verticeNum++] = halfDepth - z * depthRate * depth
			}
		}

		// bottom
		for (let y = 0; y < 2; y += 1) {
			let posy = y === 0 ? -halfHeight : halfHeight

			for (let z = 1; z < depthSegments; z += 1) {
				let posz = halfDepth - z * depthRate * depth

				for (let x = 1; x < widthSegments; x += 1) {
					let posx = -halfWidth + x * widthRate * width

					vertices[verticeNum++] = posx
					vertices[verticeNum++] = posy
					vertices[verticeNum++] = posz
				}

			}

		}

		return new Float32Array(vertices)

    }

    generateWireframeIndices(indices, isUint16Array = true) {
        let wireframeIndices = [];

        for (let ii = 0; ii < indices.length / 3; ii++) {
            wireframeIndices.push(indices[3 * ii]);
            wireframeIndices.push(indices[3 * ii + 1]);

            wireframeIndices.push(indices[3 * ii + 1]);
            wireframeIndices.push(indices[3 * ii + 2]);

            wireframeIndices.push(indices[3 * ii + 2]);
            wireframeIndices.push(indices[3 * ii]);
        }

        wireframeIndices = isUint16Array ? new Uint16Array(wireframeIndices) : new Uint32Array(wireframeIndices);
        return wireframeIndices;
    }

    makeIndices (widthSegments, heightSegments, depthSegments) {
        let indices = []
		let oneSideVertexNum = 2 * (widthSegments + depthSegments)

		for (let height = 0; height < heightSegments; height++) {
			let heightPosNum = oneSideVertexNum * height;

			for (let row = 0; row < oneSideVertexNum; row++) {
				indices.push(row + heightPosNum);
				if (row === oneSideVertexNum - 1) indices.push(0 + heightPosNum);
				else indices.push(row + 1 + heightPosNum);
				indices.push(row + oneSideVertexNum + heightPosNum);

				if (row === oneSideVertexNum - 1) {
					indices.push(0 + heightPosNum);
					indices.push(oneSideVertexNum + heightPosNum);
				} else {
					indices.push(row + 1 + heightPosNum);
					indices.push(row + 1 + oneSideVertexNum + heightPosNum);
				}

				indices.push(row + oneSideVertexNum + heightPosNum);
			}
		}

        indices = indices.concat(
			CubeGeometry.createFace(widthSegments, heightSegments, depthSegments, false)
		)
		indices = indices.concat(
			CubeGeometry.createFace(widthSegments, heightSegments, depthSegments)
		)

        return new Uint16Array(indices)

    }

    static createFace (widthSegments, heightSegments, depthSegments, isTop = true) {
        let indices = []
		let ring = 2 * (widthSegments + depthSegments)
		let sideNum = isTop
			? ring * (heightSegments + 1) + (depthSegments - 1) * (widthSegments - 1)
			: ring * (heightSegments + 1)
            
		let startNum = isTop ? ring * heightSegments : 0
		let setQuad = isTop ? CubeGeometry.setTopQuad : CubeGeometry.setQuad

		if (widthSegments === 1 || depthSegments === 1) {
			let segments = Math.max(widthSegments, depthSegments)
			if (widthSegments === 1) {
				for (let i = 0; i < segments; i += 1) {
					if (i === 0)
						indices = indices.concat(
							setQuad(
								startNum + i,
								startNum + i + 1,
								startNum + i + 2,
								startNum + ring - 1 - i
							)
						)
					else
						indices = indices.concat(
							setQuad(
								startNum + ring - i,
								startNum + i + 1,
								startNum + i + 2,
								startNum + ring - 1 - i
							)
						)
				}
			} else {
				for (let i = 0; i < segments; i += 1) {
					indices = indices.concat(
						setQuad(
							startNum + i,
							startNum + i + 1,
							startNum + ring - 2 - i,
							startNum + ring - 1 - i
						)
					)
				}
			}
		} else {
			indices = indices.concat(setQuad(startNum, startNum + 1, sideNum, startNum + ring - 1))

			for (let i = 1; i < widthSegments - 1; i += 1) {
				indices = indices.concat(
					setQuad(startNum + i, startNum + i + 1, sideNum + i, sideNum + i - 1)
				)
			}

			indices = indices.concat(
				setQuad(
					startNum + widthSegments - 1,
					startNum + widthSegments,
					startNum + widthSegments + 1,
					sideNum + widthSegments - 2
				)
			)

			for (let j = 1; j < depthSegments - 1; j += 1) {
				indices = indices.concat(
					setQuad(
						startNum + ring - j,
						sideNum + (j - 1) * (widthSegments - 1),
						sideNum + j * (widthSegments - 1),
						startNum + ring - j - 1
					)
				)

				for (let i = 1; i < widthSegments - 1; i += 1) {
					indices = indices.concat(
						setQuad(
							sideNum + i - 1 + (j - 1) * (widthSegments - 1),
							sideNum + i + (j - 1) * (widthSegments - 1),
							sideNum + i + j * (widthSegments - 1),
							sideNum + i + j * (widthSegments - 1) - 1
						)
					)
				}

				indices = indices.concat(
					setQuad(
						sideNum + j * (widthSegments - 1) - 1,
						startNum + widthSegments + j,
						startNum + widthSegments + j + 1,
						sideNum + (j + 1) * (widthSegments - 1) - 1
					)
				)
			}

			indices = indices.concat(
				setQuad(
					startNum + ring - depthSegments + 1,
					sideNum + (depthSegments - 2) * (widthSegments - 1),
					startNum + ring - depthSegments - 1,
					startNum + ring - depthSegments
				)
			)

			for (let i = 1; i < widthSegments - 1; i += 1) {
				indices = indices.concat(
					setQuad(
						sideNum + (depthSegments - 2) * (widthSegments - 1) + i - 1,
						sideNum + (depthSegments - 2) * (widthSegments - 1) + i,
						startNum + ring - depthSegments - i - 1,
						startNum + ring - depthSegments - i
					)
				)
			}

			indices = indices.concat(
				setQuad(
					sideNum + (depthSegments - 1) * (widthSegments - 1) - 1,
					startNum + widthSegments + depthSegments - 1,
					startNum + widthSegments + depthSegments,
					startNum + widthSegments + depthSegments + 1
				)
			)
		}

		return indices
    }

    static setTopQuad (a, b, c, d) {
		let indices = []

		indices.push(a)
		indices.push(b)
		indices.push(c)

		indices.push(c)
		indices.push(d)
		indices.push(a)

		return indices
	}

    static setQuad (a, b, c, d) {
		let indices = []

		indices.push(b)
		indices.push(a)
		indices.push(c)
		indices.push(d)
		indices.push(c)
		indices.push(a)

		return indices
	}

}