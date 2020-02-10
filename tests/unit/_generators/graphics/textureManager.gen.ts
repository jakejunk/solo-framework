import { Texture2D } from "../../../../src/graphics/textures/texture2d";
import { TextureManager } from "../../../../src/graphics/textures/textureManager";
import { TextureParamsNoHandle } from "./util/textureParams.gen";

export class DummyTextureManager implements TextureManager
{
    createTextureFromImage(image: HTMLImageElement): Texture2D
    {
        return new Texture2D(this, TextureParamsNoHandle);
    }
    
    bindTexture(texture: Texture2D): number
    {
        return 0
    }

    bindTextureToLocation(texture: Texture2D, location: number): void
    {
        
    }

    setTextureFilter(texture: Texture2D, minFilter: number, magFilter: number): void
    {
        
    }

    setTextureWrap(texture: Texture2D, wrapS: number, wrapT: number): void
    {
        
    }

    addManagedTexture(texture: Texture2D): void
    {
        throw new Error("Method not implemented for mock.");
    }

    getManagedTexture(uri: string): Texture2D
    {
        throw new Error("Method not implemented for mock.");
    }
}