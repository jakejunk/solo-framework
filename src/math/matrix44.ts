// Thanks, Safari: https://caniuse.com/#search=typedarray%20fill
if (Float32Array.prototype.fill == undefined)
{
    (Float32Array.prototype.fill as unknown) = Array.prototype.fill;
}

/**
 * Defines a 4x4 matrix.
 */
export class Matrix4 extends Float32Array
{
    public constructor()
    {
        super(16);
    }

    /**
     * Creates a new identity matrix.
     */
    public static CreateIdentity(): Matrix4
    {
        const matrix = new Matrix4();
        matrix.convertToIdentity();

        return matrix;
    }

    /**
     * Creates a new scaling matrix.
     */
    public static CreateScale(scaleX: number, scaleY: number, scaleZ: number): Matrix4
    {
        const matrix = new Matrix4();
        matrix.convertToScaling(scaleX, scaleY, scaleZ);

        return matrix;
    }

    /**
     * Creates and new orthographic projection matrix. All parameters define the projection's clipping planes.
     * 
     * `left`, `right`, `bottom`, and `top` are the bounds of the near plane, and `near` is its depth.
     *  `far` represents the depth of the far plane.
     */
    public static CreateOrtho(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4
    {
        const matrix = new Matrix4();
        matrix.convertToOrtho(left, right, bottom, top, near, far);

        return matrix;
    }

    /**
     * Creates a new matrix from an array-like structure with values in row-major order.
     */
    public static FromValuesRowMajor(values: ArrayLike<number>): Matrix4
    {
        const matrix = this.FromValuesColumnMajor(values);
        matrix.transpose();

        return matrix;
    }

    /**
     * Creates a new matrix from an array-like structure with values in column-major order.
     */
    public static FromValuesColumnMajor(values: ArrayLike<number>): Matrix4
    {
        if (values.length > 16)
        {
            throw new Error(`4x4 matrices require <= 16 values: ${values.length} values provided`);
        }

        const matrix = new Matrix4();
        matrix.set(values);

        return matrix;
    }

    /**
     * Multiplies `l` and `r`, storing the result in `outMatrix`.
     */
    public static Mul(outMatrix: Matrix4, l: Matrix4, r: Matrix4)
    {
        // l00--l03   r00--r03
        // |  ..  |   |  ..  |
        // |  ..  | X |  ..  |
        // l30--l33   r30--r33
        //
        // NOTE: These matrices are stored column-major

        const l00 = l[0],  l10 = l[1],  l20 = l[2],  l30 = l[3];
        const l01 = l[4],  l11 = l[5],  l21 = l[6],  l31 = l[7];
        const l02 = l[8],  l12 = l[9],  l22 = l[10], l32 = l[11];
        const l03 = l[12], l13 = l[13], l23 = l[14], l33 = l[15];

        const r00 = r[0], r10 = r[1], r20 = r[2], r30 = r[3];

        outMatrix[0] = l00 * r00 + l01 * r10 + l02 * r20 + l03 * r30;
        outMatrix[1] = l10 * r00 + l11 * r10 + l12 * r20 + l13 * r30;
        outMatrix[2] = l20 * r00 + l21 * r10 + l22 * r20 + l23 * r30;
        outMatrix[3] = l30 * r00 + l31 * r10 + l32 * r20 + l33 * r30;

        const r01 = r[4], r11 = r[5], r21 = r[6], r31 = r[7];

        outMatrix[4] = l00 * r01 + l01 * r11 + l02 * r21 + l03 * r31;
        outMatrix[5] = l10 * r01 + l11 * r11 + l12 * r21 + l13 * r31;
        outMatrix[6] = l20 * r01 + l21 * r11 + l22 * r21 + l23 * r31;
        outMatrix[7] = l30 * r01 + l31 * r11 + l32 * r21 + l33 * r31;

        const r02 = r[8], r12 = r[9], r22 = r[10], r32 = r[11];

        outMatrix[8]  = l00 * r02 + l01 * r12 + l02 * r22 + l03 * r32;
        outMatrix[9]  = l10 * r02 + l11 * r12 + l12 * r22 + l13 * r32;
        outMatrix[10] = l20 * r02 + l21 * r12 + l22 * r22 + l23 * r32;
        outMatrix[11] = l30 * r02 + l31 * r12 + l32 * r22 + l33 * r32;

        const r03 = r[12], r13 = r[13], r23 = r[14], r33 = r[15];

        outMatrix[12] = l00 * r03 + l01 * r13 + l02 * r23 + l03 * r33;
        outMatrix[13] = l10 * r03 + l11 * r13 + l12 * r23 + l13 * r33;
        outMatrix[14] = l20 * r03 + l21 * r13 + l22 * r23 + l23 * r33;
        outMatrix[15] = l30 * r03 + l31 * r13 + l32 * r23 + l33 * r33;
    }

    /**
     * Converts this matrix into an identity matrix.
     */
    public convertToIdentity()
    {
        this.fill(0);

        this[0]  = 1;
        this[5]  = 1;
        this[10] = 1;
        this[15] = 1;
    }

    /**
     * Converts this matrix into a scaling matrix.
     */
    public convertToScaling(scaleX: number, scaleY: number, scaleZ: number)
    {
        this.fill(0);

        this[0]  = scaleX;
        this[5]  = scaleY;
        this[10] = scaleZ;
        this[15] = 1;
    }

    /**
     * Converts this matrix to an orthographic projection matrix.
     */
    public convertToOrtho(left: number, right: number, bottom: number, top: number, near: number, far: number)
    {
        // https://en.wikipedia.org/wiki/Orthographic_projection#Geometry

        const lr = 1 / (left - right);
        const bt = 1 / (bottom - top);
        const nf = 1 / (near - far);

        this.fill(0);

        this[0]  = -2 * lr;
        this[5]  = -2 * bt;
        this[10] = 2 * nf;
        this[12] = (left + right) * lr;
        this[13] = (top + bottom) * bt;
        this[14] = (far + near) * nf;
        this[15] = 1;
    }

    public transpose()
    {
        // 0 4  8 12
        // 1 5  9 13
        // 2 6 10 14
        // 3 7 11 15

        const c10 = this[1], c20 = this[2], c30 = this[3];
        const c21 = this[6], c31 = this[7];
        const c32 = this[11];

        this[1] = this[4];
        this[2] = this[8];
        this[3] = this[12];
        this[4] = c10;
        this[6] = this[9];
        this[7] = this[13];
        this[8] = c20;
        this[9] = c21;
        this[11] = this[14];
        this[12] = c30;
        this[13] = c31;
        this[14] = c32;
    }

    public clone(): Matrix4
    {
        const newMatrix = new Matrix4();
        newMatrix.set(this)

        return newMatrix;
    }
}