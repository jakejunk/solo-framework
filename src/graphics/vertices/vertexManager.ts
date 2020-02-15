import { IndexBuffer } from "./indexBuffer";
import { VertexAttribute } from "./vertexAttribute";
import { VertexBuffer } from "./vertexBuffer";

export interface VertexManager
{
    createBufferFromAttributes(numVerts: number, ...attributes: VertexAttribute[]): VertexBuffer;

    bindVertexBuffer(vertexBuffer: VertexBuffer): void;

    bindIndexBuffer(indexBuffer: IndexBuffer): void;

    /**
     * Flushes the contents of the provided buffer to the graphics device.
     */
    flushVertexBuffer(vertexBuffer: VertexBuffer, offset?: number, count?: number): void;
}