import { TextureMagFilter } from "../constants/textureMagFilter";
import { TextureManagerInternal } from "./textureManager";
import { TextureMinFilter } from "../constants/textureMinFilter";
import { TextureWrap } from "../constants/textureWrap";

/**
 * @internal
 * Contains the values necessary to construct a new `Texture2D`.
 */
export interface TextureParams
{
    readonly manager: TextureManagerInternal;

    readonly handle: WebGLTexture;

    /**
     * The location this image was fetched from, if applicable.
     */
    readonly uri?: string; 

    /**
     * The width of the created image.
     */
    readonly width: number;

    /**
     * The height of the created image.
     */
    readonly height: number;

    /**
     * The texture's minification filter.
     */
    readonly minFilter: TextureMinFilter;

    /**
     * The texture's magnification filter.
     */
    readonly magFilter: TextureMagFilter;

    /**
     * The wrapping function used for this texture's `s` coordinate.
     */
    readonly wrapS: TextureWrap;

    /**
     * The wrapping function used for this texture's `t` coordinate.
     */
    readonly wrapT: TextureWrap;
}