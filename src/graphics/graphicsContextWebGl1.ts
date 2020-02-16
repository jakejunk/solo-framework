import { ClearOptions } from "./constants/clearOptions";
import { Color } from "./color";
import { GraphicsContext } from "./graphicsContext";
import { Logger } from "../util/logger";
import { ShaderManagerInternal } from "./shaders/shaderManager";
import { ShaderManagerWebGl1 } from "./shaders/shaderManagerWebGl1";
import { TextureManagerInternal } from "./textures/textureManager";
import { TextureManagerWebGl1 } from "./textures/textureManagerWebGl1";
import { VertexManagerInternal } from "./vertices/vertexManager";
import { VertexManagerWebGl1 } from "./vertices/vertexManagerWebGl1";

/**
 * @internal
 */
export class GraphicsContextWebGl1 implements GraphicsContext
{
    private static readonly _Logger = new Logger(GraphicsContextWebGl1.name);

    public readonly gl: WebGLRenderingContext;
    public readonly vertexManager: VertexManagerInternal;
    public readonly shaderManager: ShaderManagerInternal;
    public readonly textureManager: TextureManagerInternal;

    private _bufferWidth!: number;
    private _bufferHeight!: number;

    constructor(context: WebGLRenderingContext, bufferWidth: number, bufferHeight: number)
    {
        this.gl = context;
        this.vertexManager = new VertexManagerWebGl1(context);
        this.shaderManager = new ShaderManagerWebGl1(context);
        this.textureManager = new TextureManagerWebGl1(context);

        this._initViewport(bufferWidth, bufferHeight);
    }

    private _initViewport(bufferWidth: number, bufferHeight: number)
    {
        this.gl.canvas.width = bufferWidth;
        this.gl.canvas.height = bufferHeight;

        this._bufferWidth = bufferWidth;
        this._bufferHeight = bufferHeight;
    }

    public clear(clearMask: ClearOptions | number)
    {
        this.gl.clear(clearMask);
    }

    public setClearColor(color: Color)
    {
        const r = color.getR() / 255;
        const g = color.getG() / 255;
        const b = color.getB() / 255;
        const a = color.getA() / 255;

        this.gl.clearColor(r, g, b, a);
    }
}