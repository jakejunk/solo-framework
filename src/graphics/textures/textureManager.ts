import { Texture2D } from "./texture2d";

/**
 * Provides an interface for texture creation and management.
 */
export interface TextureManager
{
    /**
     * Creates a new texture from the provided image element.
     */
    createTexture2D(image: HTMLImageElement): Texture2D;

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
    getBindLocation(texture: Texture2D): number | undefined;

    bindAnywhere(texture: Texture2D): number;

    bindAtLocation(texture: Texture2D, location: number): boolean;

    addManagedTexture(texture: Texture2D): void;
}