/**
 * this class is imported from Euler.js in threejs
 * https://github.com/mrdoob/three.js/blob/master/src/math/Euler.js
 */

import { mat4 } from 'gl-matrix';
import { clamp } from './utils'

export class Euler {
	constructor(x = 0, y = 0, z = 0, order = 'XYZ') {
		this._x = x;
		this._y = y;
		this._z = z;
		this.array = new Float32Array(3);
		this.matrix = mat4.create();
		this.order = order;

		this.update();
	}

	set x(value) {
		this._x = value;
		this.update();
	}

	get x() {
		return this._x;
	}

	set y(value) {
		this._y = value;
		this.update();
	}

	get y() {
		return this._y;
	}

	set z(value) {
		this._z = value;
		this.update();
	}

	get z() {
		return this._z;
	}

	setFromRotationMatrix(m, order) {
		// var clamp = _Math.clamp;

		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
		var te = m;
		var m11 = te[0],
			m12 = te[4],
			m13 = te[8];
		var m21 = te[1],
			m22 = te[5],
			m23 = te[9];
		var m31 = te[2],
			m32 = te[6],
			m33 = te[10];

		order = order || this.order;

		if (order === 'XYZ') {
			this._y = Math.asin(clamp(m13, -1, 1));

			if (Math.abs(m13) < 0.99999) {
				this._x = Math.atan2(-m23, m33);
				this._z = Math.atan2(-m12, m11);
			} else {
				this._x = Math.atan2(m32, m22);
				this._z = 0;
			}
		} else if (order === 'YXZ') {
			this._x = Math.asin(-clamp(m23, -1, 1));

			if (Math.abs(m23) < 0.99999) {
				this._y = Math.atan2(m13, m33);
				this._z = Math.atan2(m21, m22);
			} else {
				this._y = Math.atan2(-m31, m11);
				this._z = 0;
			}
		} else if (order === 'ZXY') {
			this._x = Math.asin(clamp(m32, -1, 1));

			if (Math.abs(m32) < 0.99999) {
				this._y = Math.atan2(-m31, m33);
				this._z = Math.atan2(-m12, m22);
			} else {
				this._y = 0;
				this._z = Math.atan2(m21, m11);
			}
		} else if (order === 'ZYX') {
			this._y = Math.asin(-clamp(m31, -1, 1));

			if (Math.abs(m31) < 0.99999) {
				this._x = Math.atan2(m32, m33);
				this._z = Math.atan2(m21, m11);
			} else {
				this._x = 0;
				this._z = Math.atan2(-m12, m22);
			}
		} else if (order === 'YZX') {
			this._z = Math.asin(clamp(m21, -1, 1));

			if (Math.abs(m21) < 0.99999) {
				this._x = Math.atan2(-m23, m22);
				this._y = Math.atan2(-m31, m11);
			} else {
				this._x = 0;
				this._y = Math.atan2(m13, m33);
			}
		} else if (order === 'XZY') {
			this._z = Math.asin(-clamp(m12, -1, 1));

			if (Math.abs(m12) < 0.99999) {
				this._x = Math.atan2(m32, m22);
				this._y = Math.atan2(m13, m11);
			} else {
				this._x = Math.atan2(-m23, m33);
				this._y = 0;
			}
		} else {
			console.warn('THREE.Euler: .setFromRotationMatrix() given unsupported order: ' + order);
		}

		this._order = order;

		this.update();

		return this;
	}

	update() {
		this.array[0] = this._x;
		this.array[1] = this._y;
		this.array[2] = this._z;

		this.needsMatrixUpdate = true;
	}

	updateMatrix(isForceUpdate) {
		if (this.needsMatrixUpdate || isForceUpdate) {
			Euler.makeRotationFromEuler(this.matrix, this);
			this.needsMatrixUpdate = false;
		}
	}

	toMatrix4(out) {
		Euler.makeRotationFromEuler(out, this);
		return out;
	}

	/**
	 *
	 * https://threejs.org/docs/index.html#api/math/Matrix4
	 * @param {mat4} out
	 * @param {euler} euler
	 *
	 *
	 */
	static makeRotationFromEuler(out, euler) {
		var te = out;

		var x = euler.x,
			y = euler.y,
			z = euler.z;
		var a = Math.cos(x),
			b = Math.sin(x);
		var c = Math.cos(y),
			d = Math.sin(y);
		var e = Math.cos(z),
			f = Math.sin(z);

		if (euler.order === 'XYZ') {
			var ae = a * e,
				af = a * f,
				be = b * e,
				bf = b * f;

			te[0] = c * e;
			te[4] = -c * f;
			te[8] = d;

			te[1] = af + be * d;
			te[5] = ae - bf * d;
			te[9] = -b * c;

			te[2] = bf - ae * d;
			te[6] = be + af * d;
			te[10] = a * c;
		} else if (euler.order === 'YXZ') {
			var ce = c * e,
				cf = c * f,
				de = d * e,
				df = d * f;

			te[0] = ce + df * b;
			te[4] = de * b - cf;
			te[8] = a * d;

			te[1] = a * f;
			te[5] = a * e;
			te[9] = -b;

			te[2] = cf * b - de;
			te[6] = df + ce * b;
			te[10] = a * c;
		} else if (euler.order === 'ZXY') {
			var ce = c * e,
				cf = c * f,
				de = d * e,
				df = d * f;

			te[0] = ce - df * b;
			te[4] = -a * f;
			te[8] = de + cf * b;

			te[1] = cf + de * b;
			te[5] = a * e;
			te[9] = df - ce * b;

			te[2] = -a * d;
			te[6] = b;
			te[10] = a * c;
		} else if (euler.order === 'ZYX') {
			var ae = a * e,
				af = a * f,
				be = b * e,
				bf = b * f;

			te[0] = c * e;
			te[4] = be * d - af;
			te[8] = ae * d + bf;

			te[1] = c * f;
			te[5] = bf * d + ae;
			te[9] = af * d - be;

			te[2] = -d;
			te[6] = b * c;
			te[10] = a * c;
		} else if (euler.order === 'YZX') {
			var ac = a * c,
				ad = a * d,
				bc = b * c,
				bd = b * d;

			te[0] = c * e;
			te[4] = bd - ac * f;
			te[8] = bc * f + ad;

			te[1] = f;
			te[5] = a * e;
			te[9] = -b * e;

			te[2] = -d * e;
			te[6] = ad * f + bc;
			te[10] = ac - bd * f;
		} else if (euler.order === 'XZY') {
			var ac = a * c,
				ad = a * d,
				bc = b * c,
				bd = b * d;

			te[0] = c * e;
			te[4] = -f;
			te[8] = d * e;

			te[1] = ac * f + bd;
			te[5] = a * e;
			te[9] = ad * f - bc;

			te[2] = bc * f - ad;
			te[6] = b * e;
			te[10] = bd * f + ac;
		}

		// last column
		te[3] = 0;
		te[7] = 0;
		te[11] = 0;

		// bottom row
		te[12] = 0;
		te[13] = 0;
		te[14] = 0;
		te[15] = 1;

		return out;
	}
}