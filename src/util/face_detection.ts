import React from "react"
import WebCam from "react-webcam"
import "@tensorflow/tfjs"
import * as facemesh from '@tensorflow-models/facemesh'
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection'
import { Coords3D, Coord2D } from "@tensorflow-models/facemesh/dist/util"
import { drawMesh, drawFaceLandmark } from "./meshUtilities"

// const sleep = (ms: number) => {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

// const webcam = useRef<WebCam>(null)

// export const useFaceDetect = async () => {
//     const model = await facemesh.load()
//     detect(model)
// }

var blinkCount = 0
const blinked = () => {
    blinkCount++
}
var isBeforeOpenEye = true

type AnnotationType = {
    /** Probability of the face detection. */
    faceInViewConfidence: number;
    boundingBox: {
        /** The upper left-hand corner of the face. */
        topLeft: Coord2D;
        /** The lower right-hand corner of the face. */
        bottomRight: Coord2D;
    };
    /** Facial landmark coordinates. */
    mesh: Coords3D;
    /** Facial landmark coordinates normalized to input dimensions. */
    scaledMesh: Coords3D;
    /** Annotated keypoints. */
    annotations?: {
        [key: string]: Coords3D;
    };
}

export const loadFacemesh = async (
    videoRef: React.RefObject<WebCam>,
    canvasRef: React.RefObject<HTMLCanvasElement>
) => {
    console.log("loadFacemesh")
    const network = await facemesh.load()
    console.log("network loaded")
    setInterval(() => {
        detectFace(network, videoRef, canvasRef)
    }, 100)
}

export const loadFaceLandmark = async (
    videoRef: React.RefObject<WebCam>,
    canvasRef: React.RefObject<HTMLCanvasElement>
) => {
    // console.log("loadFacemesh")
    const network = await faceLandmarksDetection.load(
        faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
    )
    // console.log("network loaded")
    setInterval(() => {
        detectFaceLandmark(network, videoRef, canvasRef)
    }, 100)
}

const detectFaceLandmark = async (
    network: faceLandmarksDetection.FaceLandmarksPackage,
    videoRef: React.RefObject<WebCam>,
    canvasRef: React.RefObject<HTMLCanvasElement>
) => {
    // console.log("detectFace start")
    if (
        typeof videoRef.current !== "undefined" &&
        videoRef.current !== null &&
        videoRef.current.video?.readyState === 4
    ) {
        // console.log("detectFace video in")
        const video = videoRef.current.video
        const videoWidth = videoRef.current.video.videoWidth;
        const videoHeight = videoRef.current.video.videoHeight;
        if (videoWidth === 0 || videoHeight === 0) {
            return
        }

        // Set video width
        // videoRef.current.video.width = videoWidth;
        // videoRef.current.video.height = videoHeight;

        // Set canvas width
        canvasRef.current!.width = videoWidth;
        canvasRef.current!.height = videoHeight;


        const faceEstimate = await network.estimateFaces({ input: video })
        // console.log("faceEstimate");

        // console.log(faceEstimate)

        const mainface = faceEstimate[0] as any
        // const mainface



        if (mainface) {
            if ("annotations" in mainface) {
                // console.log(mainface.annotations.leftEyeUpper0.reverse)
                const lefteye = mainface.annotations.leftEyeUpper0
                const temp = mainface.annotations.leftEyeLower0.reverse()
                drawPath(canvasRef, lefteye.concat(temp), true)
                const difFace = mainface.scaledMesh[6][1] - mainface.scaledMesh[2][1]
                const difEye = mainface.scaledMesh[386][1] - mainface.scaledMesh[374][1]
                // console.log("difference:", difFace)
                // console.log("difference eye:", difEye)
                console.log("difference eye level:", difEye / difFace)
                if (difEye / difFace < (0.16) * 0.7 && isBeforeOpenEye) {
                    isBeforeOpenEye = false
                    blinked()
                    console.log("blink count", blinkCount)
                } else if (difEye / difFace > (0.16) * 0.7 && !isBeforeOpenEye) {
                    isBeforeOpenEye = true
                }
                console.log((await navigator.mediaDevices.enumerateDevices()).filter((device) => device.kind === "videoinput"))

            }
        }

    }


    // drawFaceLandmark(faceEstimate, canvasRef)
}


