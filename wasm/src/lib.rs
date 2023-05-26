use sanitize_html::rules::predefined::DEFAULT;
use sanitize_html::sanitize_str;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn sanitize_html(text: &str) -> String {
    sanitize_str(&DEFAULT, text).unwrap()
}
