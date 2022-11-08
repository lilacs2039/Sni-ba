import { ref, reactive } from "vue";
// import snippetsDefinitionUrl from "../assets/snippets.tsv?url";
import batUrl from "../assets/bat.tsv?url";
import tagsContent from "../assets/tags.txt?raw";
import { stringify } from "query-string";
import toml from "toml";

export const KEY_LANG: string = "lang";

// class TagGroup {
//     name: string = "group name";
//     tags: Array<string> = "移動,コピー,開く,作成,変更,削除".split(",");
// }
export class SnippetDefinitions {
    public list = reactive([
        {
            title: "任意コード",
            icon: "code",
            description: "任意のコードを記述",
            code: "_{任意のコード}_",
            visible: true,
        },
    ]);
    public tags = reactive(Array<any>());

    constructor(langStr: string) {
        const assetsUrl = batUrl.replace("/bat.tsv", "");

        // snippetsDefinitionUrlの初期化
        fetch(`${assetsUrl}/${langStr}.tsv`)
            .then((response) => response.text())
            .then((input) => {
                var lines = input.split("\r\n").filter((x) => !x.match(/^\s/) && x != ""); //tsvの空行を除外
                const header = lines[0].split("\t");

                const tmp = lines.slice(1).map((line) => {
                    const fields = line.split("\t");
                    return Object.fromEntries(header.map((h, i) => [h, fields[i]]));
                }).forEach((x) => this.list.push({
                    title: x.title,
                    icon: x.icon,
                    description: x.description,
                    code: x.code,
                    visible: true,
                }));
            });

        // tomlの読み込み　（タグ、スニペット）
        const tomlPath = `${assetsUrl}/${langStr}.toml`;
        fetch(tomlPath)
            .then(response => response.text())
            .then(input => {
                try {
                    const data = toml.parse(input);
                    data.tagGroup.forEach((v: any) =>
                        this.tags.push({
                            name: v.name,
                            tags: v.tags.split(",")
                        }));

                    Object.keys(data).forEach(k=>{
                        if (k=="tagGroup") return;
                        const x = data[k];
                        this.list.push({
                            title: k,
                            icon: x.icon,
                            description: x.description,
                            code: x.code,
                            visible: true,
                        });
                    })
                } catch (e) { console.error(`Parse error on ${tomlPath}. ${e}`); }

            });

    }

    public search(searchStr: string) {
        const words = searchStr.split(/\s/g).filter((w) => w != ""); //任意の空白文字で、複数ワード指定。
        console.log(words);
        this.list.forEach((snippet) => {
            // visible=trueの条件
            // ・スニペットのタイトル・説明・コードのいずれかにキーワードが含まれること
            // ・キーワードすべてが含まれること。
            const targets = [snippet.title, snippet.description, snippet.code];
            snippet.visible = words.every((w) => targets.some((t) => t.includes(w)));
        });
    }
    public clear() {
        this.list.forEach((snippet) => (snippet.visible = true));
    }
}
