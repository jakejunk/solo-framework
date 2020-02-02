import { Texture2D } from "../../../../src/graphics/texture2d";
import { DummyTextureManager } from "./textureManager.gen";
import { TextureParamsNoHandle } from "./util/textureParams.gen";

export const TextureNoHandle = new Texture2D(new DummyTextureManager(), TextureParamsNoHandle);