import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
});

@Injectable()
export default class AuthService {
  private cognito = new AWS.CognitoIdentityServiceProvider();
  async userFromJwt(jwt: string) {
    const params = {
      AccessToken: jwt,
    };

    return new Promise<AWS.CognitoIdentityServiceProvider.GetUserResponse>(
      (resolve, reject) => {
        this.cognito.getUser(params, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      },
    );
  }
}
