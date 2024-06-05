import { useRef, useState } from "react"

/**
 * use standard HTML and click event to draw the grid, colours etc ... 
 * once finished export the data to a 16x16 canvas and export as PNG
 */

function App() {

  const PIXEL_SIZE: number = 25;
  const GRID_SIZE: number = 16;
  const DEFAULT_COLOUR: string | null = null;

  const [colours, setColours] = useState<string[]>([]);
  const colourPicker = useRef<HTMLInputElement>(null);
  const [pixels, setPixels] = useState<string[][]>(new Array(GRID_SIZE).fill(DEFAULT_COLOUR).map(() => new Array(GRID_SIZE).fill(DEFAULT_COLOUR)));

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
        const pixel = pixels[x][y];
        console.log(pixel);
        if (pixel) {
          ctx.rect(x, y, 1, 1);
          ctx.fillStyle = pixels[x][y];
          ctx.fillRect(x, y, 1, 1);
        }
        else {
          ctx.globalAlpha = 0;
          ctx.fillRect(x, y, 1, 1);
          ctx.globalAlpha = 1;
        }
      }
    }

    var image = exportCanvas.current.toDataURL();
    var aDownloadLink = document.createElement('a');
    aDownloadLink.download = 'my_yoto_image.png';
    aDownloadLink.href = image;
    aDownloadLink.click();

  }

  const fill = () => {
    const colourHex: string = colourPicker.current?.value as string;
    setPixels(new Array(GRID_SIZE).fill(colourHex).map(() => new Array(GRID_SIZE).fill(colourHex)))
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

          <button onClick={fill}>fill</button>


          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {colours.map(colour => <div key={colour} onClick={() => { onColourClicked(colour) }} style={{ width: PIXEL_SIZE, height: PIXEL_SIZE, marginTop: 8, background: colour, border: "1px solid black", }}></div>)}
          </div>

        </div>

      </div>


      <div style={{ display: 'flex', flexDirection: 'column', margin: 16 }}>

        {pixels.map((px, pxi) => {

          return (
            <div style={{ display: "flex", flexDirection: "row" }} key={`row_${pxi}`}>
              {px.map((py, pyi) => {

                const chequered = {
                  'backgroundImage': "linear-gradient(45deg, #bbbdbf 25%, transparent 25%),linear-gradient(45deg, transparent 75%, #bbbdbf 75%),linear-gradient(45deg, transparent 75%, #bbbdbf 75%),linear-gradient(45deg, #bbbdbf 25%, #fff 25%)",
                  'backgroundSize': `${PIXEL_SIZE}px ${PIXEL_SIZE}px`,
                  'backgroundPosition': `0 0, 0 0, -${PIXEL_SIZE / 2}px -${PIXEL_SIZE / 2}px, ${PIXEL_SIZE / 2}px ${PIXEL_SIZE / 2}px`
                };

                const backgroundColour = {
                  'backgroundColor': py
                }

                const pixel_background = py ? backgroundColour : chequered;

                return <div key={`pixel_${pxi}_${pyi}`} onClick={() => onPixelClicked(pxi, pyi)} style={{ width: PIXEL_SIZE, height: PIXEL_SIZE, marginRight: '8px', marginBottom: '8px', border: "1px solid black", ...pixel_background }}></div>
              })}
            </div>
          )
        })}

      </div>



    </div>
  )
}

export default App
