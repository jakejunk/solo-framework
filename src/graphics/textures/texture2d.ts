import { Gl } from "../constants/gl";
import { TextureMagFilter } from "../constants/textureMagFilter";
import { TextureManagerInternal } from "./textureManager";
import { TextureMinFilter } from "../constants/textureMinFilter";
import { TextureParams } from "./textureParams";
import { TextureWrap } from "../constants/textureWrap";

export class Texture2D
{
    private _gl: WebGLRenderingContext;
    private readonly _textureManager: TextureManagerInternal;
    private readonly _uri?: string;
    private readonly _width: number;
    private readonly _height: number;
    private _handle: WebGLTexture;
    private _minFilter: TextureMinFilter;
    private _magFilter: TextureMagFilter;
    private _wrapS: TextureWrap;
    private _wrapT: TextureWrap;

    /**
     * @internal
     */
    public constructor(gl: WebGLRenderingContext, params: TextureParams)
    {
        this._gl = gl;
        this._textureManager = params.manager;
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

    /**
     * Sets the min and mag filter of this texture.
     */
    public setFilter(minFilter: TextureMinFilter, magFilter: TextureMagFilter)
    {
        this.bindToLocation(7);

        this._gl.texParameteri(Gl.TEXTURE_2D, Gl.TEXTURE_MIN_FILTER, minFilter);
        this._gl.texParameteri(Gl.TEXTURE_2D, Gl.TEXTURE_MAG_FILTER, magFilter);

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
        this.bindToLocation(7);

        this._gl.texParameteri(Gl.TEXTURE_2D, Gl.TEXTURE_WRAP_S, wrapS);
        this._gl.texParameteri(Gl.TEXTURE_2D, Gl.TEXTURE_WRAP_T, wrapT);

        this._wrapS = wrapS;
        this._wrapT = wrapT;
    }

    /**
     * @internal
     * Binds this texture for rendering.
     * Returns the location of the internal texture unit it was bound to.
     */
    public bind(): number
    {
        const bindLocation = this._textureManager.getBindLocation(this);

        if (bindLocation != undefined)
        {
            return bindLocation;
        }
        
        const location = this._textureManager.bindAnywhere(this);

        this._gl.activeTexture(Gl.TEXTURE0 + location);
        this._gl.bindTexture(Gl.TEXTURE_2D, this._handle);

        return location;
    }

    /**
     * @internal
     * Binds a texture at a specific location for rendering.
     */
    public bindToLocation(location: number)
    {
        if (this._textureManager.bindAtLocation(this, location))
        {
            return;
        }

        this._gl.activeTexture(Gl.TEXTURE0 + location);
        this._gl.bindTexture(Gl.TEXTURE_2D, this._handle);
    }
}