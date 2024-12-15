FROM node:20.15.1-slim

# ビルド変数として作業ディレクトリが渡される
ARG APP_DIR

# 必要ソフトインストール
RUN apt-get update && apt-get install -y curl unzip less
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip && ./aws/install
RUN npm install -g typescript aws-cdk
# 不要ファイル削除
RUN rm -rf awscliv2.zip aws && apt-get purge -y unzip &&  apt-get clean &&  rm -rf /var/lib/apt/lists/*

# 環境セットアップ
WORKDIR ${APP_DIR}
COPY ./${APP_DIR}/package*.json .
RUN npm ci

COPY ./${APP_DIR} .