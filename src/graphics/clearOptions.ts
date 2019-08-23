export const enum ClearOptions
{
    COLOR_BUFFER = 16384,
    DEPTH_BUFFER = 256,
    STENCIL_BUFFER = 1024,

    /**
     * Clear the color and depth buffers.
     */
    COLOR_DEPTH_BUFFERS = COLOR_BUFFER | DEPTH_BUFFER,

    /**
     * Clear the color and stencil buffers.
     */
    COLOR_STENCIL_BUFFERS = COLOR_BUFFER | STENCIL_BUFFER,

    /**
     * Clear the depth and stencil buffers.
     */
    DEPTH_STENCIL_BUFFERS = DEPTH_BUFFER | STENCIL_BUFFER,

    /**
     * Clear the color, depth, and stencil buffers.
     */
    COLOR_DEPTH_STENCIL_BUFFERS = COLOR_BUFFER | DEPTH_BUFFER | STENCIL_BUFFER,
}