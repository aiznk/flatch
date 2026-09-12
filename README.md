# flatch

フラットファイルベースの2chライクな掲示板。

Since: 2026-09-07

## データファイル

### data/config.json

アプリの構成ファイル。

```json
{
	"app_name": "ふらっとちゃんねる",
	"theme": "dark",
	"welcome_message": "ふらっとちゃんねるにようこそ！",
	"home_display_board": "prog",
	"published_date": "2026-09-08"
}
```

* app_name ... アプリ名。サイトの名前
* theme ... アプリのデザインテーマ。`dark`と`light`を切り替え可能
* welcome_message ... ホームページに表示されるメッセージ
* home_display_board ... ホームページに表示するスレッド一覧の板スラッグ
* published_date ... アプリを公開した日付

### data/categories.json

カテゴリの情報ファイル。

```json
[
	["PC等", "pc"],
	["生活", "life"]	
]
```

`[カテゴリ名, カテゴリID]`で記述する。

### data/boards.json

板の情報ファイル。
ここの記載された板がサイトに表示される。

```json
[
	["プログラマー", "prog", "pc"],
	["プログラム", "tech", "pc"],
	["生活全般", "kankon", "life"]
]
```

`[板名, 板スラッグ, カテゴリーID]`で記述する。

### data/boards/board_slug/setting.json

板の設定情報ファイル。

```json
{
	"board_name": "プログラマー",
	"board_desc": "プログラマ板です。",
	"board_category": "pc",
	"board_no_name": "名無しさん"
}
```

* board_name ... 板名
* board_desc ... 板の説明
* board_category ... 板が属するカテゴリーID
* board_no_name ... 名無しの投稿者の名前

### data/boards/board_slug/subjects.dat

板のトップに表示するdat落ちしていないスレッド一覧。

```
1<>スレッド名1
2<>スレッド名2
3<>スレッド名3
```

### data/boards/board_slug/threads/thread_id.dat

スレッドに投稿されているレスのファイル。

```
名無しさん<>sage<>2026/04/15(水) 07:12:21.67<>あいうえお<>テストスレ
名無しさん<><>2026/04/15(水) 07:12:24.67<>かきくけこ<>
```

`<>`区切りのCSV形式。

```
投稿者名 <> メールアドレス <> 日付時刻 <> 投稿内容 <> スレッド名（1番目のレコードのみ）
```

### data/thread_id.dat

スレッドのIDを生成するためのファイル。
内容は整数。
