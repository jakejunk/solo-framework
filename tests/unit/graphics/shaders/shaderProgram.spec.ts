import { expect } from "chai";
import { ShaderProgram } from "../../../../src/graphics/shaders/shaderProgram";
import { ShaderProgramParamsWithAttribute, ShaderProgramParamsWithHandle, ShaderProgramParamsWithUniform, ShaderProgramParamsWithAttributes, ShaderProgramParamsWithUniforms } from "../../_generators/graphics/shaders/shaderProgramParams.gen";
import "mocha";
import { UniformLocation } from "../../../../src/graphics/shaders/shaderManager";

describe("ShaderProgram", () =>
{
    describe("getHandle()", () =>
    {
        it("returns correct value after construction", () =>
        {
            const handle = 69;
            const params = ShaderProgramParamsWithHandle(handle);

            const program = new ShaderProgram(undefined, params);

            expect(program.getHandle()).to.equal(handle);
        });
    });

    describe("getNumAttributes()", () =>
    {
        it("returns correct value after construction", () =>
        {
            const numAttributes = 15;
            const attributes: [string, number][] = [];

            for (let i = 0; i < numAttributes; ++i)
            {
                attributes.push([`attr${i}`, i]);
            }

            const params = ShaderProgramParamsWithAttributes(attributes);

            const program = new ShaderProgram(undefined, params);

            expect(program.getNumAttributes()).to.equal(numAttributes);
        });
    });

    describe("getNumUniforms()", () =>
    {
        it("returns correct value after construction", () =>
        {
            const numUniforms = 15;
            const uniforms: [string, UniformLocation][] = [];

            for (let i = 0; i < numUniforms; ++i)
            {
                uniforms.push([`uniform${i}`, i]);
            }

            const params = ShaderProgramParamsWithUniforms(uniforms);

            const program = new ShaderProgram(undefined, params);

            expect(program.getNumUniforms()).to.equal(numUniforms);
        });
    });

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