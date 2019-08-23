import { Color } from "../graphics/color";
import { ScalingAlgorithm } from "./scalingAlgorithm";

export interface GameParams
{
    /**
     * The width of the game buffer in pixels.
     */
    readonly bufferWidth: number;

    /**
     * The height of the game buffer in pixels.
     */
    readonly bufferHeight: number;

    /**
     * The parent element of the canvas. Default value is the `<body>` element.
     * 
     * If a canvas element is already present in the HTML document, and its ID is provided
     * in the `GameParams.canvasId` property, this value will be ignored.
     */
    parentElement?: HTMLElement;

    /**
     * The ID of the canvas to use for this game. Default value is `solo-game-canvas`.
     * 
     * If a canvas element is not already present in the HTML document with the provided ID,
     * the generated canvas will then use this value.
     */
    canvasId?: string;

    /**
     * The rate per second that `fixedUpdate()` will be called. Default value is `60`.
     */
    fixedUpdateRate?: number;

    /**
     * Whether the timestep used for the main game loop is fixed. Default value is `false`.
     */
    isFixedTimestep?: boolean;

    /**
     * The color of the canvas before rendering. Default value is `#000000`.
     */
    defaultCanvasColor?: Color | string;

    /**
     * Whether the WebGL backbuffer should contain the alpha component. Default value is `false`.
     */
    backBufferAlpha?: boolean;

    /**
     * Tells the canvas how to handle upscaling. Default value is `ScalingAlgorithm.SMOOTH`.
     */
    scalingAlgorithm?: ScalingAlgorithm;
}

/** @internal */
export type GameParamsCompleted = Required<Readonly<GameParams>>;

export namespace GameParams
{
    export function Complete(params: Readonly<GameParams>): GameParamsCompleted
    {
        return {
            bufferWidth: params.bufferHeight,
            bufferHeight: params.bufferHeight,
            parentElement: _CompleteProperty(params.parentElement, document.body),
            canvasId: _CompleteProperty(params.canvasId, "solo-game-canvas"),
            fixedUpdateRate: _CompleteProperty(params.fixedUpdateRate, 60),
            isFixedTimestep: _CompleteProperty(params.isFixedTimestep, false),
            defaultCanvasColor: _CompleteProperty(params.defaultCanvasColor, "#000000"),
            backBufferAlpha: _CompleteProperty(params.backBufferAlpha, false),
            scalingAlgorithm: _CompleteProperty(params.scalingAlgorithm, ScalingAlgorithm.SMOOTH)
        };
    }

    function _CompleteProperty<T>(propertyValue: T | undefined, defaultValue: T): T
    {
        return propertyValue != undefined
            ? propertyValue
            : defaultValue;
    }
}