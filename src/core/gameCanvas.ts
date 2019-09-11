import { QuerySelector } from "../util/querySelector";
import { Logger } from "../util/logger";
import { Color } from "../graphics/color";

export interface GameCanvas extends HTMLCanvasElement
{
    // TODO
}

export namespace GameCanvas
{
    const _Logger = new Logger("GameCanvas");

    export function Create(id: string, defaultCanvasColor: Color | string): GameCanvas
    {
        const canvas = _GetCanvas(id);
        canvas.tabIndex = 0;

        const style = canvas.style;
        style.border = "none";
        style.display = "block";
        style.outline = "none";
        style.userSelect = "none";
        style.minWidth = "100%";
        style.backgroundColor = typeof defaultCanvasColor !== "string"
            ? defaultCanvasColor.toHexString()
            : defaultCanvasColor;

        return canvas;
    }

    function _GetCanvas(id: string): GameCanvas
    {
        const existingCanvas = QuerySelector("canvas", `#${id}`);

        if (existingCanvas != undefined)
        {
            _Logger.debug(`Found existing canvas element: "canvas#${id}"`);

            return existingCanvas as GameCanvas;
        }

        _Logger.debug(`Creating canvas element: "canvas#${id}"`);

        const canvas = document.createElement("canvas") as GameCanvas;
        canvas.id = id;

        return canvas;
    }
}
