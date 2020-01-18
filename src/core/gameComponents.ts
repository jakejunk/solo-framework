import { GameCanvas } from "./gameCanvas";
import { GameTimer } from "./gameTimer";
import { GraphicsContext } from "../graphics/graphicsContext";

export interface GameComponents
{
    readonly canvas: GameCanvas;

    readonly timer: GameTimer;

    readonly graphicsContext: GraphicsContext;
}
