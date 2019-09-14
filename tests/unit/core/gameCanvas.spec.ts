import { GameCanvas } from "../../../src/core/gameCanvas";
import { ScalingAlgorithm } from "../../../src/solo";
import { expect } from "chai";
import "mocha";
import "../../helpers/loggingHelper";

describe("GameCanvas", () =>
{
    describe("Create()", () =>
    {
        it("creates new canvas element if one doesn't exist", () =>
        {
            const id = "test";
            const existingCanvas = document.getElementById(id);
            const canvas = GameCanvas.Create("test");

            expect(existingCanvas).to.equal(null);
            expect(canvas).to.not.equal(null);
        });

        it("uses existing canvas element if one exists", () =>
        {
            const id = "test-canvas" + ((Math.random() * 1000) | 0);
            const existingCanvas = document.createElement("canvas");
            existingCanvas.id = id;

            document.body.appendChild(existingCanvas);

            const canvas = GameCanvas.Create(id);

            expect(existingCanvas.id).to.equal(canvas.id);
        });

        it("sets style.imageRendering='auto' for ScalingAlgorithm.SMOOTH", () =>
        {
            const canvas = GameCanvas.Create("test", undefined, ScalingAlgorithm.SMOOTH);

            expect(canvas.style.imageRendering).to.equal("auto");
        });

        it("sets style.imageRendering='pixelated' for ScalingAlgorithm.PIXELATED", () =>
        {
            const canvas = GameCanvas.Create("test", undefined, ScalingAlgorithm.PIXELATED);

            expect(canvas.style.imageRendering).to.equal("pixelated");
        });
    });
});
