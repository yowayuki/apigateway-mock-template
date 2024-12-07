import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

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

    // Get API 作成

    // リクエストテンプレート
    // クッキーの値やリクエストパラメータを使用してどの統合レスポンスに渡すかを決める事ができる
    const getUserInfoRequestTemplate = `
    #set($cookieUserNumber = $input.params().header.get('Cookie'))
    #set($paramUserNumber= $input.params('userNumber'))
    #if(($cookieUserNumber ==  "userNumber=123") || ($paramUserNumber == 123) )
    {
        "statusCode": 200
    }
    #else
    {
        "statusCode": 400
    }
    #end
    `.trim();

    // 成功時レスポンステンプレート
    // クッキーの値やリクエストパラメータの値をレスポンスボディに使用することができる
    const getUserInfoSuccessResponseTemplate = `
    #set($cookieUserNumber = $input.params().header.get('Cookie'))
    #set($paramUserNumber = $input.params('userNumber'))
    #if($paramUserNumber ==  "userNumber=123")
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
    `.trim();

    // 失敗時レスポンステンプレート
    const getUserInfoErrorResponseTemplate = `
    {
        common: {
            statusCode: 400,
            message: "リクエストに失敗しました。",
        },
        result: {}
    }
    `.trim();

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
  }
}
