import { Matrix4 } from "../../math/matrix44";
import { ShaderManagerInternal, UniformLocation } from "./shaderManager";
import { ShaderProgramParams } from "./shaderProgramParams";

export class ShaderProgram
{
    private readonly _shaderManager: ShaderManagerInternal;
    private _handle: WebGLProgram;
    private _attributeMap: Map<string, number>;
    private _uniformMap: Map<string, UniformLocation>;
    
    /**
     * @internal
     */
    public constructor(shaderManager: ShaderManagerInternal, params: ShaderProgramParams)
    {
        this._shaderManager = shaderManager;
        this._handle = params.handle;
        this._attributeMap = params.attributeMap;
        this._uniformMap = params.uniformMap;
    }

    public getHandle(): WebGLProgram
    {
        return this._handle;
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
     * Sets a uniform variable to the provided matrix.
     */
    public setUniformMatrix4(location: UniformLocation, matrix: Matrix4)
    {
        this._shaderManager.setUniformMatrix4(this, location, matrix);
    }
}