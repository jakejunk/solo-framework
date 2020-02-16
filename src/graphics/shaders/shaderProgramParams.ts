import { UniformLocation } from "./shaderManager";

/**
 * @internal
 * Contains the values necessary to construct a new `ShaderProgram`.
 */
export interface ShaderProgramParams
{
    readonly handle: WebGLProgram;

    /**
     * A map of attribute names and their locations in the created shader.
     */
    readonly attributeMap: Map<string, number>;

    /**
     * A map of uniform names and their locations in the created shader.
     */
    readonly uniformMap: Map<string, UniformLocation>;
}