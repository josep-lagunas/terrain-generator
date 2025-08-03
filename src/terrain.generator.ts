import {Triangle3d, Point3d} from "./types.js";
import {getCanvas, getContext, mapValue} from "./utils.js";
import {noise} from "./Perlin.js";
import {buildTriangle, projectMeshPerspective, xRotateMesh, yRotateMesh, zRotateMesh} from "./3dMesh.js";
import {projectPerspective, toRad, xRotatePoint, yRotatePoint, zRotatePoint} from "./3d.js";
import {drawCube} from "./3dCube";


const TRIANGLES_COLS = 100
const TRIANGLES_ROWS = 100
const SCL = 100


export const start = () => {
    init()
    setInterval(() => {
        const mesh = buildTerrainMesh(TRIANGLES_COLS, TRIANGLES_ROWS)
        process(mesh)
    }, 30) // frames per second
}

export const startFromXYZData = (xyzFileLines: string[]) => {
    init()
    const mesh = buildMesh(xyzFileLines)
    setInterval(() => {
        process(mesh)
    }, 10) // frame
}

const canvas = getCanvas("terrain")
const axisCanvas = getCanvas("axis")
const ctx = getContext(canvas)
const axisCtx = getContext(axisCanvas)

let flying: number = 0
let angleX = -60
let angleY = 0
let angleZ = 0
let cameraDistance = 5
let cameraZAngle = 180
let moveForward = true
let flightVelocityDelta = 0.15
const isVisible = (triangle: Triangle3d) => {
    return true
    const pointIsVisible = (x: number, y: number) => x >= -canvas.width / 2 && x <= canvas.width / 2 && y >= -canvas.height / 2 && y <= canvas.height / 2

    return !pointIsVisible(triangle.vertex1.x, triangle.vertex1.y)
        && !pointIsVisible(triangle.vertex2.x, triangle.vertex2.y)
        && !pointIsVisible(triangle.vertex3.x, triangle.vertex3.y)
}

function get_terrain_points(height: number, width: number) {
    const points = Array<Point3d>()

    flying = moveForward ? flying + flightVelocityDelta: flying - flightVelocityDelta
    let yOff = flying

    for (let y = -height / 2; y < height / 2; y++) {
        yOff += 0.09
        let xOff = 0
        for (let x = -width / 2; x < width / 2; x++) {
            points.push({
                x: x * SCL, y: y * SCL, z: mapValue({
                    number: noise(xOff, yOff),
                    in_min: 0,
                    in_max: 1,
                    out_min: -200,
                    out_max: 500
                })
            })
            xOff += 0.08
        }
    }
    return points;
}

const buildTerrainMesh = (width: number, height: number): Triangle3d[] => {
    let points = get_terrain_points(height, width);
    const mesh = Array<Triangle3d>()
    points.forEach((p: Point3d, i: number) => {
        const c = i % width
        const f = Math.floor(i / width)
        if (f === height - 1 || c === width - 1) return
        let v1 = p
        let v2 = points[i + 1]
        let v3 = points[(f + 1) * width + c]
        mesh.push(buildTriangle(v1, v2, v3))
        v1 = points[i + 1]
        v2 = points[(f + 1) * width + c]
        v3 = points[(f + 1) * width + c + 1]
        mesh.push(buildTriangle(v1, v2, v3))
    })
    return mesh
}

const buildMesh = (xyzFileLines: string[]): Triangle3d[] => {

    const points = Object()
    const mesh = Array<Triangle3d>()
    xyzFileLines.forEach((line: string, i: number) => {
        const splitContent = line.split(" ")
        const type = splitContent[0]
        if (type === "v") {
            const p = {
                x: Number(splitContent[1]) * 250,
                y: Number(splitContent[2]) * 250,
                z: Number(splitContent[3]) * 250
            }
            const line = (i + 1).toString()
            points[line] = p
        } else if (type === "f") {
            const v1 = points[splitContent[1]]
            const v2 = points[splitContent[2]]
            const v3 = points[splitContent[3]]
            const triangle = buildTriangle(v1, v2, v3)
            mesh.push(triangle)
        }
    })

    return mesh
}

