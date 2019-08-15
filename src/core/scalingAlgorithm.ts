/**
 * Defines how the browser should render the game canvas
 * when scaled up or down from its original size.
 */
export const enum ScalingAlgorithm
{
    /**
     * A browser-dependent "smooth" scaling algorithm, e.g. bilinear interpolation.
     * Useful for scaling photos.
     */
    SMOOTH,

    /**
     * The nearest-neighbor algorithm. Useful for upscaling pixel art.
     */
    PIXELATED,
}
