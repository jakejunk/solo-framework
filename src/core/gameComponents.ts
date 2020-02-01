import { GameCanvas } from "./gameCanvas";
import { GameTimer } from "./gameTimer";
import { GraphicsContext } from "../graphics/graphicsContext";
import { ContentLoader } from "../content/contentLoader";
import { GameParamsCompleted } from "./gameParams";
import { TextureManager } from "../graphics/textureManager";

export interface GameComponents
{
    readonly canvas: GameCanvas;

    readonly timer: GameTimer;

    readonly graphicsContext: GraphicsContext;

    readonly loader: ContentLoader;
}

export namespace GameComponents
{
    /**
     * Builds up all of the necessary components for this game.
     */
    export function Create(params: GameParamsCompleted): GameComponents
    {
        const gameCanvas = GameCanvas.Create(
            params.canvasId, params.defaultCanvasColor, params.scalingAlgorithm);

        if (gameCanvas.parentElement == undefined)
        {
            params.parentElement.appendChild(gameCanvas);
        }

        const timer = _CreateTimer(params);
        const graphicsContext = _CreateGraphicsContext(gameCanvas, params);
        const contentLoader = _CreateContentLoader(graphicsContext.textureManager, params);

        return {
            canvas: gameCanvas,
            timer: timer,
            graphicsContext: graphicsContext,
            loader: contentLoader
        }
    }

    function _CreateTimer(params: GameParamsCompleted): GameTimer
    {
        const desiredFrameTimeMillis = 1000 / params.updateRate;

        return new GameTimer(params.timestep, desiredFrameTimeMillis);
    }

    function _CreateGraphicsContext(canvas: GameCanvas, params: GameParamsCompleted): GraphicsContext
    {
        const graphicsContextResult = GraphicsContext.Create(
            canvas, params.bufferWidth, params.bufferHeight, params.backBufferAlpha);

        if (graphicsContextResult.isError())
        {
            throw graphicsContextResult.errorValue;
        }

        return graphicsContextResult.okValue;
    }

    function _CreateContentLoader(textureManager: TextureManager, params: GameParamsCompleted)
    {
        const contentLoaderResult = ContentLoader.Create(textureManager, params.rootDirectory);

        if (contentLoaderResult.isError())
        {
            throw contentLoaderResult.errorValue;
        }

        return contentLoaderResult.okValue;
    }
}