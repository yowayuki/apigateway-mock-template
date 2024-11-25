# 概要

API Gateway でモック API を作成するためのテンプレートを cdk で作成する。

## 始めに

docker-compose.yml 内の「AWS のプロファイル名」「ローカルユーザディレクトリ」を各自の情報に書き換える

## コンテナイメージビルド

docker compose build

## コンテナ起動

docker-compose up -d

## ターミナルログイン

docker compose exec cdk-ts bash
