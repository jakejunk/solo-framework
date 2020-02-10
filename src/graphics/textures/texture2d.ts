import { TextureMagFilter } from "../constants/textureMagFilter";
import { TextureManager } from "./textureManager";
import { TextureMinFilter } from "../constants/textureMinFilter";
import { TextureParams } from "./textureParams";
import { TextureWrap } from "../constants/textureWrap";

export class Texture2D
{
    private readonly _textureManager: TextureManager;
    private _handle: WebGLTexture;
    private _uri?: string;
    private _width: number;
    private _height: number;
    private _minFilter: TextureMinFilter;
    private _magFilter: TextureMagFilter;
    private _wrapS: TextureWrap;
    private _wrapT: TextureWrap;

    public constructor(textureManager: TextureManager, params: TextureParams)
    {
        this._textureManager = textureManager;
        this._handle = params.handle;
        this._uri = params.uri;
        this._width = params.width;
        this._height = params.height;
        this._minFilter = params.minFilter;
        this._magFilter = params.magFilter;
        this._wrapS = params.wrapS;
        this._wrapT = params.wrapT;
    }

    /**
     * Gets the underlying WebGL handle for this texture.
     */
    public getHandle(): WebGLTexture
    {
        return this._handle;
    }

    /**
     * Returns the location from which this texture was fetched, if applicable.
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

    public getMinFilter(): TextureMinFilter
    {
        return this._minFilter;
    }

    public getMagFilter(): TextureMagFilter
    {
        return this._magFilter;
    }

    public setMinFilter(minFilter: TextureMinFilter, magFilter: TextureMagFilter)
    {
        this._textureManager.setTextureFilter(this, minFilter, magFilter);

        this._minFilter = minFilter;
        this._magFilter = magFilter;
    }

    public getWrapS(): TextureWrap
    {
        return this._wrapS;
    }

    public getWrapT(): TextureWrap
    {
        return this._wrapT;
    }

    public setWrap(wrapS: TextureWrap, wrapT: TextureWrap)
    {
        this._textureManager.setTextureWrap(this, wrapS, wrapT);

        this._wrapS = wrapS;
        this._wrapT = wrapT;
    }
}