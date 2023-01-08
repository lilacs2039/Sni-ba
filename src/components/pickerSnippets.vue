<script setup lang="ts">
import { ref, reactive, inject } from "vue";
import { Context } from "../store/Context";
import { editorContextKey, snippetDefinitionsKey, langStrKey } from "../store/keys";
import iconButton from "./iconButton.vue";
import iconTextButton from "./iconTextButton.vue";
import imageInput from "./image-input.vue";

const snippetDefinitions = inject(snippetDefinitionsKey);
const context = inject(editorContextKey);
const langStr = inject(langStrKey);
const user = "lilacs2039";

const showSnippet = ref(null);
// const snippetCache = reactive({});

function edit(snippet) {
  snippet.editable = !snippet.editable;
  console.log(snippet);
  snippet.tomlCache = getToml(snippet);
}
function updateOnChanged(attribute: string, event: Event, snippet) {
  const content = (event.target as HTMLInputElement).innerText.trim();
  doUpdate(snippet, content, snippet);
}
function doUpdate(attribute: string, content: string, snippet) {
  if (attribute == "title") snippet.title = content;
  else if (attribute == "description") snippet.description = content;
  else if (attribute == "code") snippet.code = content;
  else if (attribute == "url") snippet.url = content;
  else if (attribute == "thumbnail") snippet.thumbnail = content;
  snippet.tomlCache = getToml(snippet);
}

function getToml(snippet): string {
  const s = snippet;
  return (
    `[[snippets]]
title = "${s.title}"
` +
    (s.description ? (s.description.search(/\n/) == -1 ? `description = "${s.description}"\n` : `description = """\n${s.description}\n"""\n`) : "") +
    (s.url ? `url = "${s.url}"\n` : "") +
    (s.code.search(/\n/) == -1 ? `code = "${s.code}"\n` : `code = """\n${s.code}\n"""\n`) +
    (s.thumbnail ? `thumbnail = "${s.thumbnail}"\n` : "")
  );
}

function post() {
  // Jump to Github
  window.open(`https://github.com/${user}/Sni-ba-snippets/edit/main/${langStr}.toml`, "_blank", "noreferrer");
}

const copy_mes = ref("");
function copy(snippet) {
  var ret = getToml(snippet);
  // Copy toml strings
  if (navigator.clipboard) {
    navigator.clipboard.writeText(ret); //.then(()=>...
    copy_mes.value = "Copied!";
    // wait 3sec & hide message
    new Promise((resolve) => setTimeout(resolve, 3000)).then(() => (copy_mes.value = ""));
  } else alert("Could not copy to clipboard.");
}

function copy_code(copy_str) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(copy_str);
  } else alert("Could not copy to clipboard.");
}

function addSnippet() {
  const snippet = {
    title: "", //"new snippet",
    code: "", //"code here",
    editable: true,
  };
  snippet.tomlCache = getToml(snippet);
  snippetDefinitions?.addSnippet(snippet);
}
</script>

<template>
  <ul class="snippets-container">
    <template v-for="(item, index) in Object.values(snippetDefinitions.dic)" v-bind:key="index">
      <li
        class="snippet-list"
        :class="item.editable ? 'snippet-list_editing' : ''"
        v-show="item.visible"
        v-on:mouseover="showSnippet = item"
        v-on:mouseleave="showSnippet = null"
      >
        <div class="snippet-operation" v-if="showSnippet == item">
          <iconButton class="snippet-pin-icon" caption="Pin" icon="img/pin.png" @click="context.addSnippet(item)" />
          <iconButton class="snippet-edit-icon" caption="Edit" :icon="item.editable ? 'img/edit_active.png' : 'img/edit.png'" @click="edit(item)" />
        </div>
        <div class="picker-snippet snippet">
          <div class="snippet-title" :contenteditable="item.editable" placeholder="title..." @blur="updateOnChanged('title', $event, item)">
            {{ item.title }}
          </div>
          <img class="snippet-thumbnail" :src="`${item.thumbnail_url}`" v-if="item.thumbnail_url" />
          <div
            class="snippet-description"
            :contenteditable="item.editable"
            placeholder="description..."
            @blur="updateOnChanged('description', $event, item)"
          >
            {{ item.description }}
          </div>
          <div class="snippet-code-container">
            <iconButton v-if="showSnippet == item" class="snippet-code-copy" caption="Copy" icon="img/copy.png" @click="copy_code(item.code)" />
            <pre
              :contenteditable="item.editable"
              placeholder="code..."
              @blur="updateOnChanged('code', $event, item)"
              v-highlightjs
            ><code class="snippet-code">{{ item.code }}</code></pre>
          </div>
          <div>
            <img class="snippet-url-icon" src="./assets/link.png" v-if="item.url" />
            <a
              class="snippet-url"
              placeholder="url..."
              :href="item.url"
              :contenteditable="item.editable"
              @blur="updateOnChanged('url', $event, item)"
            >
              {{ item.url }}</a
            >
          </div>
          <!-- Edit tools -->
          <div v-if="item.editable">
            <hr />
            <imageInput class="post-input" @onChanged="(b64) => doUpdate('thumbnail', b64, item)" />
            <div>TOML Preview</div>
            <code class="snippet-code" wrap="off">
              <pre>{{ item.tomlCache }}</pre>
            </code>
            <div class="post-buttons">
              <icon-text-button icon="img/copy.png" text="1. Copy toml" @click="copy(item)" />
              <icon-text-button icon="img/github.png" text="2. Edit on Github..." @click="post" />
            </div>
            <div v-show="copy_mes != ''">{{ copy_mes }}</div>
          </div>
        </div>
        <div class="snippet-margin"></div>
      </li>
    </template>
    <li class="snippet-list">
      <icon-text-button icon="img/add-list.png" text="Add snippet..." @click="addSnippet" />
    </li>
  </ul>
</template>

<style>
[contenteditable="true"] {
  border: 2px solid #888;
  border-radius: 5px;
}
[contenteditable="true"]:empty:before {
  content: attr(placeholder);
  pointer-events: none;
  display: block; /* For Firefox */
}
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
.snippet-list_editing {
  background-color: #ccc;
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
  max-width: var(--snippet-width);
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
  font-size: 0.8em;
  text-align: left;
}
.snippet-url {
  font-size: 0.8em;
}
.snippet-url-icon {
  height: 0.8em;
}
.snippet-margin {
  height: 20px;
}
.picker-snippet {
}

.snippet-operation {
  position: absolute;
  right: 0px;
  top: 0px;
}

.post-buttons {
  display: flex;
  gap: 10px;
}

.snippet-code-container {
  position: relative;
}
.snippet-code-copy {
  position: absolute;
  right: 0px;
  top: 0px;
  margin: 1px;
}
</style>
