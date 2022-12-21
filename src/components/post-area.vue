<script setup lang="ts">
import { ref, reactive, inject } from "vue";
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
const user = "lilacs2039"

var post_snippets = reactive([
  {
    title: "",
    icon: "",
    description: "",
    code: "",
  },
]);

function md2html(mdstr: string) {
  return marked.marked(mdstr.replace(/\r?\n/g, "  \n"), { sanitize: true });
}

function post() {
  // toml文字列をクリップボードへコピー
  var ret = json2toml({ snippets: post_snippets });
  console.log(ret);

  if (navigator.clipboard) {
    navigator.clipboard.writeText(ret); //.then(()=>...
  } else alert("クリップボードへコピーできませんでした。");

  // GitHubのページへジャンプ
  window.open(`https://github.com/${user}/Sni-ba-snippets/edit/main/${langStr}.toml`, '_blank', 'noreferrer');

}
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

        <div class="post-key">icon</div>
        <input
          type="text"
          class="post-input"
          placeholder="アイコン..."
          v-model="snippet.icon"
        />

        <div class="post-key">code</div>
        <textarea
          rows="5"
          class="post-input"
          placeholder="コード..."
          v-model="snippet.code"
        ></textarea>
      </div>

      <input
        type="submit"
        value="投稿..."
        class="post-button-submit"
        @click="post"
      />
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
  grid-column-gap: 5px;
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
  box-shadow: 6px 6px 3px #666666; /* 影の設定 */
  border: 2px solid #4da6ff; /* 枠の指定 */
}
.post-button-submit:hover {
  box-shadow: none; /* カーソル時の影消去 */
  color: #4da6ff; /* 背景色     */
  background: #ffffff; /* 文字色     */
}
</style>