const detectFace = async (
    network: facemesh.FaceMesh,
    videoRef: React.RefObject<WebCam>,
    canvasRef: React.RefObject<HTMLCanvasElement>
) => {
    console.log("detectFace start")
    if (
        typeof videoRef.current !== "undefined" &&
        videoRef.current !== null &&
        videoRef.current.video?.readyState === 4
    ) {
        console.log("detectFace video in")
        const video = videoRef.current.video
        const videoWidth = videoRef.current.video.videoWidth;
        const videoHeight = videoRef.current.video.videoHeight;

        // Set video width
        // videoRef.current.video.width = videoWidth;
        // videoRef.current.video.height = videoHeight;

        // Set canvas width
        canvasRef.current!.width = videoWidth;
        canvasRef.current!.height = videoHeight;


        const faceEstimate = await network.estimateFaces(video)
        console.log("faceEstimate");

        console.log(faceEstimate)

        const mainface = faceEstimate[0] as any
        // const mainface
        console.log(mainface.annotations.leftEyeUpper0.reverse)
        const lefteye = mainface.annotations.leftEyeUpper0
        const temp = mainface.annotations.leftEyeLower0.reverse()


        drawPath(canvasRef, lefteye.concat(temp), true)

        // drawMesh(faceEstimate, canvasRef)
    }
}


export const drawPath = (
    canvasRef: React.RefObject<HTMLCanvasElement>,
    points: number[][],
    closePath: boolean
) => {
    const region = new Path2D()
    // console.log(points)

    region.moveTo(points[0][0], points[0][1])
    for (let i = 0; i < points.length; i++) {
        const point = points[i]
        region.lineTo(point[0], point[1])
    }

    if (closePath) {
        region.closePath()
    }

    const context = canvasRef.current
    if (context !== null) {
        const ctx = context.getContext("2d")
        if (ctx !== null) {
            ctx.strokeStyle = "grey"
            ctx.stroke(region)
        }
    }
}

// const detect = async (model: facemesh.FaceMesh) => {
//     console.log("detect");
//     const flag = false
//     if (!webcam.current) {
//         console.log("!webcam.current || !canvas.current");
//         return
//     }

//     var webcamCurrent = webcam.current
//     while (webcamCurrent === null || webcam.current.video?.readyState !== 4) {
//         await sleep(5000)
//         webcamCurrent = webcam.current
//         console.log("reload");
//         console.log(webcamCurrent);

//     }

//     const video = webcam.current.video as HTMLVideoElement

//     const predictions = await model.estimateFaces(video)
//     console.log("video loaded");
//     if (predictions.length > 0) {
//         for (let i = 0; i < predictions.length; i++) {
//             const keypoints = predictions[i].scaledMesh as Coords3D

//             // Log facial keypoints.
//             // for (let j = 0; j < keypoints.length; j++) {
//             //   const [x, y, z] = keypoints[j];

//             //   console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`);
//             // }
//             const righteye = [keypoints[159][0], keypoints[159][1], keypoints[145][0], keypoints[145][1]]
//             const lefteye = [keypoints[386][0], keypoints[386][1], keypoints[374][0], keypoints[374][1]]
//             const rightDif = (righteye[3] - righteye[1]) * 100
//             const leftDif = (lefteye[3] - lefteye[1]) * 100
//             console.log(predictions);

//             console.log(`right:${rightDif} + left:${leftDif} + ${rightDif < 10}`)
//             // console.log(righteye);
//             // console.log("left:");
//             // console.log(lefteye);
//         }
//     }
//     detect(model)
// }
