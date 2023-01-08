<script setup lang="ts">
import { Ref, ref, reactive, watchEffect } from "vue";
import iconButton from "./iconButton.vue";
import MedianCut from "mediancut";
import gif_wasm_init, { encode_gif } from "gifenc-rs";
import gif_wasm_module from "./assets/gifenc_rs_bg.wasm?url";
import { snippet_width } from "../Util";

// ---------------------- Interface --------------------------
const props = defineProps({
 preview: Boolean,  // converted image preview
});
const emit = defineEmits(["onChanged"]);

// ------------------------ util ------------------------

type SelSize = "Full" | "Half" | "Original";
type SelFormat = "GIF" | "Original";

gif_wasm_init(gif_wasm_module);

function objectURLToImageData(blobUrl: string, scale: number = 1): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = blobUrl;
  }).then((img) => {
    URL.revokeObjectURL(blobUrl);
    let [w, h] = [img.width, img.height];
    let canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    let ctx = canvas.getContext("2d");
    ctx?.scale(scale, scale);
    ctx.drawImage(img, 0, 0);

    return ctx.getImageData(0, 0, w * scale, h * scale); // some browsers synchronously decode image here
  });
}
function BlobToImageData(blob: Blob, scale: number = 1): Promise<ImageData> {
  let blobUrl = URL.createObjectURL(blob);
  return objectURLToImageData(blobUrl, scale);
}

function ImageDataToBlob(imageData: ImageData): Promise<Blob> {
  let canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  canvas.getContext("2d").putImageData(imageData, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(resolve, "image/svg"); // implied image/png format
  });
}

function _emit(b64: string) {
  emit("onChanged", b64);
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

// ----------------------------------- logic image ---------------------------------------
var blobOriginal: Blob | null = null;
const imgUrlOutput = ref("");
const post_thumb_mes = ref("");
const selection_size = ref("Full");
const selection_format = ref("GIF");

function paste_image() {
  post_thumb_mes.value = "";

  navigator.clipboard
    .read()
    .then((clipItems: ClipboardItems) => {
      const clipItem = clipItems[0];
      const type = clipItem.types.filter((s) => s.startsWith("image/"))[0]; // ex. "image/png"
      if (type == undefined) {
        setImage(null);
        return;
      }

      clipItem.getType(type).then((blob: Blob) => {
        setImage(blob);
      });
    })
    .catch((e) => {
      if (e instanceof DOMException) {
        post_thumb_mes.value = e.message;
      } else console.log(e);
    });
}

async function input_image(blob: Blob) {
  if(!(blob)){
    blobOriginal = null;
    post_thumb_mes.value = "";
    _emit('');
    return;
  }
  blobOriginal = blob;
  post_thumb_mes.value = blob ? "" : "Image not found in clipboard.";
}

async function convert_image() {
  if (blobOriginal == null) return;

  // リサイズ
  const widthOrig = (await BlobToImageData(blobOriginal)).width;
  const scale =
    selection_size.value == "Original" ? 1 : selection_size.value == "Full" ? snippet_width / widthOrig : selection_size.value == "Half" ? snippet_width / widthOrig / 2 : 1; // should not reach here
  var imageData = await BlobToImageData(blobOriginal, scale);

  // フォーマット変換
  var blob = new Blob();
  if (selection_format.value == "GIF") {
    // 減色
    let medianCut = new MedianCut(imageData);
    imageData = medianCut.reduce(colors.value);
    // GIF変換
    const blob1 = await ImageDataToBlob(imageData);
    const _b64 = await blobToBase64(blob1);
    const bin = window.atob(_b64.replace(/.+,/, ""));
    var buffer = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) {
      buffer[i] = bin.charCodeAt(i);
    }
    const buf: Uint8Array = encode_gif(buffer as Uint8Array);
    blob = new Blob([buf], { type: "image/gif" });
  } else {
    blob = await ImageDataToBlob(imageData);
  }

  // blobを処理
  blobToBase64(blob).then((b64) => {
    imgUrlOutput.value = URL.createObjectURL(blob);

    post_thumb_mes.value = `Type : ${blob.type},  Size : ${Math.round(blob.size / 1000)}kB, Shape : ${imageData?.width}x${imageData?.height} px`;
    _emit(b64);
  });
}

async function setImage(blobOrig: Blob) {
  await input_image(blobOrig);
  await convert_image();
}

// ------------------------------------- logic colors ---------------------------------------------
const COLORS_MAX = 256;
const COLORS_MIN = 2;
const COLORS_INIT = 16;
const colors = ref(COLORS_INIT);
function colors_up() {
  colors.value = Math.min(COLORS_MAX, colors.value * 2);
  convert_image();
}
function colors_down() {
  colors.value = Math.max(COLORS_MIN, Math.round(colors.value / 2));
  convert_image();
}
function colors_init() {
  colors.value = COLORS_INIT;
  convert_image();
}

// ------------------------------------- misc ---------------------------------------------
watchEffect(() => {
  selection_size.value;
  selection_format.value;
  convert_image();
});
</script>

<template >
  <div class="image-input">
      <div class="image-input-buttons">
        <button class="thumbnail-button shadow" @click="paste_image">Paste Image from clipboard</button>
        <iconButton caption="Clear" icon="img/clear.png" @click="setImage(null, '')" />
      </div>
      <div class="input-image-text">
        <!-- parameters -->
        <label for="size"
          >Size
          <div>
            <input type="radio" name="size" value="Original" id="size-original" v-model="selection_size" />
            <label for="size-original">Original</label>
          </div>
          <div>
            <input type="radio" name="size" value="Full" id="size-Full" checked v-model="selection_size" />
            <label for="size-Full">Full width ({{ snippet_width }}px)</label>
          </div>
          <div>
            <input type="radio" name="size" value="Half" id="size-half" v-model="selection_size" />
            <label for="size-half">Half width ({{ snippet_width / 2 }}px)</label>
          </div>
        </label>
        <label
          >Format
          <div>
            <input type="radio" name="format" value="GIF" id="format-gif" checked v-model="selection_format" />
            <label for="format-gif">GIF　　　colors</label>
            <span class="colors-container">
              <input type="number" :min="COLORS_MIN" :max="COLORS_MAX" v-model="colors" class="colors-input" />
              <button class="colors-button" @click="colors_down">＜</button>
              <button class="colors-button" @click="colors_up">＞</button>
              <button class="colors-button" @click="colors_init">〇</button>
            </span>
          </div>
          <input type="radio" name="format" value="Original" id="format-original" v-model="selection_format" />
          <label for="format-original">Original</label>
        </label>

        <!-- output -->
        <div v-if="post_thumb_mes" class="input-image-message">{{ post_thumb_mes }}</div>
        <img v-if="preview" class="" :src="imgUrlOutput" />
      </div>
    </div>
</template>

<style>
:root {
  --colors-button-height: 26px;
}
.image-input{
  margin :10px 0;
}
.image-input-buttons {
  display: flex;
  gap: 10px;
}
.radioItems {
  display: flex;
  flex-flow: column;
}
.colors-container {
  /* height:30px; */
}
.colors-button {
  /* height: var(--colors-button-height); */
  /* height:100%; */
}
.colors-input {
  width: 3em;
  height: 20px;
  /* height: var(--colors-button-height); */
  /* height:100%; */
}
.input-image-text{
  font-size: 1em;
}
.input-image-message{
  margin: 4px 0 0 0;
}
.thumbnail-button{
  flex-grow:1;
}
</style>
