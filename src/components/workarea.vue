<script setup lang="ts">
import { ref, reactive, inject } from "vue";
import view_area from "/src/components/view-area.vue";
import post_area from "/src/components/post-area.vue";
import iconButton from "/src/components/iconButton.vue";
import iconTextButton from "./iconTextButton.vue";
import { langStrKey } from "../store/keys";
// import { EditorContext } from "../store/EditorContext";
// import { editorContextKey } from "../store/keys";
// import { decode } from "rison";
// const editorContext = inject(editorContextKey) as EditorContext;

const langStr = inject(langStrKey);
const user = "lilacs2039";

var showViewArea = ref(true);
function showView() {
  showViewArea.value = true;
}
function showPost() {
  showViewArea.value = false;
}
function newLang() {
  // GitHubのページへジャンプ
  window.open(
    `https://github.com/${user}/Sni-ba-snippets/new/main`,
    "_blank",
    "noreferrer"
  );
}
</script>

<template>
  <div class="workarea">
    <div class="menu">
      <icon-text-button
        text="View"
        icon="/img/side-right-view.png"
        @click="showView"
      />
      <icon-text-button
        text="Post..."
        icon="/img/upload.png"
        @click="showPost"
      />
      <icon-text-button
        text="New lang..."
        icon="/img/blank-file.png"
        @click="newLang"
      />
    </div>
    <view_area v-show="showViewArea" />
    <post_area v-show="!showViewArea" />
  </div>
</template>

<style>
.menu {
  display: flex;
  gap: 10px;
}
</style>


