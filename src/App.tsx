import { useRef, useState } from "react"

/**
 * use standard HTML and click event to draw the grid, colours etc ... 
 * once finished export the data to a 16x16 canvas and export as PNG
 */

function App() {

  const PIXEL_SIZE: number = 25;
  const GRID_SIZE: number = 16;

  const [colours, setColours] = useState<string[]>([]);
  const colourPicker = useRef<HTMLInputElement>(null);
  const [pixels, setPixels] = useState<string[][]>(new Array(GRID_SIZE).fill("#000000").map(() => new Array(GRID_SIZE).fill("#000000")));

  const exportCanvas = useRef<HTMLCanvasElement>(null);

  const onPixelClicked = (x: number, y: number) => {

    const selectedColour: string = colourPicker.current?.value as string;

    const nextPixels = pixels.map((_x, _xi) => {
      return _x.map((_y, _yi) => {
        if (_xi === x && _yi === y) {
          return selectedColour;
        }
        return _y;
      });
    })

    setPixels(nextPixels);

    if (colours.indexOf(selectedColour) == -1) {
      setColours((current) => [...current, selectedColour]);
    }

  }

  const onColourClicked = (colourHex: string) => {
    //set colour picker value. 
    if (colourPicker.current) {
      colourPicker.current.value = colourHex;
    }
  }

  const exportPNG = () => {
    if (!exportCanvas.current) {
      alert("canvas being fucky, can't export.");
      return;
    }

    var ctx = exportCanvas.current.getContext("2d");
    if (!ctx) {
      return;
    }

    for (let x = 0; x < pixels.length; x++) {
      for (let y = 0; y < pixels[x].length; y++) {
        ctx.rect(x, y, 1, 1);
        ctx.fillStyle = pixels[x][y];
        ctx.fillRect(x, y, 1, 1);
      }
    }

    var image = exportCanvas.current.toDataURL();
    var aDownloadLink = document.createElement('a');
    aDownloadLink.download = 'my_yoto_image.png';
    aDownloadLink.href = image;
    aDownloadLink.click();

  }

  return (
    <div style={{ display: "flex", flexDirection: "row", margin: 8 }}>

      <div style={{ display: 'fex', flexDirection: 'column', border: "1px solid black" }}>

        <div style={{ display: 'fex', flexDirection: 'column' }}>
          <canvas ref={exportCanvas} width={16} height={16}></canvas>
          <button style={{ display: 'block' }} onClick={() => exportPNG()}>export</button>
        </div>


        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input ref={colourPicker} type="color" />

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {colours.map(colour => <div key={colour} onClick={() => { onColourClicked(colour) }} style={{ width: PIXEL_SIZE, height: PIXEL_SIZE, marginRight: 8, background: colour }}></div>)}
          </div>

        </div>

      </div>


      <div style={{ display: 'flex', flexDirection: 'column', margin: 16 }}>

        {pixels.map((px, pxi) => {

          return (
            <div style={{ display: "flex", flexDirection: "row" }} key={`row_${pxi}`}>
              {px.map((py, pyi) => {
                return <div key={`pixel_${pxi}_${pyi}`} onClick={() => onPixelClicked(pxi, pyi)} style={{ width: PIXEL_SIZE, height: PIXEL_SIZE, marginRight: '8px', marginBottom: '8px', border: "1px solid black", background: py }}></div>
              })}
            </div>
          )
        })}

      </div>



    </div>
  )
}

export default App
