import { Err, Ok, Result } from "../../util/result";
import { Gl } from "../constants/gl";
import { IsPowerOfTwo } from "../../math/bits";
import { Logger } from "../../util/logger";
import { Texture2D } from "./texture2d";
import { TextureBindingCache } from "./textureBindingCache";
import { TextureMagFilter } from "../constants/textureMagFilter";
import { TextureManager } from "./textureManager";
import { TextureMinFilter } from "../constants/textureMinFilter";
import { TextureWrap } from "../constants/textureWrap";

export class TextureManagerWebGl1 implements TextureManager
{
    private static _Logger = new Logger(TextureManagerWebGl1.name);

    private _gl: WebGLRenderingContext;
    private _managedTextures: Map<string, Texture2D>;
    private _bindingCache: TextureBindingCache;
    private _shouldMipMap: boolean;
    private _defaultMinFilter: TextureMinFilter;
    private _defaultMagFilter: TextureMagFilter;

    public constructor(gl: WebGLRenderingContext, defaultMinFilter = TextureMinFilter.LINEAR, defaultMagFilter = TextureMagFilter.LINEAR)
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
        const minFilter = shouldMipMap ? this._defaultMinFilter : TextureMinFilter.LINEAR;
        const magFilter = this._defaultMagFilter;
        const wrapS = isPowerOfTwoImage ? TextureWrap.REPEAT : TextureWrap.CLAMP_TO_EDGE;
        const wrapT = wrapS;
        const gl = this._gl;

        // Null should only happen here in the case of context loss
        const glTexture = gl.createTexture()!;

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

    public setTextureFilter(texture: Texture2D, minFilter: TextureMinFilter, magFilter: TextureMagFilter)
    {
        this._bindTempTexture(texture);
        this._setBoundTextureFilter(minFilter, magFilter);
    }

    private _setBoundTextureFilter(minFilter: TextureMinFilter, magFilter: TextureMagFilter)
    {
        this._gl.texParameteri(Gl.TEXTURE_2D, Gl.TEXTURE_MIN_FILTER, minFilter);
        this._gl.texParameteri(Gl.TEXTURE_2D, Gl.TEXTURE_MAG_FILTER, magFilter);
    }

    public setTextureWrap(texture: Texture2D, wrapS: TextureWrap, wrapT: TextureWrap)
    {
        this._bindTempTexture(texture);
        this._setBoundTextureWrap(wrapS, wrapT);
    }

    private _setBoundTextureWrap(wrapS: TextureWrap, wrapT: TextureWrap)
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
            return new Err(new Error(`Texture cannot be managed`));
        }

        if (this._managedTextures.has(textureUri))
        {
            TextureManagerWebGl1._Logger.debug(`Texture "${textureUri}" is already managed`);
            return new Ok(undefined);
        }
        
        this._managedTextures.set(textureUri, texture);

        TextureManagerWebGl1._Logger.debug(`Managing texture "${textureUri}"`);
        return new Ok(undefined);
    }

    public getManagedTexture(uri: string): Texture2D | undefined
    {
        return this._managedTextures.get(uri);
    }
}