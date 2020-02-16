import { ShaderProgram } from "../shaders/shaderProgram";
import { VertexAttribute } from "./vertexAttribute";
import { VertexBufferParams } from "./vertexBufferParams";
import { VertexManagerInternal } from "./vertexManager";

export class VertexBuffer
{
    /**
     * Defines the layout of each vertex in this buffer.
     */
    public readonly attributes: VertexAttribute[];

    /**
     * The underlying array containing the values of this buffer.
     * Use `VertexManager.flushVertexBuffer()` to send these values to the graphics device.
     */
    public readonly buffer: Float32Array;

    /**
     * The number of vertices that this buffer can hold.
     */
    public readonly numVerts: number;

    /**
     * Returns the size of each vertex in this buffer, in bytes.
     */
    public readonly vertexSize: number;
    
    private readonly _vertexManager: VertexManagerInternal;
    private _handle: WebGLBuffer;

    /**
     * @internal
     */
    public constructor(bufferManager: VertexManagerInternal, params: VertexBufferParams)
    {
        const bufferLength = Math.ceil(params.numVerts * params.vertexSize / Float32Array.BYTES_PER_ELEMENT);
        this.buffer = new Float32Array(bufferLength);

        this.numVerts = params.numVerts;
        this.vertexSize = params.vertexSize;
        this.attributes = params.attributes;

        this._vertexManager = bufferManager;
        this._handle = params.handle;
    }

    public getHandle(): WebGLBuffer
    {
        return this._handle;
    }

    /**
     * Finds and grabs the locations of all attributes in the provided shader program.
     * Returns `false` if the attributes of the program do match up with the attributes of this buffer.
     */
    public updateAttributeLocations(program: ShaderProgram): boolean
    {
        const attributes = this.attributes;
        const numAttributes = attributes.length;

        if (numAttributes !== program.getNumAttributes())
        {
            return false;
        }
        
        let allFound = +true;

        for (let i = 0; i < numAttributes; ++i)
        {
            allFound &= +attributes[i].updateLocation(program);
        }

        return !!allFound;
    }
}