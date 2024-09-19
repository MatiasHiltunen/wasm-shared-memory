mod utils;

use wasm_bindgen::prelude::*;
use rand::{rngs::{self, SmallRng}, thread_rng, Rng};

#[wasm_bindgen]
pub struct SharedBuffer {
    ptr: *mut f32,
    len: usize,
    width: usize,
    height: usize
}

#[wasm_bindgen]
impl SharedBuffer {
    #[wasm_bindgen(constructor)]
    pub fn new(num_elements: usize, width: usize, height: usize) -> SharedBuffer {
        // Jokainen elementti koostuu neljästä f32-arvosta: x, y, color, depth
        let size = num_elements * 4;
        let buffer = vec![0f32; size].into_boxed_slice();
        let ptr = buffer.as_ptr() as *mut f32;
        let len = buffer.len();
        std::mem::forget(buffer); // Estetään Rustia vapauttamasta muistia
        SharedBuffer { ptr, len, width, height }
    }

    pub fn ptr(&self) -> *mut f32 {
        self.ptr
    }

    pub fn len(&self) -> usize {
        self.len
    }

    /// Täyttää puskurin dataa muodossa [[x, y, color, depth], ...]
    pub fn fill_with_data(&self) {
        let mut rng = thread_rng();



        let num_elements = self.len / 4;
        unsafe {
            for i in 0..num_elements {
                let base = i * 4;
                // Esimerkkiarvot: x, y, color, depth
                *self.ptr.add(base) = rng.gen::<f32>() * (self.width as f32);      // x
                *self.ptr.add(base + 1) = rng.gen::<f32>() * (self.height as f32);  // y
                *self.ptr.add(base + 2) = rng.gen::<f32>();  // color
                *self.ptr.add(base + 3) = ((i % 100) as f32) / 100.0; // depth
            }
        }
    }
}

impl Drop for SharedBuffer {
    fn drop(&mut self) {
        unsafe {
            let _ = Vec::from_raw_parts(self.ptr, self.len, self.len);
        }
    }
}

