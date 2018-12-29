## Home Maid Mary

AWS IoT に接続されたデバイス向けにメッセージを Publish し、デバイスに指示を与えることができる Alexa Home Skill のための AWS Lambda。

### 構成

AWS IoT を Subscribe しているデバイスへ指示を出す形になる。Raspberry Pi へ指示を出す場合は以下のような構成図になる

``` shell
Amazon Echo -(invoke)-> AWS Lambda -(Publish)-> AWS IoT <-(Subscribe)- Raspberry Pi --> ...
```

## 事前準備

### AWS リソース

事前に作成が必要な AWS リソースは以下。

- AWS IoT の モノ
- IAM Role

IAM Role は、AWS 管理ポリシーとして `AWSLambdaBasicExecutionRole`、インラインポリシーとして以下をアタッチする。

``` json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "iot:Publish",
      "Resource": "arn:aws:iot:us-west-2:<user-id>:topic/<Pub/Sub したい topic の名前>/*"
    }
  ]
}
```

### Alexa Skill

Amazon Developer Console から　Alexa Skill を作成しておく。

### 設定ファイル

`./config.template.yml` を参考に、`config.yml` を作成する。

- `applicationId`: Alexa Skill の ID
- `role`: Lambda にアタッチするロール
- `awsIotEndpoint`: AWS IoT のモノのエンドポイント
- `topic`: Pub/Sub したい topic の名前

```yaml
applicationId: amzn1.ask.skill.xxxxxxxx-yyyy-zzzz-xxxx-yyyyyyyyyyyy
role: arn:aws:iam::xxxxxxxxxxxx:role/lambda_my-alexa-home-skill
awsIotEndpoint: xxxxxxxxxxxxx-yyy.iot.us-west-2.amazonaws.com
topic: test/pub
```

## デプロイ

``` shell
$ serverless deploy -v
```
