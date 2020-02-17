export class Vector2
{
    public x: number;
    public y: number;

    public constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }

    public static Clone(other: Vector2): Vector2
    {
        return new Vector2(other.x, other.y);
    }

    public add(other: Vector2) 
    {
        this.x += other.x;
        this.y += other.y;
    }

    public sub(other: Vector2)
    {
        this.x -= other.x;
        this.y -= other.y;
    }

    public mul(other: Vector2)
    {
        this.x *= other.x;
        this.y *= other.y;
    }

    public div(other: Vector2)
    {
        this.x /= other.x;
        this.y /= other.y;
    }

    public scale(factor: number)
    {
        this.x *= factor;
        this.y *= factor;
    }

    public set(other: Vector2)
    {
        this.x = other.x;
        this.y = other.y;
    }

    public negate()
    {
        this.x = -this.x;
        this.y = -this.y;
    }

    /**
     * Converts this vector to a unit vector pointing in the same direction.
     */
    public normalize()
    {
        const factor = 1 / this.getLength();

        if (isFinite(factor))
        {
            this.x *= factor;
            this.y *= factor;
        }
    }

    public dot(other: Vector2): number
    {
        return this.x * other.x + this.y * other.y
    }

    public getAngle(): number
    {
        return Math.atan2(this.y, this.x);
    }

    public getLength(): number
    {
        return Math.sqrt(this.getLengthSquared());
    }

    public getLengthSquared(): number
    {
        return this.x * this.x + this.y * this.y;
    }

    public equals(other: Vector2): boolean
    {
        return this.x === other.x
            && this.y === other.y;
    }
}

export namespace Vector2
{
    /** (0, 0) */
    export const ZERO = new Vector2();

    /** (1, 0) */
    export const UNIT_X = new Vector2(1, 0);

    /** (0, 1) */
    export const UNIT_Y = new Vector2(0, 1);
}