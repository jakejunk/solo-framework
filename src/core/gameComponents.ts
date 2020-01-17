import { GameCanvas } from "./gameCanvas.js";
import { GameTimer } from "./gameTimer.js";
import { GraphicsContext } from "../graphics/graphicsContext.js";

export interface GameComponents
{
    readonly canvas: GameCanvas;

    readonly timer: GameTimer;

    readonly graphicsContext: GraphicsContext;
}
