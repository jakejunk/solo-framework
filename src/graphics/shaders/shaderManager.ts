import { Result } from "../../util/result";
import { ShaderProgram } from "./shaderProgram";

export type UniformLocation = WebGLUniformLocation;

export interface ShaderManager
{
    /**
     * Creates a new `ShaderProgram` from a vertex and fragment shader, written in GLSL.
     */
    createShaderProgram(vShaderSrc: string, fShaderSrc: string): Result<ShaderProgram, Error>;

    /**
     * Binds the provided program for rendering.
     */
    bind(program: ShaderProgram): void;
}