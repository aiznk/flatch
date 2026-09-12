<?php
// デフォルトのアプリのタイトル
define('DEF_APP_TITLE', 'Flatch');

// アプリのデータを配置するフォルダ
// データを非公開にしたい場合はこの定数を任意のフォルダに変えてください。
define('DATA_DIR', './data');

// POST（投稿）の時間制限（秒）
define('MAX_LAST_POST_DIF', 3); // x seconds

// アプリの構成情報が書かれているファイル
define('CONFIG_PATH', DATA_DIR .'/config.json');

// 板リストの情報が書かれているファイル
define('BOARDS_PATH', DATA_DIR .'/boards.json');

// カテゴリ情報が書かれているファイル
define('CATEGORIES_PATH', DATA_DIR .'/categories.json');

// スレッドのIDをカウントするファイル
define('THREAD_ID_PATH', DATA_DIR .'/thread_id.dat');

// 静的ファイルを置くフォルダ
define('STATIC_DIR', './static');
define('INDEX_JS_PATH', STATIC_DIR .'/index.js');
define('STYLE_CSS_PATH', STATIC_DIR .'/style.css');

// 板フォルダを配置する親フォルダ名
define('BOARDS_DIR_NAME', 'boards');

// 板フォルダを配置する親フォルダ
define('BOARDS_DIR', DATA_DIR . '/'. BOARDS_DIR_NAME);

// 板の設定ファイル名
define('BOARD_SETTING_FILE_NAME', 'setting.json');

// スレッドデータを配置する親フォルダ名
define('THREADS_DIR_NAME', 'threads');

// 板の表示するスレッドの一覧
define('SUBJECTS_FILE_NAME', 'subjects.dat');

// subjects.datに保存するスレッド情報数
define('MAX_SUBJECTS_LEN', 5);

// datファイルの行の区切り文字
define('DAT_LINE_SEP', '<>');

// datファイルの拡張子
define('DAT_FILE_EXT', '.dat');

// スレッドに投稿できるレコードの上限数
define('LIMIT_DAT_FILE_LINES', 1000);

// ホームページに表示するスレッドリストの数
define('HOME_THREADS_PER_PAGE', 10);

define('RES_NAME_MIN_LEN', 0);
define('RES_NAME_MAX_LEN', 64);
define('RES_EMAIL_MIN_LEN', 0);
define('RES_EMAIL_MAX_LEN', 128);
define('RES_DATETIME_MIN_LEN', 0);
define('RES_DATETIME_MAX_LEN', 32);
define('RES_CONTENT_MIN_LEN', 1);
define('RES_CONTENT_MAX_LEN', 4096);
define('RES_SUBJECT_MIN_LEN', 1);
define('RES_SUBJECT_MAX_LEN', 128);
define('INVALID_RECORD_REG_EXP', "/[\r|\n|\t|\v|\f|\b|\a|\\|\$|\0]/");
