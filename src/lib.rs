mod utils;

use rand::{
    rngs::{self, SmallRng},
    thread_rng, Rng, SeedableRng,
};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct SharedBuffer {
    ptr: *mut f32,
    len: usize,
    width: usize,
    height: usize,
}

const LEN: u8 = 8;

#[wasm_bindgen]
impl SharedBuffer {
    #[wasm_bindgen(constructor)]
    pub fn new(num_elements: usize, width: usize, height: usize) -> SharedBuffer {
        // Jokainen elementti koostuu 8 f32-arvosta: x, y, color, depth, T, speed, null, null
        let size = num_elements * LEN as usize;
        let buffer = vec![0f32; size].into_boxed_slice();
        let ptr = buffer.as_ptr() as *mut f32;
        let len = buffer.len();

        std::mem::forget(buffer); // Estetään Rustia vapauttamasta muistia
        SharedBuffer {
            ptr,
            len,
            width,
            height,
        }
    }

    pub fn ptr(&self) -> *mut f32 {
        self.ptr
    }

    pub fn len(&self) -> usize {
        self.len
    }


    pub fn fill_with_data(&self) {
        let mut rng = thread_rng();
  

        let num_elements = self.len / LEN as usize;
        unsafe {
            let mut rngs: Vec<SmallRng> = (0..5)
                .map(|_| SmallRng::from_rng(&mut rng).unwrap())
                .collect();
            for i in 0..num_elements {
                let base = i * LEN as usize;
         
                *self.ptr.add(base) = rngs[0].gen::<f32>() * (self.width as f32); // x
                *self.ptr.add(base + 1) = rngs[1].gen::<f32>() * (self.height as f32); // y
                *self.ptr.add(base + 2) = rngs[2].gen::<f32>(); // color
                *self.ptr.add(base + 3) = ((i % 100) as f32) / 100.0; // depth
                *self.ptr.add(base + 4) = rngs[3].gen::<f32>() * 20.0; // T
                *self.ptr.add(base + 5) = (rngs[4].gen::<f32>() - 0.5) * 0.01; // Speed
            }
        }
    }

    pub fn update(&self) {
        let num_elements = self.len / LEN as usize;

        let a = (&self.width / 2) as f32;
        let b = (&self.height / 2) as f32;

        unsafe {
            for i in 0..num_elements {
                let base = i * LEN as usize;

                let direction = *self.ptr.add(base + 4);
                let x = *self.ptr.add(base);
                let y = *self.ptr.add(base + 1);

                let r = ((x - a).powf(2.0) + (y - b).powf(2.0)).sqrt();

                *self.ptr.add(base) = a + r * direction.cos(); // x
                *self.ptr.add(base + 1) = b + r * direction.sin(); // y
                *self.ptr.add(base + 4) = direction + *self.ptr.add(base + 5) // T + Speed
            }
        }
    }

    pub fn update_screen(&mut self, width: usize, height: usize) {

        self.width = width;
        self.height = height;

        self.fill_with_data();

    }
}

impl Drop for SharedBuffer {
    fn drop(&mut self) {
        unsafe {
            let _ = Vec::from_raw_parts(self.ptr, self.len, self.len);
        }
    }
}
