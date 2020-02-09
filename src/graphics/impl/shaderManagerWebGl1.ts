import { Err, Ok, Result } from "../../util/result";
import { Gl } from "../constants/gl";
import { ShaderManager, UniformLocation } from "../shaderManager";
import { ShaderProgram } from "../shaderProgram";
import { ShaderType } from "../constants/shaderType";

export class ShaderManagerWebGl1 implements ShaderManager
{
    private _gl: WebGLRenderingContext;

    public constructor(gl: WebGLRenderingContext)
    {
        this._gl = gl;
    }

    public createShaderProgram(vShaderSrc: string, fShaderSrc: string): Result<ShaderProgram, Error>
    {
        const gl = this._gl;
        const vShaderResult = this._compileShader(ShaderType.VERTEX_SHADER, vShaderSrc);

        if (vShaderResult.isErr())
        {
            return new Err(vShaderResult.errValue);
        }

        const fShaderResult = this._compileShader(ShaderType.FRAGMENT_SHADER, fShaderSrc);

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

        return new Ok(new ShaderProgram(this, program));
    }

    private _compileShader(type: ShaderType, shaderSrc: string): Result<WebGLShader, Error>
    {
        const gl = this._gl;
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

    public getAttribLocation(program: ShaderProgram, name: string): number
    {
        throw new Error("Method not implemented.");
    }
    
    public getUniformLocation(program: ShaderProgram, name: string): UniformLocation
    {
        const handle = program.getHandle();

        return this._gl.getUniformLocation(handle, name)!;
    }
}