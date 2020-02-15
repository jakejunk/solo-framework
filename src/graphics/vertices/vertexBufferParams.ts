import { VertexAttribute } from "./vertexAttribute";

/**
 * Contains the values necessary to contruct a new `VertexBuffer`.
 * This type is mainly used internally by `BufferManager`.
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