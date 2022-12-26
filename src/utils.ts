import {MapValueParams} from "./types";

export const getCanvas = (id: string) => document.getElementById(id) as HTMLCanvasElement

export const getContext = (canvas: HTMLCanvasElement) => canvas.getContext("2d")!

export const mapValue = (params: MapValueParams) =>
    (params.number - params.in_min) / (params.in_max - params.in_min) * (params.out_max - params.out_min) + params.out_min;


export const loadFileContent = (fileInput: HTMLInputElement, callback: CallableFunction) => {
    //debugger
    if (fileInput.type != "file" && !!fileInput.files) {
        return
    }
    const file = fileInput.files![0]
    const reader = new FileReader()

    reader.addEventListener("load", () => {
        callback(reader.result)
    })

    if (!!file){
        reader.readAsText(file)
    }

}