import {Point3d, Triangle2d, Triangle3d} from "./types.js";
import {
    getXRotationMatrix,
    getYRotationMatrix,
    getZRotationMatrix,
    multiplyMatrix,
    projectPerspective,
    toRad
} from "./3d.js"

export const projectMeshPerspective = (mesh: Array<Triangle3d>, distance: number): Array<Triangle3d> => mesh.map(t => projectPerspectiveTriangle(t, distance))
export const projectPerspectiveTriangle = (triangle: Triangle3d, distance: number): Triangle3d => {
    //if (!triangle.vertex1 || !triangle.vertex2 || !triangle.vertex3)
    //    debugger

    const projectedV1 = projectPerspective(triangle.vertex1, distance)
    const projectedV2 = projectPerspective(triangle.vertex2, distance)
    const projectedV3 = projectPerspective(triangle.vertex3, distance)


    return {vertex1: projectedV1, vertex2: projectedV2, vertex3: projectedV3}

}

export const xRotateMesh = (mesh: Array<Triangle3d>, angle: number) => {
    angle = toRad(angle)
    const Rx = getXRotationMatrix(angle);

    return mesh.map(triangle => rotateTriangle(triangle, Rx))
}

export const yRotateMesh = (mesh: Array<Triangle3d>, angle: number) => {
    angle = toRad(angle)
    const Ry = getYRotationMatrix(angle);

    return mesh.map(triangle => rotateTriangle(triangle, Ry))
}

export const zRotateMesh = (mesh: Array<Triangle3d>, angle: number) => {
    angle = toRad(angle)
    const Rz = getZRotationMatrix(angle);

    return mesh.map(triangle => rotateTriangle(triangle, Rz))
}

export const buildTriangle = (v1: Point3d, v2: Point3d, v3: Point3d): Triangle3d => {
    return {
        vertex1: v1,
        vertex2: v2,
        vertex3: v3
    }
}

const rotateTriangle = (triangle: Triangle3d, R: number[][]): Triangle3d => {
    const rotatedV1 = multiplyMatrix(triangle.vertex1, R)
    const rotatedV2 = multiplyMatrix(triangle.vertex2, R)
    const rotatedV3 = multiplyMatrix(triangle.vertex3, R)


    return {vertex1: rotatedV1, vertex2: rotatedV2, vertex3: rotatedV3}
}