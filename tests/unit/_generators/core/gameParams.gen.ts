import { GameParams, GameParamsCompleted } from "../../../../src/core/gameParams";

export const CreatedWithDefaults: GameParamsCompleted = GameParams.Complete({
    bufferWidth: 300,
    bufferHeight: 300
});

export function CreateWithId(id: string): GameParamsCompleted
{
    return GameParams.Complete({
        bufferWidth: 300,
        bufferHeight: 300,
        canvasId: id
    });
}