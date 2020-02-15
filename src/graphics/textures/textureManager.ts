import { Texture2D } from "./texture2d";
import { TextureMagFilter } from "../constants/textureMagFilter";
import { TextureMinFilter } from "../constants/textureMinFilter";
import { TextureWrap } from "../constants/textureWrap";

export interface TextureManager
{
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
     * Sets the min and mag filter of the provided texture.
     */
    setTextureFilter(texture: Texture2D, minFilter: TextureMinFilter, magFilter: TextureMagFilter): void;

    setTextureWrap(texture: Texture2D, wrapS: TextureWrap, wrapT: TextureWrap): void;

    addManagedTexture(texture: Texture2D): void;

    getManagedTexture(uri: string): Texture2D | undefined;
}