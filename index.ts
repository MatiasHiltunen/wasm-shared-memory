import init, { SharedBuffer } from './pkg';

const BYTE_LENGTH = 8
let numElements = 100;
let buffer: SharedBuffer;
let wasmMemory: Float32Array;

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

async function run() {
  
  const wasm = await init();
  
  buffer = new SharedBuffer(numElements, window.innerWidth, window.innerHeight);
  
  buffer.fill_with_data();

  // Buffer uses byte length of 8: x, y, color, depth, T, speed, null, null
  
  const animate = () => {
    buffer.update();
    wasmMemory = new Float32Array(wasm.memory.buffer, buffer.ptr(), buffer.len());
    updateCanvasWithSharedMemory(wasmMemory);
    requestAnimationFrame(animate)
  }

  animate()

}

/* canvas.addEventListener("click", ()=>{
  buffer.free()
  buffer = new SharedBuffer(numElements++, window.innerWidth, window.innerHeight);

  buffer.fill_with_data();
  //wasmMemory = new Float32Array(wasm.memory.buffer, buffer.ptr(), buffer.len());

})
 */
let mouse: [number, number] | null = null

canvas.addEventListener("mousemove", (e)=>{
  if(mouse){
    const {clientX, clientY} = e

    mouse = [clientX, clientY]
  }
})

canvas.addEventListener("mousedown", (e)=>{
  const {clientX, clientY} = e

  mouse = [clientX, clientY]
})

canvas.addEventListener("mouseup", ()=>{
  mouse = null
})

window.addEventListener("resize", ()=>{

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  buffer.update_screen(window.innerWidth,  window.innerHeight)

})

function updateCanvasWithSharedMemory(wasmMemory: Float32Array) {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // BYTE_LENGTH of 8 is used here as Float32Array needs it to be divisble by 4
  for (let i = 0; i < wasmMemory.length; i += BYTE_LENGTH) {
    let x = wasmMemory[i];
    let y = wasmMemory[i + 1];
    const color = wasmMemory[i + 2];
    const depth = wasmMemory[i + 3];

    ctx.fillStyle = "#" + (color.toString(16)).split(".")[1];

    if(mouse){
      const d = Math.sqrt((x - mouse[0]) ** 2 + (y - mouse[1]) ** 2)

      if(d < 50){
        wasmMemory[i+5] = wasmMemory[i+5] < 0 ? wasmMemory[i+5] - 0.001 : wasmMemory[i+5] + 0.001
      }
    }

    const radius = 10 * (1 - depth);

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();

  }

}

run();