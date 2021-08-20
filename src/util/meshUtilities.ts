import * as facemesh from '@tensorflow-models/facemesh'
import { traingulationMatrices } from './traingulationMatrices'
import { drawPath } from './face_detection'
import { Coords3D } from "@tensorflow-models/facemesh/dist/util"
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection'

export const drawMesh = (predictions: facemesh.AnnotatedPrediction[], canvasRef: React.RefObject<HTMLCanvasElement>) => {
    if (predictions.length > 0) {
        predictions.forEach((prediction) => {
            const keypoints = prediction.scaledMesh as Coords3D

            for (let i = 0; i < traingulationMatrices.length / 3; i++) {
                const points: number[][] = [
                    traingulationMatrices[i * 3],
                    traingulationMatrices[i * 3 + 1],
                    traingulationMatrices[i * 3 + 2],
                ].map((index) => keypoints[index])
                drawPath(canvasRef, points, true)
            }
            const context = canvasRef.current
            if (context !== null) {
                const ctx = context.getContext("2d")
                if (ctx !== null) {
                    for (let i = 0; i > keypoints.length; i++) {
                        const x = keypoints[i][0]
                        const y = keypoints[i][1]

                        ctx.beginPath()
                        ctx.arc(x, y, 1, 0, 3 * Math.PI)
                        ctx.fillStyle = "aqua"
                        ctx.fill()
                    }
                }
            }
        })
    }
}

export const drawFaceLandmark = (predictions: faceLandmarksDetection.FaceLandmarksPrediction[], canvasRef: React.RefObject<HTMLCanvasElement>) => {
    if (predictions.length > 0) {
        predictions.forEach((prediction) => {
            const keypoints = prediction.mesh as Coords3D

            for (let i = 0; i < traingulationMatrices.length / 3; i++) {
                const points: number[][] = [
                    traingulationMatrices[i * 3],
                    traingulationMatrices[i * 3 + 1],
                    traingulationMatrices[i * 3 + 2],
                ].map((index) => keypoints[index])
                drawPath(canvasRef, points, true)
            }
            const context = canvasRef.current
            if (context !== null) {
                const ctx = context.getContext("2d")
                if (ctx !== null) {
                    for (let i = 0; i > keypoints.length; i++) {
                        const x = keypoints[i][0]
                        const y = keypoints[i][1]

                        ctx.beginPath()
                        ctx.arc(x, y, 1, 0, 3 * Math.PI)
                        ctx.fillStyle = "aqua"
                        ctx.fill()
                    }
                }
            }
        })
    }
}