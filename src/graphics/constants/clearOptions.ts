import { Gl } from "./gl";

export const enum ClearOptions
{
    COLOR_BUFFER = Gl.COLOR_BUFFER_BIT,

    DEPTH_BUFFER = Gl.DEPTH_BUFFER_BIT,
    
    STENCIL_BUFFER = Gl.STENCIL_BUFFER_BIT,

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