#![no_std]
#![no_main]

pub static mut SAND: &'static mut [u8; 20] = &mut [0; 20];
static FLOW_POINTS: [u8; 10] = [0; 10];

#[no_mangle]
pub unsafe extern fn sand(size: i32) -> *const u8 {
	assert!(size < 10);
	SAND.as_ptr()
}

#[no_mangle]
pub unsafe extern fn flowPoints(size: i32) -> *const u8 {
	assert!(size < 10);
	FLOW_POINTS.as_ptr()
}


#[no_mangle]
pub unsafe extern fn stepSand()  {

	for i in 0..4 {
		let offset = i * 4;
		let age = (*SAND)[offset + 2];

		if (age - 1) <= 0 {
			(*SAND)[offset + 0] = 0;
			(*SAND)[offset + 1] = 0;
			(*SAND)[offset + 2] = 22;
		}
		else {
			(*SAND)[offset + 2] = age - 1;
		}
	}
}

#[panic_handler]
fn panic(_info: &core::panic::PanicInfo) -> ! {
	core::arch::wasm32::unreachable()
}

// #[alloc_error_handler]
// fn alloc_error(_: core::alloc::Layout) -> ! {
// 	core::arch::wasm32::unreachable()
// }
