import { VertexManagerInternal } from "./vertexManager";
import { IndexBufferParams } from "./indexBufferParams";

export class IndexBuffer
{
    /**
     * The underlying index array containing the values of this buffer.
     * Use `VertexManager.flushIndexBuffer()` to send these values to the graphics device.
     */
    public readonly indices: Uint16Array;

    private readonly _vertexManager: VertexManagerInternal;
    private _handle: WebGLBuffer;

    /**
     * @internal
     */
    public constructor(bufferManager: VertexManagerInternal, params: IndexBufferParams)
    {
        this.indices = params.indices;

        this._vertexManager = bufferManager;
        this._handle = params.handle;
    }

    public getHandle(): WebGLBuffer
    {
        return this._handle;
    }
}