export class Vector2
{
    x: number;
    y: number;

    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }

    static Clone(other: Readonly<Vector2>): Vector2
    {
        return new Vector2(other.x, other.y);
    }

    add(other: Readonly<Vector2>) 
    {
        this.x += other.x;
        this.y += other.y;
    }

    sub(other: Readonly<Vector2>)
    {
        this.x -= other.x;
        this.y -= other.y;
    }

    mul(other: Readonly<Vector2>)
    {
        this.x *= other.x;
        this.y *= other.y;
    }

    div(other: Readonly<Vector2>)
    {
        this.x /= other.x;
        this.y /= other.y;
    }

    scale(factor: number)
    {
        this.x *= factor;
        this.y *= factor;
    }

    set(other: Readonly<Vector2>)
    {
        this.x = other.x;
        this.y = other.y;
    }

    negate()
    {
        this.x = -this.x;
        this.y = -this.y;
    }

    /**
     * Converts this vector to a unit vector pointing in the same direction.
     */
    normalize()
    {
        const factor = 1 / this.getLength();
        if (isFinite(factor))
        {
            this.x *= factor;
            this.y *= factor;
        }
    }

    dot(other: Readonly<Vector2>): number
    {
        return this.x * other.x + this.y * other.y
    }

    getAngle(): number
    {
        return Math.atan2(this.y, this.x);
    }

    getLength(): number
    {
        return Math.sqrt(this.getLengthSquared());
    }

    getLengthSquared(): number
    {
        return this.x * this.x + this.y * this.y;
    }

    equals(other: Vector2): boolean
    {
        return this.x === other.x
            && this.y === other.y;
    }
}

export namespace Vector2
{
    /** (0, 0) */
    export const ZERO: Readonly<Vector2> = new Vector2();

    /** (1, 0) */
    export const UNIT_X: Readonly<Vector2> = new Vector2(1, 0);

    /** (0, 1) */
    export const UNIT_Y: Readonly<Vector2> = new Vector2(0, 1);
}