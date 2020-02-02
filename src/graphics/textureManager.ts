import { Texture2D } from "./texture2d";

export interface TextureManager
{
    createTextureFromImage(image: HTMLImageElement): Texture2D;

    bindTexture(texture: Texture2D): number;

    bindTextureToLocation(texture: Texture2D, location: number): void;

    setTextureFilter(texture: Texture2D, minFilter: number, magFilter: number): void;

    setTextureWrap(texture: Texture2D, wrapS: number, wrapT: number): void;

    addManagedTexture(texture: Texture2D): void;

    getManagedTexture(uri: string): Texture2D | undefined;
}