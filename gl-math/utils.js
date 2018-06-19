import {
	glMatrix,
	mat4
} from 'gl-matrix';

/**
 *
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
export function clamp(value, min, max) {
	return Math.max(min, Math.min(max, value));
}

/**
 * return random number between minimum value and maximum value
 *
 * @param {number} minValue
 * @param {number} maxValue
 *
 * @return{number}
 */
export function randomFloat(minValue, maxValue) {
	let value = minValue + (maxValue - minValue) * Math.random();
	return value;
}

/**
 * mix — linearly interpolate between two values
 *
 * @param {number} x
 * @param {number} y
 * @param {number} a
 */
export function mix(x, y, a) {
	return x * (1 - a) + y * a;
}

export function degToRad(value) {
	// Math.PI / 180 = 0.017453292519943295
	return value * 0.017453292519943295;
}

export function radToDeg(value) {
	// 180 / Math.PI = 57.29577951308232
	return 57.29577951308232 * value;
}

/**
 * https://github.com/mrdoob/three.js/blob/master/src/math/Matrix4.js#L318
 * http://glmatrix.net/docs/mat4.js.html#line1355
 *
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
export function lookAtCustom(out, eye, center, up) {
	let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
	let eyex = eye[0];
	let eyey = eye[1];
	let eyez = eye[2];
	let upx = up[0];
	let upy = up[1];
	let upz = up[2];
	let centerx = center[0];
	let centery = center[1];
	let centerz = center[2];

	if (
		Math.abs(eyex - centerx) < glMatrix.EPSILON &&
		Math.abs(eyey - centery) < glMatrix.EPSILON &&
		Math.abs(eyez - centerz) < glMatrix.EPSILON
	) {
		return mat4.identity(out);
	}

	z0 = eyex - centerx;
	z1 = eyey - centery;
	z2 = eyez - centerz;

	len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
	z0 *= len;
	z1 *= len;
	z2 *= len;

	x0 = upy * z2 - upz * z1;
	x1 = upz * z0 - upx * z2;
	x2 = upx * z1 - upy * z0;
	len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
	if (!len) {
		// fix for disappearing
		// this part is from https://github.com/mrdoob/three.js/blob/master/src/math/Matrix4.js

		if (Math.abs(upz) === 1.0) {
			z0 += 0.0001;
		} else {
			z2 += 0.0001;
		}

		// normalize
		len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + 2 * z2);
		z0 *= len;
		z1 *= len;
		z2 *= len;

		x0 = upy * z2 - upz * z1;
		x1 = upz * z0 - upx * z2;
		x2 = upx * z1 - upy * z0;
		len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);

		len = 1 / len;
		x0 *= len;
		x1 *= len;
		x2 *= len;
	} else {
		len = 1 / len;
		x0 *= len;
		x1 *= len;
		x2 *= len;
	}

	y0 = z1 * x2 - z2 * x1;
	y1 = z2 * x0 - z0 * x2;
	y2 = z0 * x1 - z1 * x0;

	len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
	if (!len) {
		y0 = 0;
		y1 = 0;
		y2 = 0;
	} else {
		len = 1 / len;
		y0 *= len;
		y1 *= len;
		y2 *= len;
	}

	out[0] = x0;
	out[1] = y0;
	out[2] = z0;
	out[3] = 0;
	out[4] = x1;
	out[5] = y1;
	out[6] = z1;
	out[7] = 0;
	out[8] = x2;
	out[9] = y2;
	out[10] = z2;
	out[11] = 0;
	out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
	out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
	out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
	out[15] = 1;

	return out;
}