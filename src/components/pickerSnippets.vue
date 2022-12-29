<script setup lang="ts">
import { ref, reactive, inject } from "vue";
import { Context } from "../store/Context";
import { editorContextKey, snippetDefinitionsKey } from "../store/keys";
import iconButton from "./iconButton.vue";

const snippetDefinitions = inject(snippetDefinitionsKey);
const context = inject(editorContextKey);

var showSnippet = ref(null);
</script>

<template>
  <ul class="snippets-container">
    <template
      v-for="(item, index) in Object.values(snippetDefinitions.dic)"
      v-bind:key="index"
    >
      <li
        class="snippet-list"
        v-show="item.visible"
        v-on:mouseover="showSnippet = item"
        v-on:mouseleave="showSnippet = null"
      >
        <div class="snippet-operation" v-if="showSnippet == item">
          <iconButton
            class="snippet-pin-icon"
            caption="Pin"
            icon="/img/pin.png"
            @click="context.addSnippet(item)"
          />
        </div>
        <div class="picker-snippet snippet">
          <div class="snippet-title-container">
            <div class="snippet-title">{{ item.title }}</div>
          </div>
          <img
            class="snippet-thumbnail"
            :src="`${item.thumbnail}`"
            v-show="item.thumbnail != ''"
          />
          <div class="snippet-description">{{ item.description }}</div>
          <code class="snippet-code">
            <pre>{{ item.code }}</pre>
          </code>
        </div>
        <div class="snippet-margin"></div>
      </li>
    </template>
  </ul>
</template>

<style>
.snippets-container {
  padding: 5px;
  margin: 20px 0px;
  /* gap:10px; */

  column-count: auto;
  column-width: var(--snippet-width);
}

.snippet-list {
  list-style: none;
  page-break-inside: avoid;
  break-inside: avoid;
  /* width:var(--snippet-width); */
  margin: 0px 15px;
  position: relative;
}
.snippet {
  gap: 3px;
  /* margin: 20px; */
}
.snippet-pin-icon {
  margin: 1px;
}
.snippet-thumbnail {
  display: block;
  margin: auto;
}
.snippet-title-container {
  display: flex;
}
.snippet-title {
  text-align: left;
  /* vertical-align: middle; */
  font-weight: bold;
  font-size: 20px;
  flex-grow: 1;
}
.snippet-code {
  display: flex;
  align-items: center;
  vertical-align: middle;
}
.snippet-description {
  font-size: 0.7em;
  text-align: left;
}
.snippet-margin {
  height: 50px;
}
.picker-snippet {
}

.snippet-operation {
  position: absolute;
  right: 0px;
  top: 0px;
}
</style>
