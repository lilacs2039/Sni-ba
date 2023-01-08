<script setup lang="ts">
import { ref, reactive, inject, provide } from "vue";
import { langStrKey,  snippetDefinitionsKey } from "../store/keys";
import { SnippetDefinitions } from "../store/SnippetDefinitions";
import iconButton from "./iconButton.vue";
import iconTextButton from "./iconTextButton.vue";
import pickerSnippets from "./pickerSnippets.vue";

const langStr = inject(langStrKey) as string;
const snippetDefinitions = inject(snippetDefinitionsKey) as SnippetDefinitions;
const searchStr = ref("");

function _clear() {
  snippetDefinitions.clear();
  searchStr.value = "";
}
function _findGoogle() {
  window.open(`https://www.google.com/search?q=${langStr} ${searchStr.value}`, "_blank");
}

const user = "lilacs2039";
var showArea = ref("search"); // search/post/pin
function show(area: string) {
  showArea.value = area;
}
function newLang() {
  // GitHubのページへジャンプ
  window.open(`https://github.com/${user}/Sni-ba-snippets/new/main`, "_blank", "noreferrer");
}

// --------------------------- serach ---------------------------
var searchTaskId: number | null = null;
function fireSearch() {
  if (searchTaskId) window.clearTimeout(searchTaskId);
  searchTaskId = window.setTimeout(() => search(), 200);
}
function search() {
  snippetDefinitions.search(searchStr.value);
}
</script>

<template class="picker">
  <!-- メニュー -->
  <div class="menu">
    <icon-text-button text="View" icon="/img/side-right-view.png" @click="show('search')" />
    <!-- <icon-text-button text="Post..." icon="/img/upload.png" @click="show('post')" /> -->
    <icon-text-button text="New lang..." icon="/img/blank-file.png" @click="newLang" />
  </div>
  <post_area v-show="showArea == 'post'" />
  <!-- 検索 -->
  <div v-show="showArea == 'search'">
    <div class="search-container">
      <input type="search" class="filter-input" id="filter-snippet" placeholder="Filter..." v-model="searchStr" @keyup="fireSearch" />
      <!-- v-on:change="snippetDefinitions.search(searchStr)" -->
      <div class="search-buttons">
        <iconButton caption="Clear" icon="/img/clear.png" @click="_clear" />
        <iconButton caption="Google..." icon="img/windowlink.png" @click="_findGoogle" />
      </div>

      <div class="search-tags">
        <div class="search-tag-group" v-for="(tagGroup, i) in snippetDefinitions.tagGroups" v-bind:key="i">
          <span>{{ tagGroup.name }}：</span>
          <button
            v-for="(tagtext, index) in tagGroup.tags"
            v-bind:key="index"
            class="search-tag"
            @click="
              searchStr += ' ' + tagtext;
              snippetDefinitions.search(searchStr);
            "
          >
            {{ tagtext }}
          </button>
        </div>
      </div>
    </div>

    <pickerSnippets />
  </div>
</template>

<style>
.menu {
  display: flex;
  gap: 10px;
}
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
  max-width: 800px;
  /* margin: 5px; */
}
.filter-input {
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
.search-tag {
  height: 2em;
}
.search-tag-group {
  display: flex;
  flex-wrap: wrap;
}
</style>
