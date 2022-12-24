<script setup lang="ts">
import { ref, reactive, inject, provide } from "vue";
import { EditorContext } from "../store/EditorContext";
import { langStrKey, editorContextKey, snippetDefinitionsKey } from "../store/keys";
import { SnippetDefinitions } from "../store/SnippetDefinitions";
import iconButton from "./iconButton.vue";
import pickerSnippets from "./pickerSnippets.vue";

const langStr = inject(langStrKey) as string;
const snippetDefinitions = inject(snippetDefinitionsKey) as SnippetDefinitions;
const editorContext = inject(editorContextKey) as EditorContext;
const searchStr = ref("");

function _clear() {
  snippetDefinitions.clear();
  searchStr.value = "";
}
function _findGoogle() {
  window.open(
    `https://www.google.com/search?q=${langStr} ${searchStr.value}`,
    "_blank"
  );
}
</script>

<template class="picker">
  <div class="search-container">
    <input
      type="text"
      class="search-input"
      placeholder="検索..."
      v-model="searchStr"
      v-on:change="snippetDefinitions.search(searchStr)"
    />
    <div class="search-buttons">
      <iconButton caption="クリア" icon="/img/clear.png" @click="_clear" />
      <iconButton
        caption="ググる"
        icon="img/windowlink.png"
        @click="_findGoogle"
      />
    </div>

    <div class="search-tags">

      <div class="search-tag-group" v-for="(tagGroup, i) in snippetDefinitions.tagGroups" v-bind:key="i">
        <span class="search-tag">{{ tagGroup.name }}：</span>
        <span v-for="(tagtext, index) in tagGroup.tags" v-bind:key="index">
          <button
            class="search-tag"
            @click="
              searchStr += ' ' + tagtext;
              snippetDefinitions.search(searchStr);
            "
          >
            {{ tagtext }}
          </button>
        </span>
      </div>
    </div>

  </div>

  <pickerSnippets />
</template>

<style>
.picker {
  display: grid;
  grid-template-rows: max-content auto;
  gap: 5px;
}
.search-container {
  display: grid;
  grid-template-columns: auto min-content;
  /* grid-template-rows: max-content auto;  */
  grid-template-areas:
    "input buttons"
    "tags tags";
  /* background-color: var(--panel-bgcolor); */
  gap: 1px;
  padding: 5px;
  /* margin: 5px; */
}
.search-input {
  grid-area: input;
}
.search-buttons {
  grid-area: buttons;
  display: flex;
}
.search-tags {
  grid-area: tags;
  /* display: flex; */
  /* flex-wrap: wrap; */
}
.search-tag-group {
  display: flex;
  flex-wrap: wrap;
}
</style>
