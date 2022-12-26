<script setup lang="ts">
import { ref, reactive, inject, watchEffect } from "vue";
import json2toml from "json2toml";
// import json2toml from "/@types/json2toml.d.ts";
// import json2toml from "/node_modules/json2toml/index.js";
import iconButton from "./iconButton.vue";
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

function getToml() {
  return json2toml({ snippets: post_snippets });
}

function post() {
  var ret = getToml();

  // toml文字列をクリップボードへコピー
  if (navigator.clipboard) {
    navigator.clipboard.writeText(ret); //.then(()=>...
  } else alert("クリップボードへコピーできませんでした。");

  // GitHubのページへジャンプ
  window.open(
    `https://github.com/${user}/Sni-ba-snippets/edit/main/${langStr}.toml`,
    "_blank",
    "noreferrer"
  );
}

const post_thumb_dict: {
  [title: string]: [url: string];
} = reactive({});
var post_thumb_mes = ref("");
var post_snippet_toml = ref("");

function paste_thumbnail(snippet) {
  post_thumb_mes.value = "";

  navigator.clipboard
    .read()
    .then((clipItems: ClipboardItems) => {
      const clipItem = clipItems[0];
      const type = clipItem.types.filter((s) => s.startsWith("image/"))[0]; // ex. "image/png"
      if (type == undefined) {
        post_thumb_mes.value = "Image not found in clipboard.";
        post_thumb_dict[snippet.title] = "";
        return;
      }

      clipItem.getType(type).then((blob: Blob) => {
        var url = URL.createObjectURL(blob);
        post_thumb_dict[snippet.title] = url;
        post_thumb_mes.value = `Type : ${type},  Size : ${Math.round(
          blob.size / 1000
        )}kB`;

        function blobToBase64(blob: Blob) {
          return new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
        }
        blobToBase64(blob).then((b64) => (snippet.thumbnail = b64));
      });
    })
    .catch((e) => {
      if (e instanceof DOMException) post_thumb_mes.value = e.message;
      else console.log(e);
    });
}

watchEffect(() => {
  post_thumb_dict;
  post_snippet_toml.value = getToml();
});
</script>

<template>
  <div>
    <div v-for="(snippet, i) in post_snippets" v-bind:key="i">
      <div class="post-items">
        <div class="post-key">title</div>
        <input
          type="text"
          class="post-input post-value"
          placeholder="タイトル..."
          v-model="snippet.title"
        />

        <div class="post-key">description</div>
        <textarea
          rows="5"
          class="post-input"
          placeholder="説明..."
          v-model="snippet.description"
        ></textarea>

        <div class="post-key">url</div>
        <input
          type="text"
          class="post-input"
          placeholder="参考URL..."
          v-model="snippet.url"
        />

        <div class="post-key">thumbnail</div>
        <button class="post-input shadow" @click="paste_thumbnail(snippet)">
          Paste Image from clipboard
        </button>
        <div class="post-key"><!-- placeholder --></div>
        <div class="post-input">
          <div>{{ post_thumb_mes }}</div>
          <img :src="post_thumb_dict[snippet.title]" />
        </div>

        <div class="post-key">code</div>
        <textarea
          rows="5"
          class="post-input"
          placeholder="コード..."
          v-model="snippet.code"
        ></textarea>
      </div>
    </div>

    <div class="post-confirm">
      <div>投稿TOML</div>
      <code wrap="off">
        <pre>{{ getToml() }}</pre>
      </code>

      <div class="post-buttons">

        <button 
        class="post-button-submit shadow"
        @click="post"
        >投稿...</button>
      </div>
    </div>
  </div>
</template>

<style>
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
  /* grid-row: 1; */
  grid-column: 1;
  font-weight: bold;
}
.post-value {
  /* grid-row: 1;  */
  grid-column: 2;
}
.post-input {
  /* height: 1.5em; */
  font-size: 1em;
}

.post-buttons{
  display: flex;
}

.post-button-submit {
  display: inline-block;
  border-radius: 5%; /* 角丸       */
  font-size: 18pt; /* 文字サイズ */
  text-align: center; /* 文字位置   */
  cursor: pointer; /* カーソル   */
  padding: 12px 12px; /* 余白       */
  background: #4da6ff; /* 背景色     */
  color: #ffffff; /* 文字色     */
  line-height: 1em; /* 1行の高さ  */
  transition: 0.3s; /* なめらか変化 */
  border: 2px solid #000; /*#4da6ff*/
}
.post-button-submit:hover {
  box-shadow: none; /* カーソル時の影消去 */
  color: #4da6ff; /* 背景色     */
  background: #ffffff; /* 文字色     */
}

.post-confirm {
  display: flex;
  flex-flow: column;
  gap: 10px;
}
</style>
