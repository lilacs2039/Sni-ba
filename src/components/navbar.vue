<script setup lang="ts">
import { ref, reactive, inject, provide } from "vue";
import {
  langStrKey,
  editorContextKey,
  snippetDefinitionsKey,
} from "../store/keys";
import { SnippetDefinitions } from "../store/SnippetDefinitions";
import iconButton from "./iconButton.vue";

const langStr = inject(langStrKey) as string;

var langs: [
  {
    name: string;
    icon: string;
  }
] = reactive([]);

// GitHubからtomlのリスト取得
const user = "lilacs2039";
fetch(`https://api.github.com/repos/${user}/Sni-ba-snippets/contents`, {
  method: "GET",
  headers: { Accept: "application/vnd.github.v3+json" },
})
  .then((d) => d.json())
  .then((j) => {
    const files = j.map((e) => e.name) as [string];
    const tomls = files.filter((e: string) => e.endsWith(".toml"));
    const images = files.filter(
      (e: string) => e.match(/\.(svg|png|jpg|jpeg|gif)$/)?.length ?? 0 > 0
    );

    tomls.forEach((filename: string) => {
      const name = filename.replace(".toml", "");
      const iconName = images.filter((e) => e.startsWith(name)).at(0);
      langs.push({
        name: name,
        icon: iconName
          ? `https://raw.githubusercontent.com/${user}/Sni-ba-snippets/main/${iconName}`
          : "",
      });
    });
    langs.sort((a, b) =>
      a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
    );
  });

function onIconError(langName: string) {
  langs.filter((l) => l.name == langName)[0].icon = "";
}
</script>

<template >
  <ul class="nav">
    <li><a class="home" href="?">Sni-ba</a></li>

    <li
      :class="lang.name == langStr ? 'nav-item-active' : 'nav-item'"
      v-for="(lang, i) in langs"
      v-bind:key="i"
    >
      <!-- '📄bat,🐍Python,TypeScript,🌐Web'.split(',')" -->
      <a class="nav-item-link" :href="`?lang=${lang.name}`">
        <img
          class="nav-icon"
          v-if="lang.icon != ''"
          :src="lang.icon"
          @error="onIconError(lang.name)"
        />
        {{ lang.name }}</a
      >
    </li>
  </ul>
</template>

<style>
.nav {
  list-style: none;
  display: flex;
  height: 50px;
  line-height: 50px;
  margin-right: 2px;
  font-weight: bold;
  text-align: center;
  /* background-color: #fff; */
}
.home {
  padding: 0 20px;
  font-size: x-large;
  color: black;
}
.nav-item {
  background-color: #333;
}
.nav-item-active {
  background-color: #777;
}
.nav-icon {
  vertical-align: middle;
  width: 32px;
  height: 32px;
}

.nav-item-link {
  text-decoration: none;
  color: #fff;
  padding: 0 20px;
}
</style>
