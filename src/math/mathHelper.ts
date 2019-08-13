/**
 * Clamps a number value between a provided minimum and maximum.
 */
export function Clamp(value: number, min: number, max: number): number
{
    value = value > max ? max : value;
    return value < min ? min : value;
}