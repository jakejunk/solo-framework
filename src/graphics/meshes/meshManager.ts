import { IndexBuffer } from "./indexBuffer";
import { VertexAttribute } from "./vertexAttribute";
import { VertexBuffer } from "./vertexBuffer";

/**
 * Provides an interface to all vertex-related functions of the graphics context.
 */
export interface MeshManager
{
    createVertexBuffer(numVerts: number, ...attributes: VertexAttribute[]): VertexBuffer;

    createIndexBuffer(indices: Uint16Array): IndexBuffer;

    bindVertexBuffer(vertexBuffer: VertexBuffer): void;

    bindIndexBuffer(indexBuffer: IndexBuffer): void;

    /**
     * Binds the provided vertex buffer and flushes its contents to the graphics device.
     */
    flushVertexBuffer(vertexBuffer: VertexBuffer, offset?: number, count?: number): void;

    /**
     * Binds the provided index buffer and flushes its contents to the graphics device.
     */
    flushIndexBuffer(indexBuffer: IndexBuffer): void;
}

/**
 * @internal
 */
export interface MeshManagerInternal extends MeshManager
{
    
}