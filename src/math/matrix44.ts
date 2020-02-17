// Thanks, Safari
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/fill
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

    public clone(): Matrix4
    {
        const newMatrix = new Matrix4();
        newMatrix.set(this)

        return newMatrix;
    }
}