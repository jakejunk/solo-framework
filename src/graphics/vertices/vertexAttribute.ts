import { AttributeType } from "../constants/attributeType";
import { ShaderProgram } from "../shaders/shaderProgram";

/**
 * Defines a position, color, texture coordinate, or other attribute of a vertex.
 */
export class VertexAttribute
{
    /**
     * The name of the attribute variable as specified in its shader.
     */
    public readonly name: string;

    /**
     * The number of components that make up this attribute.
     */
    public readonly numComponents: number;
    
    /**
     * The type of each component in this attribute, e.g. `BYTE`, `FLOAT`, etc.
     */
    public readonly type: AttributeType;

    /**
     * The size of this vertex attribute, in bytes.
     */
    public readonly totalSize: number;

    /**
     * Specifies whether integer data values are mapped into the range
     * `[-1, 1]` (for signed types) or `[0, 1]` (for unsigned types).
     */
    public readonly normalized: boolean;

    private _location: number;

    public constructor(name: string, numComponents: number, type: AttributeType, normalized: boolean)
    {
        this.name = name;
        this.numComponents = numComponents;
        this.type = type;
        this.totalSize = numComponents * VertexAttribute._GetAttributeSize(type);
        this.normalized = normalized;
        this._location = -1;
    }

    private static _GetAttributeSize(type: AttributeType): number
    {
        switch (type)
        {
            case AttributeType.FLOAT:
                return 4;
            case AttributeType.SHORT:
            case AttributeType.UNSIGNED_SHORT:
                return 2;
            case AttributeType.BYTE:
            case AttributeType.UNSIGNED_BYTE:
            default:
                return 1;
        }
    }

    /**
     * Finds and grabs the location of this attribute in the provided shader program.
     * Returns `false` if this attribute was not found.
     */
    public updateLocation(program: ShaderProgram): boolean
    {
        this._location = program.getAttribLocation(this.name);

        return this._location !== -1;
    }

    /**
     * Gets the location of this attribute.
     * Returns `-1` if this attribute has not yet been found in a `ShaderProgram`.
     */
    public getLocation(): number
    {
        return this._location;
    }
}