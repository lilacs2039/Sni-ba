<script setup lang="ts">
import { ref, reactive, inject, watchEffect } from "vue";
import json2toml from "json2toml";
// import json2toml from "/@types/json2toml.d.ts";
// import json2toml from "/node_modules/json2toml/index.js";
import iconButton from "./iconButton.vue";
import iconTextButton from "./iconTextButton.vue";
import imageInput from "./image-input.vue";
import { Context } from "../store/Context";
import { editorContextKey, langStrKey } from "../store/keys";
// import {marked} from "marked";
import * as marked from "marked";

const editorContext = inject(editorContextKey) as Context;
const langStr = inject(langStrKey);
const user = "lilacs2039";

var post_snippets = reactive([
  {
    title: "",
    thumbnail: "",
    description: "",
    url: "",
    code: "",
  },
]);

function md2html(mdstr: string) {
  return marked.marked(mdstr.replace(/\r?\n/g, "  \n"), { sanitize: true });
}

function getToml(): string {
  // return json2toml({ snippets: post_snippets });
  return post_snippets
    .map(
      (s) =>
        `[[snippets]]
title = "${s.title}"
` +
        (s.description ? (s.description.search(/\n/) == -1 ? `description = "${s.description}"\n` : `description = """\n${s.description}\n"""\n`) : "") +
        (s.url ? `url = "${s.url}"\n` : "") +
        (s.code.search(/\n/) == -1 ? `code = "${s.code}"\n` : `code = """\n${s.code}\n"""\n`) +
        (s.thumbnail ? `thumbnail = "${s.thumbnail}"\n` : "")
    )
    .join("\n");
}

function post() {
  // GitHubのページへジャンプ
  window.open(`https://github.com/${user}/Sni-ba-snippets/edit/main/${langStr}.toml`, "_blank", "noreferrer");
}

const copy_mes = ref("");
function copy() {
  var ret = getToml();
  // toml文字列をクリップボードへコピー
  if (navigator.clipboard) {
    navigator.clipboard.writeText(ret); //.then(()=>...
    copy_mes.value = "Copied!";
    // 3秒待ってから文字を消す。
    new Promise((resolve) => setTimeout(resolve, 3000)).then(() => (copy_mes.value = ""));
  } else alert("クリップボードへコピーできませんでした。");
}

var post_snippet_toml = ref("");

watchEffect(() => {
  post_snippets;
  post_snippet_toml.value = getToml();
});
</script>

<template>
  <div class="post-arae">
    <div v-for="(snippet, i) in post_snippets" v-bind:key="i">
      <div class="post-items">
        <div class="post-key">title</div>
        <input type="text" class="post-input post-value" placeholder="タイトル..." v-model="snippet.title" />

        <div class="post-key">description</div>
        <textarea rows="5" class="post-input" placeholder="説明..." v-model="snippet.description"></textarea>

        <div class="post-key">url</div>
        <input type="text" class="post-input" placeholder="参考URL..." v-model="snippet.url" />

        <div class="post-key">thumbnail</div>
        <imageInput class="post-input" @onChanged="(b64) => (snippet.thumbnail = b64)" />

        <div class="post-key">code</div>
        <textarea rows="5" class="post-input" placeholder="コード..." v-model="snippet.code"></textarea>
      </div>
    </div>

    <div class="post-confirm">
      <div>TOML Preview</div>
      <code class="post-toml-code" wrap="off">
        <pre>{{ getToml() }}</pre>
      </code>

      <div class="post-buttons">
        <icon-text-button icon="/img/clipboard.png" text="Copy toml" @click="copy" />
        <icon-text-button icon="/img/windowlink.png" text="Jump to Github..." @click="post" />
      </div>
      <div v-show="copy_mes != ''">{{ copy_mes }}</div>
    </div>
  </div>
</template>

<style>
:root {
  --post-area-maxwidth: 1000px;
}
.post-arae {
  max-width: var(--post-area-maxwidth);
}
.post-item {
  display: flex;
}

.post-items {
  display: grid;
  grid-template-columns: 8em auto;
  margin: 10px;
  /* grid-column-gap: 5px; */
  gap: 4px;
}
.post-key {
  grid-column: 1;
  font-size: 1.2em;
  font-weight: bold;
}
.post-value {
  grid-column: 2;
}
.post-input {
  font-size: 1.2em;
}
.post-thumbnail-img {
  max-width: var(--snippet-width);
}
.thumbnail-button {
  font-size: 1.2em;
  vertical-align: middle;
  flex-grow: 1;
}

.post-toml-code {
  margin: 10px 20px;
}

.post-buttons {
  display: flex;
  gap: 10px;
}

.post-confirm {
  display: flex;
  flex-flow: column;
  gap: 10px;
}
.post-button-icon {
  vertical-align: middle;
}
</style>
