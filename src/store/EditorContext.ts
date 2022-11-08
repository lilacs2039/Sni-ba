import { ref, reactive } from "vue";
import rison from "rison";

export const KEY_CONTEXT: string = "context";

export class EditorContext {
    public snippets = reactive([
        {
            title: "任意コード",
            icon: "code",
            description: "任意のコードを記述",
            codes: [
                [  // １行ずつ
                    // { isVariable: false, code: "rem " },
                    { isVariable: true, code: "任意のコード" }
                ]
            ]
        }]
    );
    public filename = ref("filename.bat");

    constructor(parsed: string = "") { }

    /** 編集中ドキュメントに、スニペットアイテムを追加  */
    public addSnippet(snippet: {
        title: string,
        icon: string,
        description: string,
        code: string
    }) {
        // codeを字句解析して、_{ }_ をラベルとテキストボックスに分類
        const _codes = [];
        var lines = snippet.code.split("\r\n");
        for (let s of lines) {
            var codeline = [];
            while (s != "") {
                const lmatch = s.match("_{");
                const rmatch = s.match("}_");
                var left = s;
                var inner = "";
                var right = "";
                if (lmatch != null && rmatch != null) {
                    left = s.slice(0, lmatch.index);
                    inner = s.slice(lmatch.index as number + 2, rmatch.index);
                    right = s.slice(rmatch.index as number + 2);
                    if (right == undefined) right = "";
                }
                codeline.push({ isVariable: false, code: left });
                if (inner != "") codeline.push({ isVariable: true, code: inner });

                s = right;
            }
            _codes.push(codeline);
        }
        this.snippets.push({
            title: snippet.title,
            icon: snippet.icon,
            description: snippet.description,
            codes: _codes
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

    public publish(): string {
        return this.snippets.map(snippet =>
            // snippet.codes.map(x => x.code).join("")
            // snippet.codes.flatMap(line=>line).map(x => x.code).join("")
            snippet.codes.flatMap(line=>line.map(x => x.code).join("")).join("\r\n")
        ).join("\r\n");
    }

    public serialize(): string {
        return rison.encode({
            filename: this.filename.value,
            snippets: this.snippets
        });
    }

    public static deserialize(str: string): EditorContext {
        const ret = new EditorContext();
        if (str == "") return ret;
        try {
            const obj: any = rison.decode(str);
            ret.filename = ref(obj.filename);
            ret.snippets = reactive(obj.snippets);
        } catch (e) { console.error(`Error deserializing content string "${str}" : ${e}`); }
        return ret;
    }


}

