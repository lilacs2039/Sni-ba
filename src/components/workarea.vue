<script setup lang="ts">
import { ref, reactive, inject } from "vue";
import view_area from "/src/components/view-area.vue";
import post_area from "/src/components/post-area.vue";
import iconButton from "/src/components/iconButton.vue";
// import { EditorContext } from "../store/EditorContext";
// import { editorContextKey } from "../store/keys";
// import { decode } from "rison";
// const editorContext = inject(editorContextKey) as EditorContext;

var showViewArea = ref(true);

function switchShow() {
  showViewArea.value = !showViewArea.value;
  console.log(showViewArea)
}
</script>

<template>
  <div class="workarea">
    <div class="menu">
      <iconButton caption="投稿" icon="/img/upload.png" @click="switchShow" />
    </div>
    <view_area v-show="showViewArea" />
    <post_area v-show="!showViewArea" />
  </div>
</template>

<style>

.menu {
  display: flex;
}


</style>


