<script setup lang="ts">
import { ref, reactive, inject } from "vue";
import { EditorContext } from "../store/EditorContext";
import { editorContextKey, snippetDefinitionsKey } from "../store/keys";
import iconButton from "./iconButton.vue";

const snippetDefinitions = inject(snippetDefinitionsKey);
const editorContext = inject(editorContextKey);
</script>

<template>
    <ul class="snippets-container">
      <template
        v-for="(item, index) in snippetDefinitions.list"
        v-bind:key="index"
      >
        <li class="snippet-list" v-show="item.visible">
          <div>
            <button
              class="picker-snippet snippet-common"
              @click="editorContext.addSnippet(item)"
            >
              <img class="snippet-common-icon" :src="`img/${item.icon}.png`" />

              <div class="snippet-common-title">{{ item.title }}</div>
              <div class="snippet-common-description">
                {{ item.description }}
              </div>
              <code class="snippet-common-code">{{ item.code }}</code>
            </button>
          </div>
        </li>
      </template>
    </ul>
</template>

<style>
.snippet-list {
  list-style: none;
}
.snippet-common {
  background-color: var(--snippet-bgcolor);
  gap: 3px;
  margin: 5px;
  width: 99%;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  border-radius: 10px;
}
.snippet-common:hover {
  background-color: var(--panel-bgcolor);
}
.snippet-common-icon {
  grid-area: icon;
  align-items: center;
  place-items: center;
  background-color: #222;
}
.snippet-common-title {
  grid-area: title;
  text-align: left;
  vertical-align: middle;
  font-weight: bold;
  font-size: 1.2em;
}
.snippet-common-code {
  grid-area: code;

  display: flex;
  align-items: center;
  text-align: left;
  background-color: #ccc;
  vertical-align: middle;
  margin: 5px;
  padding: 5px;
}
.snippet-common-description {
  grid-area: desc;
  font-size: 0.7em;
  text-align: left;
}

.snippets-container {
  background-color: var(--panel-bgcolor);
  padding: 5px;
  margin: 0px;
  overflow: scroll;
}
.picker-snippet {
  display: grid;
  /* height: 100vh; */
  grid-template-columns: min-content auto;
  grid-template-rows: max-content max-content auto;
  grid-template-areas:
    "icon title"
    "icon desc"
    "code code";
}
</style>
