export interface Point2d {
    x: number,
    y: number
}

export interface Point3d extends Point2d{
    z?: number
}

export interface Triangle2d {
    vertex1: Point2d,
    vertex2: Point2d,
    vertex3: Point2d
}

export interface Triangle3d {
    vertex1: Point3d,
    vertex2: Point3d,
    vertex3: Point3d
}

export interface MapValueParams {
    number: number;
    in_min: number;
    in_max: number;
    out_min: number;
    out_max: number;
}
