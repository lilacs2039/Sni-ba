<script setup lang="ts">
import { ref, reactive, inject } from "vue";
import json2toml from "json2toml";
// import json2toml from "/@types/json2toml.d.ts";
// import json2toml from "/node_modules/json2toml/index.js";
import iconButton from "./iconButton.vue";
import { Context } from "../store/Context";
import { editorContextKey } from "../store/keys";
// import {marked} from "marked";
import * as marked from "marked";

const editorContext = inject(editorContextKey) as Context;

var titleStr = ref("temp title");
var descStr = ref("");
var iconStr = ref("");
var codeStr = ref("");
var codelangStr = ref("");

function md2html(mdstr: string) {
  return marked.marked(mdstr.replace(/\r?\n/g, "  \n"), { sanitize: true });
}

function post(){
  // toml文字列をクリップボードへコピー

  var ret = json2toml({title:titleStr.value})
  console.log(ret);
  // GitHubのページへジャンプ

}
</script>

<template>
  <div>
    <div class="post-item">
      <div>title</div>
      <input
        type="text"
        class="post-input"
        placeholder="タイトル..."
        v-model="titleStr"
      />
    </div>
    <div class="post-item">
      <div>description</div>
      <input
        type="text"
        class="post-input"
        placeholder="説明..."
        v-model="descStr"
      />
    </div>
    <div class="post-item">
      <div>icon</div>
      <input
        type="text"
        class="post-input"
        placeholder="アイコン..."
        v-model="iconStr"
      />
    </div>
    <div class="post-item">
      <div>code</div>
      <input
        type="text"
        class="post-input"
        placeholder="コード..."
        v-model="codeStr"
      />
    </div>
    <div class="post-item">
      <div>code-lang</div>
      <input
        type="text"
        class="post-input"
        placeholder="言語..."
        v-model="codelangStr"
      />
    </div>
    <input type="submit" value="投稿..." class="post-button-submit" @click="post">
  </div>
</template>

<style>
.post-item {
  display: flex;
}
.post-input {
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
