import { Game } from "../../src/core/game";
import { GameComponents } from "../../src/core/gameComponents";

export class FunctionCounterGame implements Game
{
    shouldExit: boolean;
    loadCalls: number;
    updateCalls: number;
    drawCalls: number;
    resizeCalls: number;
    resumeCalls: number;
    pauseCalls: number;
    exitCalls: number;

    constructor()
    {
        this.shouldExit = false;
        this.loadCalls = 0;
        this.updateCalls = 0;
        this.drawCalls = 0;
        this.resizeCalls = 0;
        this.resumeCalls = 0;
        this.pauseCalls = 0;
        this.exitCalls = 0;
    }
    
    onLoad(components: GameComponents): Promise<{}>
    {
        this.loadCalls += 1;

        return Promise.resolve({});
    }

    onUpdate(delta: number)
    {
        this.updateCalls += 1;
    }

    onDraw(delta: number)
    {
        this.drawCalls += 1;
    }

    onResize()
    {
        this.resizeCalls += 1;
    }

    onResume()
    {
        this.resumeCalls += 1;
    }

    onPause()
    {
        this.pauseCalls += 1;
    }

    onExit()
    {
        this.exitCalls += 1;
    }
}