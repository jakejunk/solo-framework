import { Texture2D } from "./texture2d";
import { TextureMagFilter } from "../constants/textureMagFilter";
import { TextureMinFilter } from "../constants/textureMinFilter";
import { TextureWrap } from "../constants/textureWrap";

export interface TextureManager
{
    createTextureFromImage(image: HTMLImageElement): Texture2D;

    bindTexture(texture: Texture2D): number;

    bindTextureToLocation(texture: Texture2D, location: number): void;

    setTextureFilter(texture: Texture2D, minFilter: TextureMinFilter, magFilter: TextureMagFilter): void;

    setTextureWrap(texture: Texture2D, wrapS: TextureWrap, wrapT: TextureWrap): void;

    addManagedTexture(texture: Texture2D): void;

    getManagedTexture(uri: string): Texture2D | undefined;
}