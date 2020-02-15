import { UniformLocation } from "./shaderManager";

/**
 * Contains the values necessary to contruct a new `ShaderProgram`.
 * This type is mainly used internally by `ShaderManager`.
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