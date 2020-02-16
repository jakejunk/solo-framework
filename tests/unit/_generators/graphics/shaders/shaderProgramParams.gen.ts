import { ShaderProgramParams } from "../../../../../src/graphics/shaders/shaderProgramParams";

export function ShaderProgramParamsWithAttribute(name: string, value: number): ShaderProgramParams
{
    const map = new Map<string, number>();
    map.set(name, value);

    return {
        handle: 0,
        attributeMap: map,
        uniformMap: new Map()
    };
}

export function ShaderProgramParamsWithUniform(name: string, value: number): ShaderProgramParams
{
    const map = new Map<string, number>();
    map.set(name, value);

    return {
        handle: 0,
        attributeMap: new Map(),
        uniformMap: map
    };
}