import { useState, useCallback, useEffect } from "react"
import WebCam from "react-webcam"

type CameraProps = {
    height: number,
    width: number,
    cameraRef: React.RefObject<WebCam>,
    videoId: string
}

export const isVideoAlive = (videoRef: React.RefObject<WebCam>): boolean => {
    if (
        typeof videoRef.current !== "undefined" &&
        videoRef.current !== null &&
        videoRef.current.video?.readyState === 4
    ) {
        return true
    } else {
        return false
    }
}
const Camera: React.FC<CameraProps> = (props) => {
    const [deviceId, setDeviceId] = useState({})
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([])

    const handleDevices = useCallback(
        (mediaDevices: MediaDeviceInfo[]) => setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
        [setDevices]
    )

    useEffect(
        () => {
            navigator.mediaDevices.enumerateDevices().then(handleDevices)
            setDeviceId(props.videoId)
            console.log("loading camera")
        },
        []
    )
    return <div>
        <div>
            <WebCam
                height={props.height}
                width={props.width}
                ref={props.cameraRef}
                style={{
                    position: "absolute",
                    marginLeft: "auto",
                    marginRight: "auto",
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    zIndex: 9
                }}
                videoConstraints={{ deviceId: props.videoId }}
            /></div>

        {/* {devices.map((device, key) => (
            <div>
                <WebCam audio={false} videoConstraints={{ deviceId: device.deviceId }} />
                {device.label || `Device ${key + 1}`}
            </div>

        ))} */}
        {/* <div>
            {devices.map((device, key) => {
                // <div>
                //     <WebCam audio={false} videoConstraints={{ deviceId: device.deviceId }} />
                //     {device.label || `Device ${key + 1}`}
                // </div>
                return <label>
                    <input type="radio" id={"camera" + key} name="camera_dev" value={device.deviceId} />
                    {device.deviceId}
                </label>

            })}
        </div> */}
    </div>
}

export default Camera