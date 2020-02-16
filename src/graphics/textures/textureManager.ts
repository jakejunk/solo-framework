import { Texture2D } from "./texture2d";
import { TextureMagFilter } from "../constants/textureMagFilter";
import { TextureMinFilter } from "../constants/textureMinFilter";
import { TextureWrap } from "../constants/textureWrap";

/**
 * Provides an interface to all texture-related functions of the graphics context.
 */
export interface TextureManager
{
    /**
     * Creates a new texture from the provided image element.
     */
    createTextureFromImage(image: HTMLImageElement): Texture2D;

    /**
     * Binds a texture for rendering.
     * Returns the location of the internal texture unit it was bound to.
     */
    bindTexture(texture: Texture2D): number;

    /**
     * Binds a texture at a specific location for rendering.
     */
    bindTextureToLocation(texture: Texture2D, location: number): void;

    /**
     * Gets a previously created texture based on its origin URI.
     */
    getManagedTexture(uri: string): Texture2D | undefined;
}

/**
 * @internal
 */
export interface TextureManagerInternal extends TextureManager
{
    /**
     * Sets the min and mag filter of the provided texture.
     */
    setTextureFilter(texture: Texture2D, minFilter: TextureMinFilter, magFilter: TextureMagFilter): void;

    setTextureWrap(texture: Texture2D, wrapS: TextureWrap, wrapT: TextureWrap): void;

    addManagedTexture(texture: Texture2D): void;
}