import CustomServerError from './custom_server_error';

export default class BadReqError extends CustomServerError {
  //                            CustomServerError를 기준으로 확장
  constructor(message: string) {
    super({ statusCode: 400, message });
  }
}
