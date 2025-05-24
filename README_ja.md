
# ダイエットレシピLINEボット

## 概要
LINEの音声メッセージから食材を抽出し、ChatGPTを使って500kcal以下のダイエットレシピを2つ返信します。

## 必要なもの
- Google Cloud Speech-to-Text の有効化と認証情報（JSON）
- OpenAI APIキー
- LINE Developers で作成したボット

## セットアップ方法

1. `.env.example` を `.env` にリネームして、各種キーを入力
2. `google-credentials.json` をプロジェクトルートに配置
3. `npm install`
4. `node index.js`
