import { ShaderManager, UniformLocation } from "./shaderManager";

export class ShaderProgram
{
    private readonly _shaderManager: ShaderManager;
    private _handle: WebGLProgram;
    
    constructor(shaderManager: ShaderManager, handle: WebGLProgram)
    {
        this._shaderManager = shaderManager;
        this._handle = handle;
    }

    public getHandle(): WebGLProgram
    {
        return this._handle;
    }

    public getAttribLocation(name: string): number
    {
        return this._shaderManager.getAttribLocation(this, name);
    }

    public getUniformLocation(name: string): UniformLocation
    {
        return this._shaderManager.getUniformLocation(this, name);
    }
}