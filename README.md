# 概要

API Gateway でモック API を作成するためのテンプレートを cdk で作成する。

## 始めに

docker-compose.yml 内の「AWS のプロファイル名」「ローカルユーザディレクトリ」を各自の情報に書き換える

## コンテナイメージビルド

docker compose build

## コンテナ起動

docker-compose up -d

## コンテナ起動（ローカル用ファイル使用）

docker-compose -f docker-compose-local.yml up -d

## ターミナルログイン

docker-compose exec cdk-ts bash

## コンテナ停止

docker-compose stop

## コンテナ停止&削除

docker-compose down

## リソース展開

cdk deploy

## リソース削除

cdk destroy --all
