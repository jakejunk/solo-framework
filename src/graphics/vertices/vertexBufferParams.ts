import { VertexAttribute } from "./vertexAttribute";

/**
 * @internal
 * Contains the values necessary to construct a new `VertexBuffer`.
 */
export interface VertexBufferParams
{
    readonly handle: WebGLBuffer;

    /**
     * The number of vertices contained by the created buffer.
     */
    readonly numVerts: number;

    /**
     * The calculated size of each vertex in the created buffer.
     */
    readonly vertexSize: number;

    /**
     * The attributes describing the layout of the created vertex buffer.
     */
    readonly attributes: VertexAttribute[];
}