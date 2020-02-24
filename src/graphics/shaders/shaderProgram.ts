import { Err, Ok, Result } from "../../util/result";
import { Gl } from "../constants/gl";
import { GraphicsContext } from "../graphicsContext";
import { Logger } from "../../util/logger";
import { Matrix4 } from "../../math/matrix44";
import { ShaderProgramParams } from "./shaderProgramParams";
import { ShaderType } from "../constants/shaderType";

export type UniformLocation = WebGLUniformLocation;

export class ShaderProgram
{
    private static _BoundShader?: WebGLProgram;

    private _gl: WebGLRenderingContext;
    private _handle: WebGLProgram;
    private _attributeMap: Map<string, number>;
    private _uniformMap: Map<string, UniformLocation>;
    
    /**
     * @internal
     */
    public constructor(gl: WebGLRenderingContext, params: ShaderProgramParams)
    {
        this._gl = gl;
        this._handle = params.handle;
        this._attributeMap = params.attributeMap;
        this._uniformMap = params.uniformMap;
    }

    public getNumAttributes(): number
    {
        return this._attributeMap.size;
    }

    public getNumUniforms(): number
    {
        return this._uniformMap.size;
    }

    /**
     * Gets the location of an attribute variable in this program.
     * Returns `-1` if the attribute variable is not found.
     */
    public getAttribLocation(name: string): number
    {
        return this._attributeMap.get(name) ?? -1;
    }

    /**
     * Gets the location of a uniform variable in this program.
     */
    public getUniformLocation(name: string): UniformLocation | undefined
    {
        return this._uniformMap.get(name);
    }

    /**
     * Passes a matrix to a uniform variable at the provided location.
     */
    public setMatrix4(location: UniformLocation, matrix: Matrix4)
    {
        this.bind();

        this._gl.uniformMatrix4fv(location, false, matrix);
    }

    /**
     * Passes a texture location to a uniform variable at the provided location.
     */
    public setSampler2D(location: UniformLocation, bindLocation: number)
    {
        this.bind();

        this._gl.uniform1i(location, bindLocation);
    }

    /**
     * @internal
     * Binds this shader program for rendering.
     */
    public bind()
    {
        if (this._handle === ShaderProgram._BoundShader)
        {
            return;
        }

        this._gl.useProgram(this._handle);

        ShaderProgram._BoundShader = this._handle;
    }
}

export namespace ShaderProgram
{
    const _Logger = new Logger("ShaderProgram");

    export function Create(context: GraphicsContext, vShaderSrc: string, fShaderSrc: string): Result<ShaderProgram, Error>
    {
        const gl = context.gl;
        const vShaderResult = _CompileShader(gl, ShaderType.VERTEX_SHADER, vShaderSrc);

        if (vShaderResult.isErr())
        {
            return new Err(vShaderResult.errValue);
        }

        const fShaderResult = _CompileShader(gl, ShaderType.FRAGMENT_SHADER, fShaderSrc);

        if (fShaderResult.isErr())
        {
            return new Err(fShaderResult.errValue);
        }

        const vShader = vShaderResult.okValue;
        const fShader = fShaderResult.okValue;
        const program = gl.createProgram()!;

        gl.attachShader(program, vShader);
        gl.attachShader(program, fShader);
        gl.linkProgram(program);

        gl.detachShader(program, vShader);
        gl.detachShader(program, fShader);
        gl.deleteShader(vShader);
        gl.deleteShader(fShader);

        // Check for context loss as suggested by:
        // https://www.khronos.org/webgl/wiki/HandlingContextLost#Handling_Shaders_and_Programs
        if (!gl.getProgramParameter(program, Gl.LINK_STATUS) && !gl.isContextLost())
        {
            const error = new Error(gl.getProgramInfoLog(program)!);

            return new Err(error);
        }

        const attributeMap = _GetAttributes(gl, program);
        const uniformMap = _GetUniforms(gl, program);

        _Logger.debug("Successfully created new shader program");

        return new Ok(new ShaderProgram(gl, {
            handle: program,
            attributeMap: attributeMap,
            uniformMap: uniformMap
        }));
    }

    function _CompileShader(gl: WebGLRenderingContext, type: ShaderType, shaderSrc: string): Result<WebGLShader, Error>
    {
        const shader = gl.createShader(type)!;

        gl.shaderSource(shader, shaderSrc);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, Gl.COMPILE_STATUS) && !gl.isContextLost())
        {
            const error = new Error(gl.getShaderInfoLog(shader)!);

            return new Err(error);
        }

        return new Ok(shader);
    }

    function _GetAttributes(gl: WebGLRenderingContext, program: WebGLProgram): Map<string, number>
    {
        const attributeCount = gl.getProgramParameter(program, Gl.ACTIVE_ATTRIBUTES) as number;
        const attributeMap = new Map<string, number>();

        for (let i = 0; i < attributeCount; ++i)
        {
            const name = gl.getActiveAttrib(program, i)!.name;
            const location = gl.getAttribLocation(program, name);

            attributeMap.set(name, location);
        }

        return attributeMap;
    }

    function _GetUniforms(gl: WebGLRenderingContext, program: WebGLProgram): Map<string, UniformLocation>
    {
        const uniformCount = gl.getProgramParameter(program, Gl.ACTIVE_UNIFORMS) as number;
        const uniformMap = new Map<string, UniformLocation>();

        for (let i = 0; i < uniformCount; ++i)
        {
            const name = gl.getActiveUniform(program, i)!.name;
            const location = gl.getUniformLocation(program, name)!;

            uniformMap.set(name, location);
        }

        return uniformMap;
    }
}