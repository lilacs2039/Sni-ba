# Sni-ba

the Place(場-ba) to store Snippets

# WebSite

https://lilacs2039.github.io/Sni-ba/



# 環境

- OS：WSL2 Ubuntu on Windows11
- ツール：npm, firebase tools

- アプリ：Vue 3 + TypeScript + Vite

参考 [インストール | Vue.js](https://v3.ja.vuejs.org/guide/installation.html#vite)



# 設定

- コード管理：[https://github.com/lilacs2039/Sni-ba](https://github.com/lilacs2039/Sni-ba)




# 環境構築

## 環境のセットアップ

```bash
wsl
sudo apt update
sudo apt install nodejs npm
# node.jsのアップグレード（v10 -> v14)、firebase-toolsが対応してないため。
sudo npm install n -g
sudo n stable
# 古い方のnode.jsは削除
sudo apt purge -y nodejs npm
exec $SHELL -l
#バージョン確認
node -v

sudo npm install -g firebase-tools
```

node.js　アップグレード参考

https://qiita.com/seibe/items/36cef7df85fe2cefa3ea



## プロジェクトのセットアップ

```bash
git clone https://github.com/lilacs2039/Snippet-codes

# （package.jsonを元に依存モジュールがインストールされる））
npm install

```





# 開発

## 開発ツール

エディタ：vs code （プロジェクトフォルダを開く）

バージョン管理：GitHub Desktop



## 実行方法

１．ローカルサーバ起動

```
npm run dev
```

２．http://localhost:3000/　へアクセス



## ビルド方法

```
npm run build

# TypeScript文法チェックなしの場合
npm run build-nocheck
```



## アプリをローカルでテスト

ビルドしてdistに出力した静的ウェブサイトをローカルサーバでテストする。

１．ローカルサーバ起動

```
npm run preview
```

２．http://localhost:4173　へアクセス



参考：　[静的サイトのデプロイ | Vite](https://ja.vitejs.dev/guide/static-deploy.html)



## デプロイ

```
firebase deploy --only hosting
```



# 仕様

## URL クエリ文字列

例

```
localhost:3000?lang=bat&context=(filename:filename.bat,snippets:!((codes:!((code:'cd /d "',isVariable:!f),(code:ディレクトリ名,isVariable:!t),(code:",isVariable:!f)),description:カレントディレクトリの移動,icon:unknown,title:カレントディレクトリ移動)))
```

書式

| **キー** | **値**           |
| -------- | ---------------- |
| lang     | エディタの言語   |
| content  | スニペットの内容 |

 

## スニペット定義(toml, tsv)

toml

- tags

  - other [array]
    - 画面, 通信, ...

- snippets
  - title (required)
  - code (required)

  - url

  - thumbnail

  - description
  
    - マークダウンで記述可能


​    
