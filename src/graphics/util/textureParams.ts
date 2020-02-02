/**
 * Contains the values necessary to contruct a new `Texture2D`.
 * This type is mainly used internally by `TextureManager`.
 */
export interface TextureParams
{
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
    readonly minFilter: number;

    /**
     * The texture's magnification filter.
     */
    readonly magFilter: number;

    /**
     * The wrapping function used for this texture's `s` coordinate.
     */
    readonly wrapS: number;

    /**
     * The wrapping function used for this texture's `t` coordinate.
     */
    readonly wrapT: number;
}