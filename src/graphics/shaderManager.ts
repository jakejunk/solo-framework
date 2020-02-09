import { Result } from "../util/result";
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
    useProgram(program: ShaderProgram): void;

    /**
     * Gets the location of an attribute variable in the provided program.
     * Returns `-1` if the variable is not found.
     */
    getAttribLocation(program: ShaderProgram, name: string): number;

    /**
     * Gets the location of a uniform variable in the provided program.
     * Returns `-1` if the variable is not found.
     */
    getUniformLocation(program: ShaderProgram, name: string): UniformLocation;
}