import { Err, Ok, Result } from "../../util/result";
import { Gl } from "../constants/gl";
import { IsPowerOfTwo } from "../../math/bits";
import { Logger } from "../../util/logger";
import { Texture2D } from "./texture2d";
import { TextureBindingCache } from "./textureBindingCache";
import { TextureMagFilter } from "../constants/textureMagFilter";
import { TextureManagerInternal } from "./textureManager";
import { TextureMinFilter } from "../constants/textureMinFilter";
import { TextureWrap } from "../constants/textureWrap";

/**
 * @internal
 */
export class TextureManagerWebGl1 implements TextureManagerInternal
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

    public createTexture2D(image: HTMLImageElement): Texture2D
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

        gl.activeTexture(Gl.TEXTURE0 + 7);
        gl.bindTexture(Gl.TEXTURE_2D, glTexture);
        gl.texImage2D(Gl.TEXTURE_2D, 0, Gl.RGBA, Gl.RGBA, Gl.UNSIGNED_BYTE, image);

        if (shouldMipMap)
        {
            gl.generateMipmap(Gl.TEXTURE_2D);
        }

        const texture = new Texture2D(gl, {
            manager: this,
            handle: glTexture,
            uri: image.src,
            width: image.width,
            height: image.height,
            minFilter: minFilter,
            magFilter: magFilter,
            wrapS: wrapS,
            wrapT: wrapT 
        });

        texture.setFilter(minFilter, magFilter);
        texture.setWrap(wrapS, wrapT);

        this.addManagedTexture(texture);

        return texture;
    }

    public getBindLocation(texture: Texture2D): number | undefined
    {
        return this._bindingCache.getBindLocation(texture);
    }

    public bindAnywhere(texture: Texture2D): number
    {
        return this._bindingCache.bindAnywhere(texture);
    }

    public bindAtLocation(texture: Texture2D, location: number): boolean
    {
        return this._bindingCache.bindAtLocation(texture, location);
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