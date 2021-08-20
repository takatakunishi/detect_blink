import { Wrapper, Label, RadioList } from "./styledComponents"

type VideoSelectorComponentProps = {
    devices: DevicesType[],
    selectedDevice: string,
    componentStyle: {
        height: number,
        width: number
    },
    setDeviceHandler: React.Dispatch<React.SetStateAction<string>>
}
export type DevicesType = {
    deviceName: string,
    deviceId: string
}

const RadioBox = (deviceDatas: DevicesType[], setDeviceHandler: React.Dispatch<React.SetStateAction<string>>, selectedDevice: string) => {
    console.log(deviceDatas)

    if (deviceDatas.length > 0) {
        return deviceDatas.map((deviceData) => {
            return <Label>
                <RadioList
                    className="video_device_select_box"
                    checked={deviceData.deviceId === selectedDevice}
                    onChange={() => {
                        console.log("select device")

                        setDeviceHandler(deviceData.deviceId)
                    }}
                />
                {deviceData.deviceName}
            </Label>
        })
    } else {
        return <div>no videos</div>
    }
}

const VideoSelectorComponent: React.FC<VideoSelectorComponentProps> = (props) => {
    const devices = props.devices
    const { height, width } = { ...props.componentStyle }
    return <Wrapper height={height} width={width}>
        {RadioBox(devices, props.setDeviceHandler, props.selectedDevice)}
    </Wrapper>
}

export default VideoSelectorComponent