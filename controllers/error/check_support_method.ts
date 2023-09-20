import BadReqError from './bad_request_error';

export default function checkSupportMethod(supportMethod: string[], method?: string) {
  //indexOf는 찾아지지 않으면 -1을 출력함
  if (supportMethod.indexOf(method!) === -1) {
    //에러 반환
    throw new BadReqError('지원하지 않는 method');
  }
}
