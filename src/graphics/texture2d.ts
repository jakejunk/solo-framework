import { TextureManager } from "./textureManager";
import { TextureParams } from "./util/textureParams";

export class Texture2D
{
    private readonly _textureManager: TextureManager;
    private _handle: WebGLTexture;
    private _uri?: string;
    private _width: number;
    private _height: number;
    private _minFilter: number;
    private _magFilter: number;
    private _wrapS: number;
    private _wrapT: number;

    constructor(textureManager: TextureManager, tcr: TextureParams)
    {
        this._textureManager = textureManager;
        this._handle = tcr.handle;
        this._uri = tcr.uri;
        this._width = tcr.width;
        this._height = tcr.height;
        this._minFilter = tcr.minFilter;
        this._magFilter = tcr.magFilter;
        this._wrapS = tcr.wrapS;
        this._wrapT = tcr.wrapT;
    }

    /**
     * Gets the underlying WebGL handle for this texture.
     */
    public getHandle(): WebGLTexture
    {
        return this._handle;
    }

    /**
     * Returns the location from which this texture was fetched.
     */
    public getUri(): string | undefined
    {
        return this._uri;
    }

    public getWidth(): number
    {
        return this._width;
    }

    public getHeight(): number
    {
        return this._height;
    }

    public getMinFilter(): number
    {
        return this._minFilter;
    }

    public getMagFilter(): number
    {
        return this._magFilter;
    }

    public setMinFilter(minFilter: number, magFilter: number)
    {
        this._textureManager.setTextureFilter(this, minFilter, magFilter);

        this._minFilter = minFilter;
        this._magFilter = magFilter;
    }

    public getWrapS(): number
    {
        return this._wrapS;
    }

    public getWrapT(): number
    {
        return this._wrapT;
    }

    public setWrap(wrapS: number, wrapT: number)
    {
        this._textureManager.setTextureWrap(this, wrapS, wrapT);

        this._wrapS = wrapS;
        this._wrapT = wrapT;
    }
}