const buildMesh2 = (xyzFileLines: string[]): Triangle3d[] => {

    const mesh = Array<Triangle3d>()
    let v1, v2, v3
    for (let i = 0; i < xyzFileLines.length; i += 3) {
        const splitContent1 = xyzFileLines[i].split(" ")
        const splitContent2 = xyzFileLines[i + 1].split(" ")
        const splitContent3 = xyzFileLines[i + 2].split(" ")
        v1 = {
            x: Number(splitContent1[0]) * 250,
            y: Number(splitContent1[1]) * 250,
            z: Number(splitContent1[2]) * 250
        }
        v2 = {
            x: Number(splitContent2[0]) * 250,
            y: Number(splitContent2[1]) * 250,
            z: Number(splitContent2[2]) * 250
        }
        v3 = {
            x: Number(splitContent3[0]) * 250,
            y: Number(splitContent3[1]) * 250,
            z: Number(splitContent3[2]) * 250
        }
        const triangle = buildTriangle(v1, v2, v3)
        mesh.push(triangle)
    }
    return mesh
}

const process = (mesh: Triangle3d[]): void => {

    if (keys["o"]) {
        cameraDistance += 0.4
    }
    if (keys["i"])
        cameraDistance -= 0.4
    if (keys["x"] && keys["Control"]) {
        angleX = angleX % 360
        angleX -= 1
    }
    if (keys["x"] && !keys["Control"]) {
        angleX = angleX % 360
        angleX += 1
    }
    if (keys["y"] && keys["Control"]) {
        angleY = angleY % 360
        angleY -= 1
    }
    if (keys["y"] && !keys["Control"]) {
        angleY = angleY % 360
        angleY += 1
    }
    if (keys["z"] && keys["Control"] || keys["ArrowLeft"]) {
        angleZ = angleZ % 360
        angleZ -= 1
    }
    if (keys["z"] && !keys["Control"] || keys["ArrowRight"]) {
        angleZ = angleZ % 360
        angleZ += 1
    }
    if (keys["r"] || keys["ArrowUp"]) {
        moveForward = false
    }
    if (keys["f"] || keys["ArrowDown"]) {
        moveForward = true
    }
    if (keys["v"] && keys["Control"]) {
        flightVelocityDelta += 0.01
    }
    if (keys["v"] && !keys["Control"]) {
        if (flightVelocityDelta - 0.01 <=0) {
            flightVelocityDelta = 0.01
        }else {
            flightVelocityDelta -= 0.01
        }
    }
    console.log(keys)
    drawAxis(angleX, angleY, angleZ)
    cameraZAngle = (cameraZAngle + 1) % 360
    let rotatedMesh = zRotateMesh(mesh, angleZ)
    rotatedMesh = yRotateMesh(rotatedMesh, angleY)
    rotatedMesh = xRotateMesh(rotatedMesh, angleX)
    rotatedMesh = rotatedMesh.sort((a: Triangle3d, b: Triangle3d) => {
        const z1 = (a.vertex2.z! + b.vertex3.z! + a.vertex3.z!) / 3
        const z2 = (b.vertex1.z! + a.vertex1.z! + b.vertex2.z!) / 3
        return z1 - z2
    })
    let projectedMesh = projectMeshPerspective(rotatedMesh, cameraDistance)
    drawMesh(projectedMesh.filter(t => isVisible(t)))
    //cameraZAngle = (cameraZAngle + 1) % 360
}

const keys: { [key: string]: boolean; } = {}

const init = () => {
    ctx.translate(canvas.width / 2, canvas.height / 2)
    axisCtx.translate(axisCanvas.width / 2, axisCanvas.height / 2)
    window.addEventListener("mousemove", ev => {
        return
        if (ev.buttons !== 1) {
            return
        }
        angleX = mapValue({number: ev.offsetY, in_min: 0, in_max: screen.height, out_min: 0, out_max: 180})
        angleY = mapValue({number: ev.offsetX, in_min: 0, in_max: screen.width, out_min: 0, out_max: (screen.width/360)*360})
    })

    window.addEventListener("keyup", e => {
        keys[e.key] = false
    })

    window.addEventListener("keydown", e => {
        console.log(e.key)
        keys[e.key] = true
    })
}

