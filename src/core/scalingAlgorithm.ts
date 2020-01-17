/**
 * Defines how the browser should render a scaled game canvas.
 */
export const enum ScalingAlgorithm
{
    /**
     * A browser-dependent "smooth" scaling algorithm, e.g. bilinear interpolation.
     * Useful when scaling photos.
     */
    SMOOTH,

    /**
     * The nearest-neighbor algorithm. Useful when upscaling pixel art.
     */
    PIXELATED,
}
