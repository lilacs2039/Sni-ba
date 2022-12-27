import { ref, reactive, inject } from "vue";
// import snippetsDefinitionUrl from "../assets/snippets.tsv?url";
import batUrl from "../assets/bat.tsv?url";
import tagsContent from "../assets/tags.txt?raw";
import { stringify } from "query-string";
import toml from "toml";
import {
    langStrKey,
    // editorContextKey,
    // snippetDefinitionsKey,
} from "../store/keys";

export const KEY_LANG: string = "lang";
const langStr = inject(langStrKey) as string;

export class SnippetDefinitions {
    public dic: {
        [key: string]: {
            title: string,
            thumbnail: string,
            description: string,
            code: string,
            visible: boolean
        }
    } = reactive({});
    public tagGroups: [
        {
            name: string,
            tags: Set<string>,
        }
    ] = reactive([]);

    constructor(langStr: string) {
        const assetsUrl = batUrl.replace("/bat.tsv", "");

        // snippetsDefinitionUrlの初期化
        // fetch(`${assetsUrl}/${langStr}.tsv`)
        //     .then((response) => response.text())
        //     .then((input) => {
        //         var lines = input.split("\r\n").filter((x) => !x.match(/^\s/) && x != ""); //tsvの空行を除外
        //         const header = lines[0].split("\t");

        //         const tmp = lines.slice(1).map((line) => {
        //             const fields = line.split("\t");
        //             return Object.fromEntries(header.map((h, i) => [h, fields[i]]));
        //         }).forEach((x) => this.dic[x.title] = {
        //             title: x.title,
        //             icon: x.icon,
        //             description: x.description,
        //             code: x.code,
        //             visible: true,
        //         })
        //     });

        // tomlの読み込み　（タグ、スニペット）
        // const filename = "bat.toml";

        // GitHubからtomlのリスト取得
        const user = "lilacs2039";
        // fetch(`https://api.github.com/repos/${user}/Sni-ba-snippets/contents`, 
        //     { method: "GET", headers: { "Accept": "application/vnd.github.v3+json" } })
        //     .then(d => d.json())
        //     .then(j => console.log(j.map(e => e.name).filter((e:string)=>e.endsWith(".toml")) ));

        function toBlob(b64: string, type: string): Blob {
            if(b64 == undefined ) return new Blob();
            // var bin = Buffer.from(b64.replace(/^.*,/, ''), 'base64');
            var bin = atob(b64.replace(/^.*,/, ''));
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
                        data.snippets.forEach(x => {
                            this.dic[x.title] = {
                                title: x.title,
                                // icon: x.icon,
                                thumbnail:x.thumbnail!=undefined? URL.createObjectURL(toBlob(x.thumbnail, 'image/png')) : "/img/code.png",
                                description: x.description,
                                code: x.code,
                                visible: true,
                            };
                        })
                } catch (e) { console.error(`Parse error on ${tomlPath}. ${e}`); }

            });




    }

    public addTags(key: string, tags: string[]) {
        var tagGroup = this.tagGroups.find(t => t.name == key);
        if (tagGroup == undefined) {
            tagGroup = { name: key, tags: new Set<string>() };
            this.tagGroups.push(tagGroup)
        }
        tags.forEach(t => tagGroup.tags.add(t));
    }

    public search(searchStr: string) {
        const words = searchStr.split(/\s/g).filter((w) => w != ""); //任意の空白文字で、複数ワード指定。
        console.log(words);
        Object.values(this.dic).forEach(snippet => {
            // visible=trueの条件
            // ・スニペットのタイトル・説明・コードのいずれかにキーワードが含まれること
            // ・キーワードすべてが含まれること。
            const targets = [snippet.title, snippet.description, snippet.code];
            snippet.visible = words.every((w) => targets.some((t) => t.includes(w)));
        });
    }
    public clear() {
        Object.values(this.dic).forEach((snippet) => (snippet.visible = true));
    }
}
