import { GameCanvas } from "../core/gameCanvas";
import { Logger } from "../util/logger";
import { Result } from "../util/result";
import { Color } from "./color";
import { ClearOptions } from "./clearOptions";

export class GraphicsContext
{
    private static readonly _Logger = new Logger("GraphicsContext");

    readonly gl: WebGLRenderingContext;

    private constructor(context: WebGLRenderingContext)
    {
        this.gl = context;
    }

    static Create(canvas: GameCanvas, backBufferAlpha = false): Result<GraphicsContext, string>
    {
        const contextAttributes: WebGLContextAttributes = {
            alpha: backBufferAlpha,
            preserveDrawingBuffer: false
        };

        const webgl2Context = canvas.getContext("webgl2", contextAttributes);
        if (webgl2Context instanceof WebGLRenderingContext)
        {
            this._Logger.debug("Found a WebGL2 rendering context");

            return new GraphicsContext(webgl2Context);
        }

        const webglContext = canvas.getContext("webgl", contextAttributes);
        if (webglContext != undefined)
        {
            this._Logger.debug("Found a WebGL rendering context");

            return new GraphicsContext(webglContext);
        }

        return "Could not find a WebGL rendering context";
    }

    /**
     * Clears the specified buffers to preset values.
     */
    clear(clearMask: ClearOptions | number)
    {
        this.gl.clear(clearMask);
    }

    /**
     * Specifies the color used when clearing color buffers.
     */
    setClearColor(color: Color)
    {
        this.gl.clearColor(color.r, color.g, color.b, color.a);
    }
}