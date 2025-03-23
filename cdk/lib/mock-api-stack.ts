import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import dedent from "dedent";

export class MockApiStack extends cdk.Stack {
  public readonly apiGw: apigateway.RestApi;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // APIGateway作成
    this.apiGw = new apigateway.RestApi(this, "MockAPIGateway", {
      restApiName: "mock-api",
      endpointTypes: [apigateway.EndpointType.REGIONAL],
      deployOptions: {
        stageName: "v1",
      },
    });

    // GET API 作成

    // リクエストテンプレート
    // クッキーの値やリクエストパラメータを使用してどの統合レスポンスに渡すかを決める事ができる
    const getUserInfoRequestTemplate = dedent`
    #set($cookieUserNumber = $input.params().header.get('Cookie').replaceAll("userNumber=", ""))
    #set($paramUserNumber= $input.params('userNumber'))
    #if(($cookieUserNumber ==  "123") || ($paramUserNumber == 123) )
    {
        "statusCode": 200
    }
    #else
    {
        "statusCode": 400
    }
    #end
    `;

    // 成功時レスポンステンプレート
    // クッキーの値やリクエストパラメータの値をレスポンスボディに使用することができる
    const getUserInfoSuccessResponseTemplate = dedent`
    #set($cookieUserNumber = $input.params().header.get('Cookie').replaceAll("userNumber=", ""))
    #set($paramUserNumber = $input.params('userNumber'))
    #if($paramUserNumber ==  123)
    {
        common: {
            statusCode: 200,
            message: "",
        },
        result: {
            userNumber: $paramUserNumber,
            userName: "テスト太郎",
        }
    }
    #else
    {
        common: {
            statusCode: 200,
            message: "",
        },
        result: {
            userNumber: "123",
            userName: "テスト太郎"
        }
    }
    #end
    `;

    // 失敗時レスポンステンプレート
    const getUserInfoErrorResponseTemplate = dedent`
    {
        common: {
            statusCode: 400,
            message: "ユーザ情報取得に失敗しました。",
        },
        result: {}
    }
    `;

    // /user/infoに対応するリクエストパスを作成
    const user = this.apiGw.root.addResource("user");
    const info = user.addResource("info");

    // /user/infoに対してGETメソッドのAPIを設定
    info.addMethod(
      "GET",
      new apigateway.MockIntegration({
        // 統合リクエストの設定値
        requestTemplates: {
          "application/json": getUserInfoRequestTemplate,
        },

        // 統合レスポンスの設定値
        integrationResponses: [
          {
            statusCode: "200",
            responseParameters: {
              "method.response.header.Set-Cookie":
                "integration.response.header.Set-Cookie",
            },
            responseTemplates: {
              "application/json": getUserInfoSuccessResponseTemplate,
            },
          },
          {
            selectionPattern: "400",
            statusCode: "400",
            responseParameters: {
              "method.response.header.Set-Cookie":
                "integration.response.header.Set-Cookie",
            },
            responseTemplates: {
              "application/json": getUserInfoErrorResponseTemplate,
            },
          },
        ],
      }),
      // メソッドレスポンスの設定値
      {
        methodResponses: [
          {
            statusCode: "200",
            responseParameters: {
              "method.response.header.Set-Cookie": true,
            },
          },
          {
            statusCode: "400",
            responseParameters: {
              "method.response.header.Set-Cookie": true,
            },
          },
        ],
      }
    );

    // POST API 作成

    // リクエストテンプレート
    // POSTではリクエストボディを使用してどの統合レスポンスに渡すかを決める事もできる
    // デフォルトではリクエストボディは統合レスポンスに渡されないため、値を使用するためには明示的にオーバーライドする
    const postUserInfoRequestTemplate = dedent`
    #set($context.requestOverride.path.body = $input.body)
    #set($cookieUserNumber = $input.params().header.get('Cookie').replaceAll("userNumber=", ""))
    #set($bodyUserName= $util.parseJson($input.body).userName)
    #if(($cookieUserNumber.length() > 0) && ($bodyUserName.length() > 0))
    {
        "statusCode": 200
    }
    #else
    {
        "statusCode": 400
    }
    #end
    `;

    // 成功時レスポンステンプレート
    // リクエストボディをレスポンスボディの値に使用することもできる
    // 統合リクエストから$context.requestOverride.path.bodyとしてリクエストボディが渡される
    const postUserInfoSuccessResponseTemplate = dedent`
    #set($body = $context.requestOverride.path.body)
    #set($cookieUserNumber = $input.params().header.get('Cookie').replaceAll("userNumber=", ""))
    #set($bodyUserName = $util.parseJson($body).userName)
    {
        common: {
            statusCode: 200,
            message: "",
        },
        result: {
            userNumber: $cookieUserNumber,
            userName: $bodyUserName,
        }
    }
    `;

    // 失敗時レスポンステンプレート
    const postUserInfoErrorResponseTemplate = dedent`
    {
        common: {
            statusCode: 400,
            message: "ユーザ情報登録に失敗しました。",
        },
        result: {}
    }
    `;

    // /user/infoに対してPOSTメソッドのAPIを設定
    info.addMethod(
      "POST",
      new apigateway.MockIntegration({
        // 統合リクエストの設定値
        requestTemplates: {
          "application/json": postUserInfoRequestTemplate,
        },

        // 統合レスポンスの設定値
        integrationResponses: [
          {
            statusCode: "200",
            responseParameters: {
              "method.response.header.Set-Cookie":
                "integration.response.header.Set-Cookie",
            },
            responseTemplates: {
              "application/json": postUserInfoSuccessResponseTemplate,
            },
          },
          {
            selectionPattern: "400",
            statusCode: "400",
            responseParameters: {
              "method.response.header.Set-Cookie":
                "integration.response.header.Set-Cookie",
            },
            responseTemplates: {
              "application/json": postUserInfoErrorResponseTemplate,
            },
          },
        ],
      }),
      // メソッドレスポンスの設定値
      {
        methodResponses: [
          {
            statusCode: "200",
            responseParameters: {
              "method.response.header.Set-Cookie": true,
            },
          },
          {
            statusCode: "400",
            responseParameters: {
              "method.response.header.Set-Cookie": true,
            },
          },
        ],
      }
    );
  }
}
