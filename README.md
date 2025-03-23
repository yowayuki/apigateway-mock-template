# 概要

APIGateway で簡単にモック API を作成するツールです。
このリポジトリ内にある docker-compose でコンテナを起動し、cdk deploy でサクっとモック API をデプロイできます。
リクエストのクエリパラメータやリクエストボディ、Cookie などによってレスポンスを変化させる方法を網羅しています。
各自の使用方法に合わせて調節して使ってください。

解説記事書きました。
https://qiita.com/Yowayuki/items/03d4dc84469d9ca3d0aa

## 前提

・お使いのローカルマシーンで docker が使用できること
・AWS CLI をインストール済みであること
※ローカルマシーンにある AWS CLI の認証情報をコンテナで使用します

## 始めに

docker-compose.yml 内の「AWS のプロファイル名」「ローカルユーザディレクトリ」を各自の情報に書き換える
CloudFormation の利用が初回である場合のみ、コンテナ起動後、「cdk bootstrap」コマンドを実行する

## 使い方

コンテナ内で「cdk deploy MockApiStack」を実行するとデフォルトで用意しているモック API がデプロイされます。
デフォルトでは「GET」「POST」でそれぞれモック API を用意しています。
コンテナ内に curl インストールされているので以下リクエストを試せます。

### 200 系のレスポンスになるリクエスト例

GET リクエスト
curl -H "Cookie:userNumber=123" "https://j3ytyxxfc7.execute-api.ap-northeast-1.amazonaws.com/v1/user/info"
curl "https://j3ytyxxfc7.execute-api.ap-northeast-1.amazonaws.com/v1/user/info?userNumber=123"

POST リクエスト
curl -X POST -H "Content-Type: application/json" -H "Cookie:userNumber=123" -d '{"userName" : "テスト太郎"}' "https://j3ytyxxfc7.execute-api.ap-northeast-1.amazonaws.com/v1/user/info"
※POST のレスポンスは、リクエストの Cookie、ボディのパラメータによって動的に返却されます

### 400 系のレスポンスになるリクエスト例

GET リクエスト
curl "https://j3ytyxxfc7.execute-api.ap-northeast-1.amazonaws.com/v1/user/info"
※cookie とパラメータ両方無しでエラー

POST リクエスト
curl -X POST -H "Content-Type: application/json" -d '{"userName" : "テスト太郎"}' "https://j3ytyxxfc7.execute-api.ap-northeast-1.amazonaws.com/v1/user/info"
※cookie かパラメータ片方無しでエラー

# 使用コマンド集

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
