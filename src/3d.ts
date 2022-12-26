import {Point2d, Point3d} from "./types.js";
import {getCanvas} from "./utils.js";

export const toRad = (degrees: number): number => degrees * Math.PI / 180


export const xRotatePoint = (point: Point3d, angle: number) : Point3d => {
    angle = toRad(angle)
    const Rx = getXRotationMatrix(angle)

    return multiplyMatrix(point, Rx)
}

export const yRotatePoint = (point: Point3d, angle: number): Point3d => {
    angle = toRad(angle)
    const Ry = getYRotationMatrix(angle)

    return multiplyMatrix(point, Ry)
}

export const zRotatePoint = (point: Point3d, angle: number): Point3d => {
    angle = toRad(angle)
    const Rz = getZRotationMatrix(angle)

    return multiplyMatrix(point, Rz)
}

export const project3Dto2D = (point: Point3d): Point2d => {
    /*
    Projects a 3d point to 2d without perspective
     */
    const projection = [
        [1, 0, 0],
        [0, 1, 0]
    ]

    return calculate3dTo2dPointProjection(point, projection)
}

export const projectPerspective = (point: Point3d, distance: number): Point2d => {

    //const z = 1 / (distance - (point.z! / getCanvas("terrain").height))
    const z = 1 / (distance - (point.z! / getCanvas("terrain").height))
    const projection = [
        [z, 0, 0],
        [0, z, 0]
    ]

    return calculate3dTo2dPointProjection(point, projection)
}

const calculate3dTo2dPointProjection = (point: Point3d, projection: number[][]): Point2d => {
    const projectedX = projection[0][0] * point.x + projection[0][1] * point.y + projection[0][2] * point.z!
    const projectedY = projection[1][0] * point.x + projection[1][1] * point.y + projection[1][2] * point.z!

    return {x: projectedX, y: projectedY}
}

export const multiplyMatrix = (point: Point3d, matrixAngle: number[][]): Point3d => {
    const rotatedPoint = new Array<number>()
    matrixAngle.forEach(row => {
        if (!point) {
            return
        }
        rotatedPoint.push(row[0] * point.x + row[1] * point.y + row[2] * point.z!)
    })
    return {x: rotatedPoint[0], y: rotatedPoint[1], z: rotatedPoint[2]}
}


export const getXRotationMatrix = (angle: number) => {
    const Rx = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]
    Rx[0][0] = 1
    Rx[0][1] = 0
    Rx[0][2] = 0
    Rx[1][0] = 0
    Rx[1][1] = Math.cos(angle)
    Rx[1][2] = -Math.sin(angle)
    Rx[2][0] = 0
    Rx[2][1] = Math.sin(angle)
    Rx[2][2] = Math.cos(angle)
    return Rx
}

export const getYRotationMatrix = (angle: number) => {
    const Ry = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]
    Ry[0][0] = Math.cos(angle)
    Ry[0][1] = 0
    Ry[0][2] = Math.sin(angle)
    Ry[1][0] = 0
    Ry[1][1] = 1
    Ry[1][2] = 0
    Ry[2][0] = -Math.sin(angle)
    Ry[2][1] = 0
    Ry[2][2] = Math.cos(angle)
    return Ry
}

export const getZRotationMatrix = (angle: number) => {
    const Rz = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]
    Rz[0][0] = Math.cos(angle)
    Rz[0][1] = -Math.sin(angle)
    Rz[0][2] = 0
    Rz[1][0] = Math.sin(angle)
    Rz[1][1] = Math.cos(angle)
    Rz[1][2] = 0
    Rz[2][0] = 0
    Rz[2][1] = 0
    Rz[2][2] = 1
    return Rz
}
