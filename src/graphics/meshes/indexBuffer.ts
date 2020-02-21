import { IndexBufferParams } from "./indexBufferParams";
import { MeshManagerInternal } from "./meshManager";

export class IndexBuffer extends Uint16Array
{
    private readonly _meshManager: MeshManagerInternal;
    private _handle: WebGLBuffer;

    /**
     * @internal
     */
    public constructor(meshManager: MeshManagerInternal, params: IndexBufferParams)
    {
        super(params.indices);

        this._meshManager = meshManager;
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