import { MeshManagerInternal } from "./meshManager";
import { ShaderProgram } from "../shaders/shaderProgram";
import { VertexAttribute } from "./vertexAttribute";
import { VertexBufferParams } from "./vertexBufferParams";

export class VertexBuffer extends Float32Array
{
    /**
     * Defines the layout of each vertex in this buffer.
     */
    public readonly attributes: VertexAttribute[];

    /**
     * The number of vertices that this buffer can hold.
     */
    public readonly numVerts: number;

    /**
     * Returns the size of each vertex in this buffer, in bytes.
     */
    public readonly vertexSize: number;
    
    private readonly _meshManager: MeshManagerInternal;
    private _handle: WebGLBuffer;

    /**
     * @internal
     */
    public constructor(meshManager: MeshManagerInternal, params: VertexBufferParams)
    {
        super(Math.ceil(params.numVerts * params.vertexSize / Float32Array.BYTES_PER_ELEMENT));

        this.numVerts = params.numVerts;
        this.vertexSize = params.vertexSize;
        this.attributes = params.attributes;

        this._meshManager = meshManager;
        this._handle = params.handle;
    }

    // TODO: See if this creates any weird side effects
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/species
    public static get [Symbol.species]()
    {
        return Float32Array;
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