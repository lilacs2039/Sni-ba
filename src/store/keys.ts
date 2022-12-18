import { InjectionKey } from "vue";
import { Context } from "./Context";
import { SnippetDefinitions } from "./SnippetDefinitions";

export const langStrKey:InjectionKey<string> = Symbol("langStr");
export const editorContextKey:InjectionKey<Context> = Symbol("editorContext");
export const snippetDefinitionsKey:InjectionKey<SnippetDefinitions> = Symbol("snippetDefinitions");


