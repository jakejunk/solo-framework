import { GameParams } from "../../src/core/gameParams";
import { Color } from "../../src/graphics/color";
import { ScalingAlgorithm } from "../../src/core/scalingAlgorithm";
import { expect } from "chai";
import "mocha";

describe("GameParams", () =>
{
    describe("Complete()", () =>
    {
        it("all user-controlled values are preserved", () =>
        {
            const initialParams: GameParams = {
                bufferWidth: 300,
                bufferHeight: 300,
                parentElement: document.body,
                canvasId: "some-special-name",
                fixedUpdateRate: 72,
                defaultCanvasColor: Color.WHITE,
                backBufferAlpha: false,
                scalingAlgorithm: ScalingAlgorithm.PIXELATED
            };

            const completedParams = GameParams.Complete(initialParams);

            expect(completedParams.bufferWidth).equals(initialParams.bufferWidth);
            expect(completedParams.bufferHeight).equals(initialParams.bufferHeight);
            expect(completedParams.parentElement).equals(initialParams.parentElement);
            expect(completedParams.canvasId).equals(initialParams.canvasId);
            expect(completedParams.fixedUpdateRate).equals(initialParams.fixedUpdateRate);
            expect(completedParams.backBufferAlpha).equals(initialParams.backBufferAlpha);
            expect(completedParams.scalingAlgorithm).equals(initialParams.scalingAlgorithm);

            const colorsAreEqual = initialParams.defaultCanvasColor != undefined
                && typeof initialParams.defaultCanvasColor !== "string"
                && typeof completedParams.defaultCanvasColor !== "string"
                && completedParams.defaultCanvasColor.equals(initialParams.defaultCanvasColor);

            expect(colorsAreEqual).to.be.true;
        });
    });
});
