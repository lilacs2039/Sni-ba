<script setup lang="ts">
import { ref, reactive, inject } from "vue";
import { Context } from "../store/Context";
import { editorContextKey, snippetDefinitionsKey } from "../store/keys";
import iconButton from "./iconButton.vue";

const snippetDefinitions = inject(snippetDefinitionsKey);
const context = inject(editorContextKey);
</script>

<template>
  <ul class="snippets-container">
    <template
      v-for="(item, index) in Object.values(snippetDefinitions.dic)"
      v-bind:key="index"
    >
      <li class="snippet-list" v-show="item.visible">
        <div class="picker-snippet snippet">
          <div class="snippet-title-container">
            <div class="snippet-title">{{ item.title }}</div>
            <iconButton
              class="snippet-pin-icon"
              caption="Pin"
              icon="/img/pin.png"
              @click="context.addSnippet(item)"
            />
          </div>
          <img class="snippet-thumbnail" :src="`${item.thumbnail}`" />
          <div class="snippet-description">{{ item.description }}</div>
          <code class="snippet-code">
            <pre>{{ item.code }}</pre>
          </code>
        </div>
      </li>
    </template>
  </ul>
</template>

<style>
.snippets-container {
  padding: 5px;
  margin: 0px;
  /* gap:10px; */

  column-count: auto;
  column-width: 500px;
}

.snippet-list {
  list-style: none;
  page-break-inside: avoid;
  break-inside: avoid;
  margin: 50px 15px;
}
.snippet {
  gap: 3px;
  /* margin: 20px; */
}
.snippet-pin-icon{
  margin : 1px;
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
  vertical-align: middle;
  font-weight: bold;
  font-size: 1.2em;
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

.picker-snippet {
}
</style>
