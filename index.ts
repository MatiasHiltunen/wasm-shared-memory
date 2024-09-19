import { it } from 'node:test';
import init, { SharedBuffer} from './pkg/wasm_test_rust.js';

interface Point {
  x: number,
  y: number,
  color: number,
  depth: number
}

async function run() {

  const wasm = await init();

  const memory = wasm.memory

  const numElements = 50000;

  // Luodaan uusi SharedBuffer
  const buffer = new SharedBuffer(numElements, window.innerWidth, window.innerHeight);

  // Täytetään puskuri datalla Rustin puolella
  buffer.fill_with_data();

  // Luodaan Float32Array, joka osoittaa suoraan WebAssemblyn muistiin
  const wasmMemory = new Float32Array(memory.buffer, buffer.ptr(), buffer.len());

  // Binaaridata -> js 
  const data: Point[] = [];
  for (let i = 0; i < wasmMemory.length; i += 4) {
    const x = wasmMemory[i];
    const y = wasmMemory[i + 1];
    const color = wasmMemory[i + 2];
    const depth = wasmMemory[i + 3];
    data.push({ x, y, color, depth });
  }


  renderCanvas(data);
}

function renderCanvas(data) {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;

  // Asetetaan canvaksen koko
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Tyhjennetään canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Renderöidään jokainen piste
  data.forEach(item => {
    // Asetetaan väri f32 -> hex -> 0.eeffee -> #eeffee
    ctx.fillStyle = "#" + item.color.toString(16).split(".").at(1);

    // Piirretään ympyrä
    const radius = 5 * (1 - item.depth); // "Syvyys"

    ctx.beginPath();
    ctx.arc(item.x, item.y, radius, 0, 2 * Math.PI);
    ctx.fill();
  });
}

run();