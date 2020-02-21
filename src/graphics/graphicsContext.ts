import { ClearOptions } from "./constants/clearOptions";
import { Color } from "./color";
import { Err, Ok, Result } from "../util/result";
import { GameCanvas } from "../core/gameCanvas";
import { GraphicsContextWebGl1 } from "./graphicsContextWebGl1";
import { Logger } from "../util/logger";
import { MeshManager } from "./meshes/meshManager";
import { ShaderManager } from "./shaders/shaderManager";
import { TextureManager } from "./textures/textureManager";

export interface GraphicsContext
{
    readonly gl: WebGLRenderingContext;
    readonly shaderManager: ShaderManager;
    readonly textureManager: TextureManager;
    readonly meshManager: MeshManager;

    /**
     * Clears the specified buffers to preset values.
     */
    clear(clearMask: ClearOptions | number): void;

    /**
     * Specifies the color used when clearing color buffers.
     */
    setClearColor(color: Color): void;
}

export namespace GraphicsContext
{
    const _Logger = new Logger("GraphicsContext");

    export function Create(canvas: GameCanvas, bufferWidth: number, bufferHeight: number, bufferAlpha = false): Result<GraphicsContext, Error>
    {
        const contextAttributes: WebGLContextAttributes = {
            alpha: bufferAlpha,
            preserveDrawingBuffer: false
        };

        // TODO: WebGL2

        const webglContext = canvas.getContext("webgl", contextAttributes);
        if (webglContext != undefined)
        {
            _Logger.debug("Found a WebGL rendering context");

            return new Ok(new GraphicsContextWebGl1(webglContext, bufferWidth, bufferHeight));
        }

        const error = new Error("Could not find a WebGL rendering context");

        return new Err(error);
    }
}