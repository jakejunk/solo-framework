import { GameParamsCompleted } from "./gameParams";
import { QuerySelector } from "../util/querySelector";
import { Logger } from "../util/logger";

export interface GameCanvas extends HTMLCanvasElement
{
    // TODO
}

export namespace GameCanvas
{
    const _Logger = new Logger("GameCanvas");

    export function Create(gameParams: GameParamsCompleted): GameCanvas
    {
        const canvas = _GetCanvas(gameParams);
        canvas.tabIndex = 0;

        const style = canvas.style;
        style.border = "none";
        style.display = "block";
        style.outline = "none";
        style.userSelect = "none";
        style.minWidth = "100%";
        style.backgroundColor = typeof gameParams.defaultCanvasColor !== "string"
            ? gameParams.defaultCanvasColor.toHexString()
            : gameParams.defaultCanvasColor;

        return canvas;
    }

    function _GetCanvas(gameParams: GameParamsCompleted): GameCanvas
    {
        const existingCanvas = QuerySelector("canvas", `#${gameParams.canvasId}`);

        if (existingCanvas != undefined)
        {
            _Logger.debug(`Found existing canvas element: "canvas#${gameParams.canvasId}"`);

            return existingCanvas as GameCanvas;
        }

        _Logger.debug(`Creating canvas element: "canvas#${gameParams.canvasId}"`);

        const canvas = document.createElement("canvas") as GameCanvas;
        canvas.id = gameParams.canvasId;

        return canvas;
    }
}
