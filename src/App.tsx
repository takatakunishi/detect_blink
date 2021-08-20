import { useRef, useState, useEffect } from 'react'
import Camera, { isVideoAlive } from './ui/camera'
import WebCam from "react-webcam"
import { loadFacemesh, loadFaceLandmark } from './util/face_detection'
import VideoSelectorComponent, { DevicesType } from './util/selectVideoDevice'
import { relative } from 'path'
import { Grid, GridArea } from './ui/Grid'

function App() {
  const [selectedDevice, setDevice] = useState("")
  const [videoDeviceDatas, setVideoDeviceDatas] = useState<DevicesType[]>([])
  const canvasReference = useRef<HTMLCanvasElement>(null)
  const webcameraReference = useRef<WebCam>(null)

  useEffect(() => {
    let unmounted = false
    const getVideoDeviceDatas = async () => {
      const devices = (await navigator.mediaDevices.enumerateDevices()).filter((device) => device.kind === "videoinput")
      if (!unmounted) {
        const temp = devices.map((deviceData) => {
          return {
            deviceId: deviceData.deviceId,
            deviceName: deviceData.label
          }
        })
        setVideoDeviceDatas(temp)
        console.log(videoDeviceDatas)
      }
    }
    getVideoDeviceDatas()
    console.log("throw getVideoDeviceDatas")

    loadFaceLandmark(webcameraReference, canvasReference)
    // loadFacemesh(webcameraReference, canvasReference)
    const cleanup = () => {
      unmounted = true
    }
    return cleanup
  }, [])


  return (
    <div className="App">
      <Grid
        columns={["200px", "1000px"]}
        rows={[
          "40px",
          "710px"
        ]}
        areas={[
          ["video-select-title", "video"],
          ["video-selector", "video"]
        ]}
      >
        <GridArea name="video-select-title">
          <div>カメラ検知</div>
        </GridArea>
        <GridArea name="video">
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "auto"
            }}>
            {selectedDevice !== "" ? <Camera
              height={750}
              width={1000}
              cameraRef={webcameraReference}
              videoId={selectedDevice}
            /> : <div />
            }
            <canvas
              ref={canvasReference}
              height={750} width={1000}
              style={{
                position: "absolute",
                marginLeft: "auto",
                marginRight: "auto",
                left: 0,
                right: 0,
                textAlign: "center",
                zIndex: 10,
                width: 1000,
                height: 750
              }}
            />
          </div>
        </GridArea>
        <GridArea name="video-selector">
          <VideoSelectorComponent
            selectedDevice={selectedDevice}
            devices={videoDeviceDatas}
            componentStyle={{ height: 400, width: 200 }}
            setDeviceHandler={setDevice}
          />
        </GridArea>
      </Grid>
    </div >
  );
}

export default App;
