import init, { SharedBuffer } from './pkg';

const BYTE_LENGTH = 8
const numElements = 2000;
let buffer: SharedBuffer;

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

async function run() {
  
  const wasm = await init();
  
  buffer = new SharedBuffer(numElements, window.innerWidth, window.innerHeight);
  
  buffer.fill_with_data();

  // Buffer uses byte length of 8: x, y, color, depth, T, speed, null, null
  const wasmMemory = new Float32Array(wasm.memory.buffer, buffer.ptr(), buffer.len());
  
  const animate = () => {
    buffer.update();
    updateCanvasWithSharedMemory(wasmMemory);
    requestAnimationFrame(animate)
  }

  animate()

}


window.addEventListener("resize", ()=>{

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  buffer.resize(window.innerWidth,  window.innerHeight)

})

function updateCanvasWithSharedMemory(wasmMemory: Float32Array) {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // BYTE_LENGTH of 8 is used here as Float32Array needs it to be divisble by 4
  for (let i = 0; i < wasmMemory.length; i += BYTE_LENGTH) {
    const x = wasmMemory[i];
    const y = wasmMemory[i + 1];
    const color = wasmMemory[i + 2];
    const depth = wasmMemory[i + 3];

    ctx.fillStyle = "#" + (color.toString(16)).split(".")[1];

    const radius = 10 * (1 - depth);

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();

  }

}

run();