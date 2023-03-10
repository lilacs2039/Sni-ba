import { ref, reactive, inject } from "vue";
// import snippetsDefinitionUrl from "../assets/snippets.tsv?url";
import batUrl from "../assets/bat.tsv?url";
import tagsContent from "../assets/tags.txt?raw";
import toml from "toml";
export const KEY_LANG: string = "lang";

export class SnippetDefinitions {
    public dic: {
        [key: string]: {
            title: string,
            thumbnail: string,
            description: string,
            code: string,
            url: string,
            // for UI
            thumbnail_url: string,
            visible: boolean,
            editable: boolean,
        }
    } = reactive({});
    public tagGroups: [
        {
            name: string,
            tags: Set<string>,
        }
    ] = reactive([]);

    constructor(langStr: string) {

        // GitHubからtomlのリスト取得
        const user = "lilacs2039";
        const tomlPath = `https://raw.githubusercontent.com/${user}/Sni-ba-snippets/main/${langStr}.toml`;
        fetch(tomlPath)
            .then(response => response.text())
            .then(input => {
                try {
                    const data = toml.parse(input);
                    console.log(data)

                    if (data.tagGroup != undefined)
                        data.tagGroup.forEach((v: any) => {
                            if (v.name == undefined) { console.warn(`Warning : tagGroup do not have attribute 'name'.`); return; }
                            if (v.tags == undefined) { console.warn(`Warning : tagGroup '${v.name}' do not have attribute 'tags'.`); return; }
                            this.addTags(v.name, v.tags.split(","))
                        });

                    if (data.snippets != undefined)
                        data.snippets.forEach((x: any) => {
                            this.addSnippet(x);
                        })
                } catch (e) { console.error(`Parse error on ${tomlPath}. ${e}`); }

            });




    }
    public addSnippet(snippet: any) {
        function toBlob(b64: string, type: string): Blob {
            if (b64 == undefined) return new Blob();
            // var bin = Buffer.from(b64.replace(/^.*,/, ''), 'base64');
            var bin = window.atob(b64.replace(/^.*,/, ''));
            var buffer = new Uint8Array(bin.length);
            for (var i = 0; i < bin.length; i++) {
                buffer[i] = bin.charCodeAt(i);
            }
            // Blobを作成
            try {
                var blob = new Blob([buffer.buffer], {
                    type: type
                });
            } catch (e) { return new Blob(); }
            return blob;
        }
        const x = snippet;
        this.dic[SnippetDefinitions.getKey(x)] = {
            title: x.title ?? "",
            code: x.code ?? "",
            thumbnail: x.thumbnail ?? "",
            thumbnail_url: x.thumbnail ? URL.createObjectURL(toBlob(x.thumbnail, 'image/png')) : "",
            description: x.description ?? "",
            url: x.url ?? "",
            visible: x.visible ?? true,
            editable: x.editable ?? false,
        };

    }

    public removeSnippet(snippet: any) { delete this.dic[SnippetDefinitions.getKey(snippet)] }

    public static getKey(snippet): string { return `${snippet.title}` }

    public addTags(key: string, tags: string[]) {
        var tagGroup = this.tagGroups.find(t => t.name == key);
        if (tagGroup == undefined) {
            tagGroup = { name: key, tags: new Set<string>() };
            this.tagGroups.push(tagGroup)
        }
        tags.forEach(t => tagGroup?.tags.add(t));
    }

    public search(searchStr: string) {
        const words = searchStr.toLowerCase().split(/\s/g).filter((w) => w != ""); //任意の空白文字で、複数ワード指定。
        console.log(words);
        Object.values(this.dic).forEach(snippet => {
            // visible=trueの条件
            // ・スニペットのタイトル・説明・コードのいずれかにキーワードが含まれること
            // ・キーワードすべてが含まれること。
            const targets = [snippet.title.toLowerCase(), snippet.description.toLowerCase(), snippet.code.toLowerCase()];
            snippet.visible = words.every((w) => targets.some((t) => t.includes(w)));
        });
    }
    public clear() {
        Object.values(this.dic).forEach((snippet) => (snippet.visible = true));
    }
}
