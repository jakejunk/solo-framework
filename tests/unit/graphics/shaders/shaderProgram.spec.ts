import { expect } from "chai";
import { ShaderProgram } from "../../../../src/graphics/shaders/shaderProgram";
import { ShaderProgramParamsWithAttribute, ShaderProgramParamsWithUniform } from "../../_generators/graphics/shaders/shaderProgramParams.gen";
import "mocha";

describe("ShaderProgram", () =>
{
    describe("getAttribLocation()", () =>
    {
        it("returns location matching attribute exists", () =>
        {
            const attribute = "test";
            const value = 1;
            const params = ShaderProgramParamsWithAttribute(attribute, value);

            const program = new ShaderProgram(undefined, params);

            expect(program.getAttribLocation(attribute)).to.equal(value);
        });

        it("returns -1 if attribute doesn't exist", () =>
        {
            const attribute = "test";
            const params = ShaderProgramParamsWithAttribute(attribute, 1);

            const program = new ShaderProgram(undefined, params);

            expect(program.getAttribLocation(attribute + "!!")).to.equal(-1);
        });
    });

    describe("getUniformLocation()", () =>
    {
        it("returns location matching uniform exists", () =>
        {
            const uniform = "test";
            const value = 1;
            const params = ShaderProgramParamsWithUniform(uniform, value);

            const program = new ShaderProgram(undefined, params);

            expect(program.getUniformLocation(uniform)).to.equal(value);
        });

        it("returns undefined if attribute doesn't exist", () =>
        {
            const uniform = "test";
            const params = ShaderProgramParamsWithUniform(uniform, 1);

            const program = new ShaderProgram(undefined, params);

            expect(program.getUniformLocation(uniform + "!!")).to.be.undefined;
        });
    });
});