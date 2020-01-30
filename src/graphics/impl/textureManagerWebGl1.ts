import { Texture2D } from "../texture2d";
import { Logger } from "../../util/logger";
import { TextureManager } from "../textureManager";
import { Gl } from "../util/gl";
import { IsPowerOfTwo } from "../../util/bits";
import { Result } from "../../util/result";
import { TextureBindingCache } from "../util/textureBindingCache";

export class TextureManagerWebGl1 implements TextureManager
{
    private static _Logger = new Logger("TextureManagerWebGl1");

    private _gl: WebGLRenderingContext;
    private _managedTextures: Map<string, Texture2D>;
    private _bindingCache: TextureBindingCache;
    private _shouldMipMap: boolean;
    private _defaultMinFilter: number;
    private _defaultMagFilter: number;

    public constructor(gl: WebGLRenderingContext, defaultMinFilter = Gl.LINEAR, defaultMagFilter = Gl.LINEAR)
    {
        this._gl = gl;
        this._managedTextures = new Map();
        this._bindingCache = new TextureBindingCache(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
        this._shouldMipMap = true;
        this._defaultMinFilter = defaultMinFilter;
        this._defaultMagFilter = defaultMagFilter;
    }

    public createTextureFromImage(image: HTMLImageElement): Texture2D
    {
        // WebGL1 constraints:
        // Non power-of-2 images must have filtering set to NEAREST or LINEAR, 
        // wrapping mode must be set to CLAMP_TO_EDGE, and no mipmaps

        const isPowerOfTwoImage = IsPowerOfTwo(image.width) && IsPowerOfTwo(image.height);
        const shouldMipMap = isPowerOfTwoImage && this._shouldMipMap;
        const minFilter = shouldMipMap ? this._defaultMinFilter : Gl.LINEAR;
        const magFilter = this._defaultMagFilter;
        const wrapS = isPowerOfTwoImage ? Gl.REPEAT : Gl.CLAMP_TO_EDGE;
        const wrapT = wrapS;
        const gl = this._gl;

        // Null should only happen here in the case of context loss
        const glTexture = gl.createTexture() as WebGLTexture;

        this._bindingCache.markDirty(7);

        gl.activeTexture(Gl.TEXTURE0 + 7);
        gl.bindTexture(Gl.TEXTURE_2D, glTexture);
        gl.texImage2D(Gl.TEXTURE_2D, 0, Gl.RGBA, Gl.RGBA, Gl.UNSIGNED_BYTE, image);
        this._setBoundTextureFilter(minFilter, magFilter);
        this._setBoundTextureWrap(wrapS, wrapT);

        if (shouldMipMap)
        {
            gl.generateMipmap(Gl.TEXTURE_2D);
        }

        const texture = new Texture2D(this, {
            handle: glTexture,
            uri: image.src,
            width: image.width,
            height: image.height,
            minFilter: minFilter,
            magFilter: magFilter,
            wrapS: wrapS,
            wrapT: wrapT 
        });

        this.addManagedTexture(texture);

        return texture;
    }

    public setTextureFilter(texture: Texture2D, minFilter: number, magFilter: number)
    {
        this._bindTempTexture(texture);
        this._setBoundTextureFilter(minFilter, magFilter);
    }

    private _setBoundTextureFilter(minFilter: number, magFilter: number)
    {
        this._gl.texParameteri(Gl.TEXTURE_2D, Gl.TEXTURE_MIN_FILTER, minFilter);
        this._gl.texParameteri(Gl.TEXTURE_2D, Gl.TEXTURE_MAG_FILTER, magFilter);
    }

    public setTextureWrap(texture: Texture2D, wrapS: number, wrapT: number)
    {
        this._bindTempTexture(texture);
        this._setBoundTextureWrap(wrapS, wrapT);
    }

    private _setBoundTextureWrap(wrapS: number, wrapT: number)
    {
        this._gl.texParameteri(Gl.TEXTURE_2D, Gl.TEXTURE_WRAP_S, wrapS);
        this._gl.texParameteri(Gl.TEXTURE_2D, Gl.TEXTURE_WRAP_T, wrapT);
    }

    private _bindTempTexture(texture: Texture2D)
    {
        this.bindTextureToLocation(texture, 7);
    }

    public bindTexture(texture: Texture2D): number
    {
        const bindLocation = this._bindingCache.getBindLocation(texture);

        if (bindLocation != undefined)
        {
            return bindLocation;
        }
        
        const location = this._bindingCache.bindAnywhere(texture);

        this._gl.activeTexture(Gl.TEXTURE0 + location);
        this._gl.bindTexture(Gl.TEXTURE_2D, texture.getHandle());

        return location;
    }

    public bindTextureToLocation(texture: Texture2D, location: number)
    {
        if (this._bindingCache.bindAtLocation(texture, location))
        {
            return;
        }

        this._gl.activeTexture(Gl.TEXTURE0 + location);
        this._gl.bindTexture(Gl.TEXTURE_2D, texture.getHandle());
    }

    public addManagedTexture(texture: Texture2D): Result<undefined, Error>
    {
        const textureUri = texture.getUri();

        if (textureUri == undefined)
        {
            return Result.OfError(new Error(`Texture cannot be managed`));
        }

        if (this._managedTextures.has(textureUri))
        {
            TextureManagerWebGl1._Logger.debug(`Texture "${textureUri}" is already managed`);
            return Result.OfOk(undefined);
        }
        
        this._managedTextures.set(textureUri, texture);

        TextureManagerWebGl1._Logger.debug(`Managing texture "${textureUri}"`);
        return Result.OfOk(undefined);
    }

    public getManagedTexture(uri: string): Texture2D | undefined
    {
        return this._managedTextures.get(uri);
    }
}