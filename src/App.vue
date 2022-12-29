<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
// import HelloWorld from "/src/components/HelloWorld.vue";
import { provide } from "vue";
import navbar from "/src/components/navbar.vue";
import picker from "/src/components/picker.vue";
import workarea from "/src/components/workarea.vue";
import { Context as Context, KEY_CONTEXT } from "./store/Context";
import {
  langStrKey,
  editorContextKey,
  snippetDefinitionsKey,
} from "./store/keys";
import { SnippetDefinitions, KEY_LANG } from "./store/SnippetDefinitions";
import queryString from "query-string";
import { parse } from "@babel/parser";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// ---------  クエリストリングから復元  ---------
const parsed = queryString.parse(location.search);
// 言語
const langStr = KEY_LANG in parsed ? (parsed[KEY_LANG] as string) : "bat"; //デフォルト：bat
provide(langStrKey, langStr);
const snippetDefinitions = new SnippetDefinitions(langStr);
provide(snippetDefinitionsKey, snippetDefinitions);
// コンテキスト
const contextStr = KEY_CONTEXT in parsed ? (parsed[KEY_CONTEXT] as string) : "";
provide(editorContextKey, Context.deserialize(contextStr));

// --------　Firebase　--------
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMXnpCoV3pW2qPDZn6SKRm1dPCJ-mLZ88",
  authDomain: "snippet-codes.firebaseapp.com",
  projectId: "snippet-codes",
  storageBucket: "snippet-codes.appspot.com",
  messagingSenderId: "762570797101",
  appId: "1:762570797101:web:1cc34b4bea61f3d18c08a4",
  measurementId: "G-QZ6LNFMQ87",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
</script>

<template>
  <navbar />

  <div class="page">
    <div class="picker"><picker /></div>
  </div>
</template>

<style>
:root {
  --snippet-bgcolor: #eee;
  --button-color: #fafafa;
  --snippet-width:500px;
}
body {
  background-color: #eee;
  margin: 0 20px;
  padding: 0;
}

code {
  overflow-x: scroll;
  text-align: left;
  background-color: #ddd;
  padding: 0 10px;
}
button {
  cursor: pointer;
}

.shadow {
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
}

.page {
  height: 100vh;
  gap: 50px;
}
.header {
  grid-area: header;
}
.picker {
  grid-area: picker;
}
.workarea {
  grid-area: workarea;
}
</style>
