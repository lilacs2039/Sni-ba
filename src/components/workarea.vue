<script setup lang="ts">
import { ref, reactive, inject } from "vue";
import view_area from "/src/components/view-area.vue";
// import iconButton from "./iconButton.vue";
// import { EditorContext } from "../store/EditorContext";
// import { editorContextKey } from "../store/keys";
// import { decode } from "rison";
// const editorContext = inject(editorContextKey) as EditorContext;

function post() {}
</script>

<template>
  <div>
    <!--    <div class="menu">
      <iconButton
        caption="投稿"
        icon="/img/upload.png"
        @click="post"
      />
    </div> -->
    <view_area />
  </div>
</template>

<style>
</style>
