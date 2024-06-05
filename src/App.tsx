import { useRef, useState } from "react"

/**
 * use standard HTML and click event to draw the grid, colours etc ... 
 * once finished export the data to a 16x16 canvas and export as PNG
 */

function App() {

  const GRID_SIZE: number = 16;

  const [colours, setColours] = useState<string[]>([]);
  const colourPicker = useRef<HTMLInputElement>(null);
  const [pixels, setPixels] = useState<string[][]>(new Array(GRID_SIZE).fill("#000000").map(() => new Array(GRID_SIZE).fill("#000000")));
  

  const onPixelClicked = (x:number, y:number) => {

    const selectedColour : string = colourPicker.current?.value as string;

    const nextPixels = pixels.map((_x, _xi) => {
      return _x.map((_y, _yi) => {
        if(_xi === x && _yi === y) {
          return selectedColour;
        }
        return _y;
      });
    })

    setPixels(nextPixels);

    if(colours.indexOf(selectedColour) == -1) {
      setColours((current) => [...current, selectedColour]);
    }

  }

  const onColourClicked = (colourHex:string) => {
    //set colour picker value. 
  }

  return (
    <div>

      <div style={{display:'flex', flexDirection:'column'}}>
        <input ref={colourPicker} type="color" />

        <div style={{display:'flex', flexDirection: 'row', height:50}}>
          {colours.map(colour => <div onClick={() => {onColourClicked(colour)}} style={{width:50, height:50,marginRight:8, background: colour}}></div> )}
        </div>

      </div>



      <div style={{display: 'flex', flexDirection:'column', margin:16}}>

        {pixels.map((px, pxi) => {

          return (
            <div style={{display:"flex", flexDirection: "row"}} key={`row_${pxi}`}>
              {px.map((py, pyi) => {
                return <div key={`pixel_${pxi}_${pyi}`} onClick={() => onPixelClicked(pxi, pyi)} style={{width:'50px', height:'50px', marginRight: '8px', marginBottom:'8px', border:"1px solid black",  background: py}}></div>
              })}
            </div>
          )
        })}

      </div>
    </div>
  )
}

export default App
