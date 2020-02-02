/**
 * Byte-swaps a 32-bit integer value.
 */
export function SwapBytes(int: number)
{
    const flipped = (int & 0x000000ff) << 24
        | (int & 0x0000ff00) << 8
        | (int & 0x00ff0000) >>> 8
        | (int & 0xff000000) >>> 24;

    return flipped;
}

export function IsPowerOfTwo(num: number): boolean
{
    return (num & (num - 1)) === 0;
}