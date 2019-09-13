import { QuerySelector } from "../util/querySelector";
import { Logger } from "../util/logger";
import { Color } from "../graphics/color";
import { ScalingAlgorithm } from "./scalingAlgorithm";

export interface GameCanvas extends HTMLCanvasElement
{
    dataset: DOMStringMap & {
        soloIsConfigured: boolean
    };
}

export namespace GameCanvas
{
    const _Logger = new Logger("GameCanvas");

    /**
     * Creates a new `GameCanvas` with the specified ID.
     * Uses an existing canvas if one with the specified ID already exists;
     * otherwise, a new one will be created.
     */
    export function Create(
        id: string, defaultCanvasColor: Color | string = "#000", scalingAlgorithm = ScalingAlgorithm.SMOOTH): GameCanvas
    {
        const canvas = _GetCanvas(id);

        const style = canvas.style;
        style.border = "none";
        style.display = "block";
        style.outline = "none";
        style.userSelect = "none";
        style.minWidth = "100%";

        style.backgroundColor = (typeof defaultCanvasColor !== "string")
            ? defaultCanvasColor.toHexString()
            : defaultCanvasColor;

        style.imageRendering = (scalingAlgorithm === ScalingAlgorithm.SMOOTH)
            ? "auto"
            : "pixelated";
        
        canvas.tabIndex = 0;
        canvas.dataset.soloIsConfigured = true;

        return canvas;
    }

    function _GetCanvas(id: string): GameCanvas
    {
        const existingCanvas = QuerySelector("canvas", `#${id}`);

        if (existingCanvas != undefined)
        {
            if (existingCanvas.dataset.soloIsConfigured === "true")
            {
                _Logger.warn(`Canvas element "canvas#${id}" has already been configured`);
            }
            else
            {
                _Logger.debug(`Found existing canvas element: "canvas#${id}"`);
            }

            return existingCanvas as GameCanvas;
        }

        _Logger.debug(`Creating canvas element: "canvas#${id}"`);

        const canvas = document.createElement("canvas") as GameCanvas;
        canvas.id = id;

        return canvas;
    }
}
