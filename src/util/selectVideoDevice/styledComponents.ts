import styled from "styled-components"

type WrapperProps = {
    height: number,
    width: number
}
export const Wrapper = styled.div<WrapperProps>(props => `
    width:${props.width}px;
    height:${props.height}px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: red;
`)

export const Label = styled.label`
    width: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    font-size: 18px;
`

export const RadioList = styled.input.attrs({ type: 'radio' })`
    width: auto;
    height: auto;
    display: flex;
    flex-direction: column;
`