const drawMesh = (mesh: Array<Triangle3d>) => {
    ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)

    mesh.forEach((t, i) => {
        const c = i % ((TRIANGLES_COLS - 1) * 2)
        const color = Math.floor(Math.random() * 16777215).toString(16)
        drawTriangle(ctx, t, "#" + color)
    })

}

const drawAxis = (angleX: number, angleY: number, angleZ: number): void => {
    axisCtx.clearRect(-axisCanvas.width / 2, -axisCanvas.height / 2, axisCanvas.width, axisCanvas.height)

    let center: Point3d = {x: 0, y: 0, z: 0}
    let x: Point3d = {x: 150, y: 0, z: 0}
    let y: Point3d = {x: 0, y: 150, z: 0}
    let z: Point3d = {x: 0, y: 0, z: 150}
    const fixCenterAxis = projectPerspective(center, cameraDistance)
    const fixXAxis = projectPerspective(x, cameraDistance)
    const fixYAxis = projectPerspective(y, cameraDistance)
    const fixZAxis = projectPerspective(z, cameraDistance)
    center = xRotatePoint(center, angleX)
    center = yRotatePoint(center, angleY)
    center = zRotatePoint(center, angleZ)
    x = xRotatePoint(x, angleX)
    x = yRotatePoint(x, angleY)
    x = zRotatePoint(x, angleZ)
    y = xRotatePoint(y, angleX)
    y = yRotatePoint(y, angleY)
    y = zRotatePoint(y, angleZ)
    z = xRotatePoint(z, angleX)
    z = yRotatePoint(z, angleY)
    z = zRotatePoint(z, angleZ)
    const center2d = projectPerspective(center, cameraDistance)
    const x2d = projectPerspective(x, cameraDistance)
    const y2d = projectPerspective(y, cameraDistance)
    const z2d = projectPerspective(z, cameraDistance)


    axisCtx.beginPath()
    axisCtx.strokeStyle = "red"
    axisCtx.moveTo(center.x, center.y)
    axisCtx.lineTo(x2d.x, x2d.y)
    axisCtx.fillText(`X ${angleX.toFixed(2)}°`, (x2d.x + 4), (x2d.y + 10))
    axisCtx.stroke()

    axisCtx.beginPath()
    axisCtx.strokeStyle = "blue"
    axisCtx.moveTo(center.x, center.y)
    axisCtx.lineTo(y2d.x * -1, y2d.y * -1)
    axisCtx.fillText(`Y ${angleY.toFixed(2)}°`, (y2d.x + 4) * -1, (y2d.y + 10) * -1)
    axisCtx.stroke()

    axisCtx.beginPath()
    axisCtx.strokeStyle = "green"
    axisCtx.moveTo(center.x, center.y)
    axisCtx.lineTo(z2d.x, z2d.y)
    axisCtx.fillText(`Z ${angleZ.toFixed(2)}°`, (z2d.x + 4), (z2d.y + 10))
    axisCtx.stroke()
}

const drawTriangle = (ctx: CanvasRenderingContext2D, triangle: Triangle3d, color: string): void => {
    ctx.beginPath();
    ctx.moveTo(triangle.vertex1.x * -1, triangle.vertex1.y * -1)
    ctx.lineTo(triangle.vertex2.x * -1, triangle.vertex2.y * -1)
    ctx.lineTo(triangle.vertex3.x * -1, triangle.vertex3.y * -1)
    ctx.lineTo(triangle.vertex1.x * -1, triangle.vertex1.y * -1)

    ctx.strokeStyle = "#000"
    ctx.lineWidth = 1
    ctx.fillStyle = "white"
    ctx.fill();
    ctx.stroke()
    ctx.closePath()
}

