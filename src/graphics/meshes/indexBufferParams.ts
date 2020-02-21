/**
 * @internal
 * Contains the values necessary to construct a new `IndexBuffer`.
 */
export interface IndexBufferParams
{
    readonly handle: WebGLBuffer;

    /**
     * The values for the created index buffer.
     */
    readonly indices: Uint16Array;
}