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
    public readonly vertexSize: number;
    
    private readonly _vertexManager: VertexManagerInternal;
    private _handle: WebGLBuffer;

    /**
     * @internal
     */
    public constructor(bufferManager: VertexManagerInternal, params: VertexBufferParams)
    {
        this.buffer = new Float32Array(params.numVerts * params.vertexSize / 4);
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
     * Gets the total number of vertices that this buffer can hold.
     */
    public getNumVertices(): number
    {
        return this.buffer.length / this.vertexSize;
    }

    /**
     * Finds and grabs the locations of all attributes in the provided shader program.
     * Returns `false` if any attributes were not found.
     */
    public updateAttributeLocations(program: ShaderProgram): boolean
    {
        let allFound = +true;
        const attributes = this.attributes;
        const numAttributes = attributes.length;

        for (let i = 0; i < numAttributes; ++i)
        {
            allFound &= +attributes[i].updateLocation(program);
        }

        return !!allFound;
    }
}