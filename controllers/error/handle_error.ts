import { NextApiResponse } from 'next';
import CustomServerError from './custom_server_error';

const handleError = (err: unknown, res: NextApiResponse) => {
  // member.add 파일의 catch 구문에서 에러를 unknown으로 넘김 => 확인하는 과정을 거쳐야함
  // NextApiResponse를 사용하여 바로 반환
  let unknownErr = err;
  //에러 할당
  if (err instanceof CustomServerError === false) {
    // 에러가 instanceof로 CustomServerError인지 확인 / 예외처리로 꺼내는 게 편함 => 이게 아닐 경우에 다른 처리를 하는 것이 편함
    unknownErr = new CustomServerError({ statusCode: 499, message: 'unknown error' });
    // false일 경우 CustomServerError를 새로 발생시킴. 임의로 알 수 없는 499라고 표시
  }
  const customError = unknownErr as CustomServerError;
  // 타입캐스팅을 해서 바로 사용
  res
    .status(customError.statusCode)
    .setHeader('location', customError.location ?? '')
    .send(customError.serializeErrors()); // 에러 응답에 body를 전달
};

export default handleError;
