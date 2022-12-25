<script setup lang="ts">
import { ref, reactive, inject } from "vue";
import iconButton from "./iconButton.vue";
import { Context } from "../store/Context";
import { editorContextKey } from "../store/keys";
// import {marked} from "marked";
import * as marked from "marked";

const editorContext = inject(editorContextKey) as Context;

const selectedIndex = ref(0);
function _select(index: number) {
  selectedIndex.value = index;
  console.log(index);
}
function _moveUp(index: number) {
  if (index <= 0 || editorContext.snippets.length + 1 <= index) {
    console.log(
      `Error moveUp : index error. index:${index}, length:${editorContext.snippets.length}`
    );
    return;
  }
  editorContext.moveSnippet(index, true);
  selectedIndex.value -= 1;
}
function _moveDown(index: number) {
  if (index < 0 || editorContext.snippets.length - 1 <= index) {
    console.log(
      `Error moveDown : index error. index:${index}, length:${editorContext.snippets.length}`
    );
    return;
  }
  editorContext.moveSnippet(index, false);
  selectedIndex.value += 1;
}

function md2html(mdstr: string) {
  return marked.marked(mdstr.replace(/\r?\n/g, "  \n"), { sanitize: true });
}
</script>

<template>
  <ul class="snippets-container">
    <li
      v-for="(snippet, index) in editorContext.snippets"
      v-bind:key="index"
      class="snippet-list"
    >
      <div class="snippet snippet-common" @click="_select(index)">
        <img class="snippet-common-icon" :src="`${snippet?.thumbnail}`" />
        <div class="snippet-common-title">{{ snippet?.title }}</div>
        <div class="edit-snippet" v-if="index == selectedIndex">
          <iconButton
            caption="上へ"
            icon="/img/arrow-up.png"
            @click.stop="_moveUp(index)"
          />
          <iconButton
            caption="下へ"
            icon="/img/arrow-down.png"
            @click.stop="_moveDown(index)"
          />
          <iconButton
            caption="削除"
            icon="/img/x-mark.png"
            @click.stop="editorContext.removeSnippet(index)"
          />
        </div>
        <div class="snippet-common-description">
          <div v-html="md2html(snippet?.description)" />
        </div>

        <code class="snippet-editor-code">
          <pre>{{ snippet?.code }}</pre>
        </code>
      </div>
    </li>
  </ul>
</template>

<style>
.snippet-editor-code {
  grid-area: code;

  /* align-items: center; */
  text-align: left;
  background-color: #ccc;
  vertical-align: middle;
  margin: 5px;
  /* padding: 5px; */
}
.snippet-editor-code-line {
  display: flex;
  align-items: center;
}
.snippet {
  display: grid;
  grid-template-columns: max-content auto max-content;
  grid-template-rows: max-content max-content auto;
  grid-template-areas:
    "icon title edit"
    "icon desc edit"
    "code code code";
}
.edit-snippet {
  grid-area: edit;
}
.code-item {
  /* margin: 5px; */
  margin: 0px;
}
</style>
