import init, { SharedBuffer } from './pkg';

const BYTE_LENGTH = 8
let numElements = 2000;
let buffer: SharedBuffer;
let wasmMemory: Float32Array;

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

function setSize( width: number, height: number, updateStyle = false ) {



  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;

  if ( updateStyle !== false ) {

      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

  }

  ctx.scale( devicePixelRatio, devicePixelRatio );


};

setSize(window.innerWidth, window.innerHeight, true)

/* canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
 */
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

/* canvas.addEventListener("", ()=>{
  buffer.free()
  buffer = new SharedBuffer(numElements++, window.innerWidth, window.innerHeight);

  buffer.fill_with_data();
  //wasmMemory = new Float32Array(wasm.memory.buffer, buffer.ptr(), buffer.len());

}) */

let mouse: [number, number] | null = null



canvas.addEventListener("pointermove", (e) => {
  if(mouse){
    const {clientX, clientY} = e
    mouse = [clientX, clientY]
  }

})

canvas.addEventListener("touchstart", (e) => {
  if(mouse){
    const {clientX, clientY} = e.targetTouches.item(0)!
  
    mouse = [clientX, clientY]
  }

})

canvas.addEventListener("touchmove", (e) => {
  if(mouse){
    const {clientX, clientY} = e.targetTouches.item(0)!
    mouse = [clientX, clientY]
  }

})

canvas.addEventListener("pointerdown", (e)=>{
  const {clientX, clientY} = e
  mouse = [clientX, clientY]
})

canvas.addEventListener("pointerup", ()=>{
  mouse = null
})

window.addEventListener("resize", ()=>{

  setSize(window.innerWidth, window.innerHeight, true)

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
      if(d < 80){

        wasmMemory[i] = wasmMemory[i] < 200 ? wasmMemory[i] + 2 : wasmMemory[i] - 2
        wasmMemory[i+1] = wasmMemory[i+1] < 200 ? wasmMemory[i+1] + 2 : wasmMemory[i+1] - 2
      }
    }

    const radius = 10 * (1 - depth);

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();

  }

}

run();