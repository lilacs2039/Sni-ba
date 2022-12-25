import { ref, reactive } from "vue";
import rison from "rison";

export const KEY_CONTEXT: string = "context";

export class Context {
    public snippets = reactive([
        {
            title: "任意コード",
            thumbnail: "code",
            description: "任意のコードを記述",
            code: "任意のコード"
        }]
    );
    public filename = ref("filename.bat");

    constructor(parsed: string = "") { }

    /** 編集中ドキュメントに、スニペットアイテムを追加  */
    public addSnippet(snippet: {
        title: string,
        thumbnail: string,
        description: string,
        code: string
    }) {
        this.snippets.push({
            title: snippet.title,
            thumbnail: snippet.thumbnail,
            description: snippet.description,
            code: snippet.code
        });
    }

    public removeSnippet(index: number): void {
        if (index < 0 || this.snippets.length <= index) {
            console.log("EditorContext#removeSnippet : index error @" + index)
            return;
        }
        this.snippets.splice(index, 1);
    }
    public moveSnippet(index: number, up: boolean): void {
        if (up) {
            if (index <= 0 || this.snippets.length + 1 <= index) {
                console.log(`Error EditorContext#moveSnippet up : index error. index:${index}, length:${this.snippets.length}`)
                return;
            }
            this.snippets.splice(index - 1, 2, this.snippets[index], this.snippets[index - 1]);
        } else {
            if (index < 0 || this.snippets.length - 1 <= index) {
                console.log(`Error EditorContext#moveSnippet down : index error. index:${index}, length:${this.snippets.length}`)
                return;
            }
            this.snippets.splice(index, 2, this.snippets[index + 1], this.snippets[index]);
        }
    }

    // public publish(): string {
    //     return this.snippets.map(snippet =>
    //         snippet
    //         // snippet.codes.flatMap(line=>line.map(x => x.code).join("")).join("\r\n")
    //     ).join("\r\n");
    // }

    public serialize(): string {
        return rison.encode({
            filename: this.filename.value,
            snippets: this.snippets
        });
    }

    public static deserialize(str: string): Context {
        const ret = new Context();
        if (str == "") return ret;
        try {
            const obj: any = rison.decode(str);
            ret.filename = ref(obj.filename);
            ret.snippets = reactive(obj.snippets);
        } catch (e) { console.error(`Error deserializing content string "${str}" : ${e}`); }
        return ret;
    }


}

