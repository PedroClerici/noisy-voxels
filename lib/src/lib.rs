use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct ChunkGeometryBuilder {
    vertices: Vec<f32>,
    indices: Vec<u16>,
    uvs: Vec<f32>,
}

#[wasm_bindgen]
impl ChunkGeometryBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new(voxels: Box<[u8]>) -> Self {
        let (vertices, indices, uvs) = ChunkGeometryBuilder::generate_geometry(voxels);

        ChunkGeometryBuilder { vertices, indices, uvs }
    }

    fn generate_geometry(voxels: Box<[u8]>) -> (Vec<f32>, Vec<u16>, Vec<f32>) {
        let mut vertices: Vec<f32> = vec!();
        let mut indices: Vec<u16> = vec!();
        let mut uvs: Vec<f32> = vec!();

        let mut face_count: u16 = 0;
        let cube_root = (voxels.len() as f32).powf(1. / 3.).round();

        let mut add_uvs = || {
            uvs.extend_from_slice(&[
                0., 0.,
                1., 0.,
                1., 1.,
                0., 1.,
            ]);
        };

        let mut add_triangles = || {
            let current_face = face_count * 4;

            indices.extend_from_slice(&[
                current_face, current_face + 2, current_face + 1,
                current_face, current_face + 3, current_face + 2,
            ]);

            face_count += 1;
        };

        let is_voxel_air = |x: f32, y: f32, z: f32| -> bool {
            if x < 0. || y < 0. || z < 0. {
                return true;
            }

            if x >= cube_root || y >= cube_root || z >= cube_root {

                return true;
            }

            let index = x + y * cube_root + z * cube_root * cube_root;
            if voxels[index as usize] == 0 {
                return true;
            }

            return false;
        };

        for index in 0..voxels.len() {
            if voxels[index] == 0 {
                continue;
            }

            let (x, y, z) = get_voxel_coordinates(index, cube_root as usize);

            // Top
            if is_voxel_air(x, y + 1., z) {
                vertices.extend_from_slice(&[
                    x - 0.5, y + 0.5, z - 0.5,
                    x + 0.5, y + 0.5, z - 0.5,
                    x + 0.5, y + 0.5, z + 0.5,
                    x - 0.5, y + 0.5, z + 0.5,
                ]);

                add_triangles();
                add_uvs();
            }

             // East
            if is_voxel_air(x + 1., y, z) {
                vertices.extend_from_slice(&[
                    x + 0.5, y + 0.5, z + 0.5,
                    x + 0.5, y + 0.5, z - 0.5,
                    x + 0.5, y - 0.5, z - 0.5,
                    x + 0.5, y - 0.5, z + 0.5,
                ]);

                add_triangles();
                add_uvs();
            }

            // South
            if is_voxel_air(x, y, z + 1.) {
                vertices.extend_from_slice(&[
                    x - 0.5, y + 0.5, z + 0.5,
                    x + 0.5, y + 0.5, z + 0.5,
                    x + 0.5, y - 0.5, z + 0.5,
                    x - 0.5, y - 0.5, z + 0.5,
                ]);

                add_triangles();
                add_uvs();
            }

            // West
            if is_voxel_air(x - 1., y, z) {
                vertices.extend_from_slice(&[
                    x - 0.5, y + 0.5, z - 0.5,
                    x - 0.5, y + 0.5, z + 0.5,
                    x - 0.5, y - 0.5, z + 0.5,
                    x - 0.5, y - 0.5, z - 0.5,
                ]);

                add_triangles();
                add_uvs();
            }

            // North
            if is_voxel_air(x, y, z - 1.) {
                vertices.extend_from_slice(&[
                    x + 0.5, y + 0.5, z - 0.5,
                    x - 0.5, y + 0.5, z - 0.5,
                    x - 0.5, y - 0.5, z - 0.5,
                    x + 0.5, y - 0.5, z - 0.5,
                ]);

                add_triangles();
                add_uvs();
            }

            // Bottom
            if is_voxel_air(x, y - 1., z) {
                vertices.extend_from_slice(&[
                    x - 0.5, y - 0.5, z + 0.5,
                    x + 0.5, y - 0.5, z + 0.5,
                    x + 0.5, y - 0.5, z - 0.5,
                    x - 0.5, y - 0.5, z - 0.5,
                ]);

                add_triangles();
                add_uvs();
            }
        }

        (vertices, indices, uvs)
    }

    // #[wasm_bindgen(getter)]
    // pub fn vertices(&self) -> Vec<f32> {
    //     self.vertices.clone()
    // }

    // #[wasm_bindgen(getter)]
    // pub fn indices(&self) -> Vec<u16> {
    //     self.indices.clone()
    // }

    // #[wasm_bindgen(getter)]
    // pub fn uvs(&self) -> Vec<f32> {
    //     self.uvs.clone()
    // }

    // Pointer to view memory directly without copying
    #[wasm_bindgen(getter, js_name=verticesPointer)]
    pub fn vertices_ptr(&self) -> *const f32 {
        self.vertices.as_ptr()
    }

    #[wasm_bindgen(getter, js_name=verticesLength)]
    pub fn vertices_len(&self) -> usize {
        self.vertices.len()
    }

    #[wasm_bindgen(getter, js_name=indicesPointer)]
    pub fn indices_ptr(&self) -> *const u16 {
        self.indices.as_ptr()
    }

    #[wasm_bindgen(getter, js_name=indicesLength)]
    pub fn indices_len(&self) -> usize {
        self.indices.len()
    }

    #[wasm_bindgen(getter, js_name=uvsPointer)]
    pub fn uvs_ptr(&self) -> *const f32 {
        self.uvs.as_ptr()
    }

    #[wasm_bindgen(getter, js_name=uvsLength)]
    pub fn uvs_len(&self) -> usize {
        self.uvs.len()
    }
}

fn get_voxel_coordinates(index: usize, cube_root: usize) -> (f32, f32, f32) {
    let remaining = index % (cube_root * cube_root);
    let x = remaining % cube_root;
    let y = remaining / cube_root;
    let z = index / (cube_root * cube_root);
    
    (x as f32, y as f32, z as f32)
}