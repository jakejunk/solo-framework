import { Color } from "./color";
import { ClearOptions } from "./clearOptions";
import { GameCanvas } from "../core/gameCanvas";
import { Logger } from "../util/logger";
import { Result } from "../util/result";

export class GraphicsContext
{
    private static readonly _Logger = new Logger("GraphicsContext");

    readonly gl: WebGLRenderingContext;
    private _bufferWidth!: number;
    private _bufferHeight!: number;

    private constructor(context: WebGLRenderingContext, bufferWidth: number, bufferHeight: number)
    {
        this.gl = context;

        this._initViewport(bufferWidth, bufferHeight);
    }

    static Create(canvas: GameCanvas, bufferWidth: number, bufferHeight: number, bufferAlpha = false): Result<GraphicsContext, string>
    {
        const contextAttributes: WebGLContextAttributes = {
            alpha: bufferAlpha,
            preserveDrawingBuffer: false
        };

        // FIXME: This becomes a `CanvasRenderingContext2D | WebGLRenderingContext`, apparently
        /*
        const webgl2Context = canvas.getContext("webgl2", contextAttributes);
        if (webgl2Context != undefined)
        {
            this._Logger.debug("Found a WebGL2 rendering context");

            return new GraphicsContext(webgl2Context, bufferWidth, bufferHeight);
        }*/

        const webglContext = canvas.getContext("webgl", contextAttributes);
        if (webglContext != undefined)
        {
            this._Logger.debug("Found a WebGL rendering context");

            return new GraphicsContext(webglContext, bufferWidth, bufferHeight);
        }

        return "Could not find a WebGL rendering context";
    }

    private _initViewport(bufferWidth: number, bufferHeight: number)
    {
        this.gl.canvas.width = bufferWidth;
        this.gl.canvas.width = bufferHeight;

        this._bufferWidth = bufferWidth;
        this._bufferHeight = bufferHeight;
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
        const r = color.getR() / 255;
        const g = color.getG() / 255;
        const b = color.getB() / 255;
        const a = color.getA() / 255;

        this.gl.clearColor(r, g, b, a);
    }
}