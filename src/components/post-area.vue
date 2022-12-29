<script setup lang="ts">
import { ref, reactive, inject, watchEffect } from "vue";
import json2toml from "json2toml";
// import json2toml from "/@types/json2toml.d.ts";
// import json2toml from "/node_modules/json2toml/index.js";
import iconButton from "./iconButton.vue";
import iconTextButton from "./iconTextButton.vue";
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
      (s) => `[[snippets]]
title = "${s.title}"
description = """
${s.description}
"""
url = "${s.url}"
code = """
${s.code}
"""
thumbnail = "${s.thumbnail}"
`
    )
    .join("\n");
}

function post() {
  // GitHubのページへジャンプ
  window.open(
    `https://github.com/${user}/Sni-ba-snippets/edit/main/${langStr}.toml`,
    "_blank",
    "noreferrer"
  );
}

const copy_mes = ref("");
function copy() {
  var ret = getToml();
  // toml文字列をクリップボードへコピー
  if (navigator.clipboard) {
    navigator.clipboard.writeText(ret); //.then(()=>...
    copy_mes.value = "Copied!";
    // 3秒待ってから文字を消す。
    new Promise((resolve) => setTimeout(resolve, 3000)).then(
      () => (copy_mes.value = "")
    );
  } else alert("クリップボードへコピーできませんでした。");
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
  <div class="post-arae">
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
        <div class="post-input post-thumbnail">
          <button
            class="thumbnail-button shadow"
            @click="paste_thumbnail(snippet)"
          >
            Paste Image from clipboard
          </button>
          <iconButton
            caption="クリア"
            icon="/img/clear.png"
            @click="snippet.thumbnail = ''"
          />
        </div>
        <div class="post-key"><!-- placeholder --></div>
        <div class="post-input">
          <div>{{ post_thumb_mes }}</div>
          <img class="post-thumbnail-img" :src="snippet.thumbnail" />
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
      <code class="post-toml-code" wrap="off">
        <pre>{{ getToml() }}</pre>
      </code>

      <div class="post-buttons">
        <icon-text-button icon="/img/clipboard.png" text="Copy toml" @click="copy" />
        <icon-text-button icon="/img/windowlink.png" text="Jump to Github..."  @click="post" />
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
.post-thumbnail {
  display: flex;
  gap: 10px;
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
  margin : 10px 20px;
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
