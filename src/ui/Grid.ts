import styled from 'styled-components'

export type GridProps = {
    columns: string[],
    rows: string[],
    areas: string[][],
}
export const Grid = styled.div<GridProps>(props => `
  display: grid;
  grid-template-columns: ${props.columns.join(" ")};
  grid-template-rows: ${props.rows.join(" ")};
  grid-template-areas: ${props.areas.map(r => `'${r.join(" ")}'`).join(" ")};
  width: 100%;
  height: 100%;
`)

export type GridAreaProps = {
    name: string
}

export const GridArea = styled.div<GridAreaProps>(props => `
  grid-area: ${props.name};
  width: 100%;
  height: 100%;
`)
