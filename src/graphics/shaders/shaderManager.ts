import { Result } from "../../util/result";
import { ShaderProgram } from "./shaderProgram";

export type UniformLocation = WebGLUniformLocation;

/**
 * Provides an interface to all shader-related functions of the graphics context.
 */
export interface ShaderManager
{
    /**
     * Creates a new `ShaderProgram` from a vertex and fragment shader, written in GLSL.
     */
    createShaderProgram(vShaderSrc: string, fShaderSrc: string): Result<ShaderProgram, Error>;

    /**
     * Binds the provided program for rendering.
     */
    bindShader(program: ShaderProgram): void;
}

/**
 * @internal
 */
export interface ShaderManagerInternal extends ShaderManager
{
    // TODO
}