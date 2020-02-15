import { ShaderManager, UniformLocation } from "./shaderManager";
import { ShaderProgramParams } from "./shaderProgramParams";

export class ShaderProgram
{
    private readonly _shaderManager: ShaderManager;
    private _handle: WebGLProgram;
    private _attributeMap: Map<string, number>;
    private _uniformMap: Map<string, UniformLocation>;
    
    public constructor(shaderManager: ShaderManager, params: ShaderProgramParams)
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
}