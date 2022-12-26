import {Point3d} from "./types.js";
import {projectPerspective, xRotatePoint, yRotatePoint, zRotatePoint} from "./3d.js";
import {getCanvas, getContext} from "./utils.js";

export const drawCube = (canvasId: string) => {
    let angle = 0
    const canvas = getCanvas(canvasId)
    const ctx = getContext(canvas)

    ctx.strokeStyle = "#000"
    setInterval(() => {
        ctx.clearRect(-canvas.width / 2, canvas.height / 2, 5000, -5000)
        let points = Array<Point3d>()
        points.push({x: -250, y: 250, z: -250})
        points.push({x: 250, y: 250, z: -250})
        points.push({x: 250, y: -250, z: -250})
        points.push({x: -250, y: -250, z: -250})
        points.push({x: -250, y: 250, z: 250})
        points.push({x: 250, y: 250, z: 250})
        points.push({x: 250, y: -250, z: 250})
        points.push({x: -250, y: -250, z: 250})

        /*
            Steps:
                1.- Apply rotations on each point (composition of rotations can be applied)
                2.- projectPerspective (if orthogonal perspective, projection matrix uses 1), in case we want "profundidad"
                    projection matrix must use 1 / (distance - point.z) where distance is the distance to object and point.z
                    must be either normalised or we need to apply a division to keep value between 0,1.
         */
        const projected2dPoints = points.map(p =>
            xRotatePoint(p, angle))
            .map(p => yRotatePoint(p, angle))
            .map(p => zRotatePoint(p, angle))
            .map(p => projectPerspective(p, 2))
        //.map(p => ({x: p.x * 500, y: p.y * 500, z: p.z! * 500}))
        ctx.beginPath()
        ctx.moveTo(projected2dPoints[0].x, projected2dPoints[0].y)
        ctx.lineTo(projected2dPoints[1].x, projected2dPoints[1].y)
        ctx.lineTo(projected2dPoints[2].x, projected2dPoints[2].y)
        ctx.lineTo(projected2dPoints[3].x, projected2dPoints[3].y)
        ctx.lineTo(projected2dPoints[0].x, projected2dPoints[0].y)

        ctx.moveTo(projected2dPoints[4].x, projected2dPoints[4].y)
        ctx.lineTo(projected2dPoints[5].x, projected2dPoints[5].y)
        ctx.lineTo(projected2dPoints[6].x, projected2dPoints[6].y)
        ctx.lineTo(projected2dPoints[7].x, projected2dPoints[7].y)
        ctx.lineTo(projected2dPoints[4].x, projected2dPoints[4].y)

        ctx.moveTo(projected2dPoints[0].x, projected2dPoints[0].y)
        ctx.lineTo(projected2dPoints[4].x, projected2dPoints[4].y)
        ctx.moveTo(projected2dPoints[1].x, projected2dPoints[1].y)
        ctx.lineTo(projected2dPoints[5].x, projected2dPoints[5].y)
        ctx.moveTo(projected2dPoints[2].x, projected2dPoints[2].y)
        ctx.lineTo(projected2dPoints[6].x, projected2dPoints[6].y)
        ctx.moveTo(projected2dPoints[3].x, projected2dPoints[3].y)
        ctx.lineTo(projected2dPoints[7].x, projected2dPoints[7].y)

        ctx.stroke()
        angle = (angle + 10) % 360
    }, 1000 / 30)
}