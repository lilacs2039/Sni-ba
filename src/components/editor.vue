<script setup lang="ts">
import { ref, reactive, inject } from "vue";
import iconButton from "./iconButton.vue";
import editorSnippets from "./editorSnippets.vue";
import { EditorContext } from "../store/EditorContext";
import { editorContextKey } from "../store/keys";
import { decode } from "rison";

const editorContext = inject(editorContextKey) as EditorContext;

// const isPreview = ref(false);
// const previewCode = ref("");
// const previewRows = ref(5);
// function showPreview() {
//   isPreview.value = true;
//   previewCode.value = editorContext.publish();
// }
// function hidePreview() {
//   isPreview.value = false;
// }

// const isShare = ref(false);
// const shareLink = ref("");
// function showShare(){
//   isShare.value = true;
//   shareLink.value = decodeURI(window.location.host +'?context='+ editorContext.serialize());
//   navigator.clipboard.writeText(shareLink.value);
//   console.log(editorContext.serialize());
// }
// function hideShare() {
//   isShare.value = false;
// }

// function _download() {
//   const link:any = document.getElementById("download-link");
//   link.href = `data:application/octet-stream;charset=UTF-8,${encodeURIComponent(
//     editorContext.publish()
//   )}`;
//   link.download = editorContext.filename.value;
//   link.click();
// }

function post(){

}

</script>

<template>
  <div>
    <div class="menu">
      <!-- <iconButton
        caption="ダウンロード"
        icon="/img/download.png"
        @click="_download"
      />
      <a v-show="false" id="download-link" download="" href="">
        ファイルダウンロード用ダミーリンク</a
      >
      <iconButton
        caption="プレビュー"
        icon="/img/code.png"
        @click="showPreview"
      />
      <iconButton
        caption="共有リンク"
        icon="/img/share.png"
        @click="showShare"
      /> -->
      <iconButton
        caption="投稿"
        icon="/img/upload.png"
        @click="post"
      />
    </div>
    <editorSnippets />
  </div>
  <div class="popup" v-if="isPreview" @click="hidePreview">
    <div @click.stop="" class="popup-container">
      <textarea readonly class="preview-textarea" v-model="previewCode" ></textarea>
      <button class="popup-close" @click="hidePreview">Close</button>
    </div>
  </div>
  <div class="popup" v-if="isShare" @click="hideShare">
    <div @click.stop="" class="popup-container">
      <div class="popup-message">Copied!</div>
      <textarea readonly rows="10" class="share-textarea" v-model="shareLink" ></textarea>
      <button class="popup-close" @click="hideShare">Close</button>
    </div>
  </div>
</template>

<style>
.menu {
  display: flex;
  gap: 1px;
  margin: 5px;
}

.filename {
  flex-grow: 1;
}

.popup {
  /*　要素を重ねた時の順番　*/
  z-index: 10;

  /*　画面全体を覆う設定　*/
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);

  /*　画面の中央に要素を表示させる設定　*/
  display: flex;
  align-items: center;
  justify-content: center;
}
.popup-container {
  display: flex;
  flex-flow: column;
  z-index: 11;
  padding: 1em;
  gap: 10px;
  width: 50%;
  height: 90%;
}
.popup-message{
  /* background: #fff; */
  color: #fff;
  font-size: 1.5em;
}
.preview-textarea {
  height: 80%;
  background: #fff;
}
.popup-close {
  font-size: 3em;
}

.share-textarea {
  /* height: 80%; */
  background: #fff;
}

</style>
