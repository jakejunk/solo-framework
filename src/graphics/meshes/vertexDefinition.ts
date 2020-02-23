import { ShaderProgram } from "../shaders/shaderProgram";
import { VertexAttribute } from "./vertexAttribute";

/**
 * Defines the layout of a mesh vertex.
 */
export class VertexDefinition
{
    /**
     * Defines the individual components of this vertex.
     */
    public readonly attributes: VertexAttribute[];

    private readonly _size: number;

    public constructor(...attributes: VertexAttribute[])
    {
        this.attributes = attributes;
        this._size = attributes
            .map(attr => attr.totalSize)
            .reduce((totalSize, currentSize) => totalSize + currentSize);
    }

    /**
     * Gets the total size of a single vertex, in bytes.
     */
    public getTotalSize(): number
    {
        return this._size;
    }

    /**
     * Gets the total size of a single vertex, measured in 32-bit floats.
     */
    public getSizeInFloats(): number
    {
        return Math.ceil(this._size / Float32Array.BYTES_PER_ELEMENT);
    }

    /**
     * Finds and grabs the locations of all attributes in the provided shader program.
     * Returns `false` if the attributes of the program do match up with the defined
     * layout of this vertex definition.
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