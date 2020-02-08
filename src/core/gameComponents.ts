import { ContentLoader } from "../content/contentLoader";
import { GameCanvas } from "./gameCanvas";
import { GameParamsCompleted } from "./gameParams";
import { GameTimer } from "./gameTimer";
import { GraphicsContext } from "../graphics/graphicsContext";
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
        const gameCanvas = _CreateCanvas(params);
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

    function _CreateCanvas(params: GameParamsCompleted): GameCanvas
    {
        const gameCanvas = GameCanvas.Create(
            params.canvasId, params.defaultCanvasColor, params.scalingAlgorithm);

        if (gameCanvas.parentElement == undefined)
        {
            params.parentElement.appendChild(gameCanvas);
        }

        // TODO: Should the game automatically steal focus?
        //gameCanvas.focus();

        return gameCanvas;
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

        return graphicsContextResult.unwrap();
    }

    function _CreateContentLoader(textureManager: TextureManager, params: GameParamsCompleted): ContentLoader
    {
        const hasFetch = "fetch" in window;

        if (!hasFetch)
        {
            // TODO: Maybe use a polyfill... eh
            throw new Error("The Fetch API is not supported.");
        }

        return new ContentLoader(window.fetch, textureManager, params.rootDirectory);
    }
}