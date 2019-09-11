import { GameParams, GameParamsCompleted } from "../../../src/core/gameParams";
import { Color } from "../../../src/graphics/color";
import { ScalingAlgorithm } from "../../../src/core/scalingAlgorithm";
import { expect } from "chai";
import "mocha";
import { Timestep } from "../../../src/core/timestep";

describe("GameParams", () =>
{
    describe("Complete()", () =>
    {
        it("all user-controlled values are preserved", () =>
        {
            const initialParams: GameParamsCompleted = {
                bufferWidth: 300,
                bufferHeight: 300,
                parentElement: document.body,
                canvasId: "some-special-name",
                timestep: Timestep.FIXED,
                updateRate: 72,
                defaultCanvasColor: Color.WHITE,
                backBufferAlpha: false,
                scalingAlgorithm: ScalingAlgorithm.PIXELATED
            };

            const completedParams = GameParams.Complete(initialParams as GameParams);

            expect(completedParams.bufferWidth).to.equal(initialParams.bufferWidth);
            expect(completedParams.bufferHeight).to.equal(initialParams.bufferHeight);
            expect(completedParams.parentElement).to.equal(initialParams.parentElement);
            expect(completedParams.canvasId).to.equal(initialParams.canvasId);
            expect(completedParams.timestep).to.equal(initialParams.timestep);
            expect(completedParams.updateRate).to.equal(initialParams.updateRate);
            expect(completedParams.backBufferAlpha).to.equal(initialParams.backBufferAlpha);
            expect(completedParams.scalingAlgorithm).to.equal(initialParams.scalingAlgorithm);

            const colorsAreEqual = initialParams.defaultCanvasColor != undefined
                && typeof initialParams.defaultCanvasColor !== "string"
                && typeof completedParams.defaultCanvasColor !== "string"
                && completedParams.defaultCanvasColor.equals(initialParams.defaultCanvasColor);

            expect(colorsAreEqual).to.be.true;
        });
    });
});
