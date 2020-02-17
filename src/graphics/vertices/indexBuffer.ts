import { VertexManagerInternal } from "./vertexManager";
import { IndexBufferParams } from "./indexBufferParams";

export class IndexBuffer extends Uint16Array
{
    private readonly _vertexManager: VertexManagerInternal;
    private _handle: WebGLBuffer;

    /**
     * @internal
     */
    public constructor(bufferManager: VertexManagerInternal, params: IndexBufferParams)
    {
        super(params.indices);

        this._vertexManager = bufferManager;
        this._handle = params.handle;
    }

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/species
    public static get [Symbol.species]()
    {
        return Uint16Array;
    }

    public getHandle(): WebGLBuffer
    {
        return this._handle;
    }
}