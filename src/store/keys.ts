import { InjectionKey } from "vue";
import { EditorContext } from "./EditorContext";
import { SnippetDefinitions } from "./SnippetDefinitions";

export const langStrKey:InjectionKey<string> = Symbol("langStr");
export const editorContextKey:InjectionKey<EditorContext> = Symbol("editorContext");
export const snippetDefinitionsKey:InjectionKey<SnippetDefinitions> = Symbol("snippetDefinitions");


