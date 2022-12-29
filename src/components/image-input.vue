<script setup lang="ts">
import { ref, reactive } from "vue";
import iconButton from "./iconButton.vue";

// const post_thumb_dict: {
//   [title: string]: [url: string];
// } = reactive({});

const imgUrl = ref("");
const post_thumb_mes = ref("");

const emit = defineEmits(['onChanged'])
function _emit(b64: string) {
  emit("onChanged", b64);
}

function blobToBase64(blob: Blob):Promise<string>  {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}
function setImage(blob: Blob, mes: string = "") {
  if (blob == null) {
    imgUrl.value = "";
    post_thumb_mes.value = mes;
    _emit("");
    return;
  }

  blobToBase64(blob).then((b64) => {
    imgUrl.value = URL.createObjectURL(blob);
    post_thumb_mes.value = mes;
    _emit(b64);
  });
}

function paste_image() {
  post_thumb_mes.value = "";

  navigator.clipboard
    .read()
    .then((clipItems: ClipboardItems) => {
      const clipItem = clipItems[0];
      const type = clipItem.types.filter((s) => s.startsWith("image/"))[0]; // ex. "image/png"
      if (type == undefined) {
        setImage(null, "Image not found in clipboard.");
        console.log(clipItem);
        return;
      }

      clipItem.getType(type).then((blob: Blob) => {
        setImage(
          blob,
          `Type : ${type},  Size : ${Math.round(blob.size / 1000)}kB`
        );
      });
    })
    .catch((e) => {
      if (e instanceof DOMException) {
        post_thumb_mes.value = e.message;
      } else console.log(e);
    });
}
</script>

<template >
  <div>
    <div class="image-input-container">
      <button class="thumbnail-button shadow" @click="paste_image">
        Paste Image from clipboard
      </button>
      <iconButton
        caption="クリア"
        icon="/img/clear.png"
        @click="setImage(null, '')"
      />
    </div>
    <div class="post-input">
      <div>{{ post_thumb_mes }}</div>
      <img class="post-thumbnail-img" :src="imgUrl" />
    </div>
  </div>
</template>

<style>
.image-input-container {
  display: flex;
  gap: 10px;
}
</style>
