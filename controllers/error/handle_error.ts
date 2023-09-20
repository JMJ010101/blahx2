import { NextApiResponse } from 'next';
import CustomServerError from './custom_server_error';

const handleError = (err: unknown, res: NextApiResponse) => {
  // member.add 파일의 catch 구문에서 에러를 unknown으로 넘김 => 확인하는 과정을 거쳐야함
  // NextApiResponse를 사용하여 바로 반환
  let unknownErr = err;
  //에러 할당
  if (err instanceof CustomServerError === false) {
    unknownErr = new CustomServerError({ statusCode: 499, message: 'unknown error' });
  }
  const customError = unknownErr as CustomServerError;
  res
    .status(customError.statusCode)
    .setHeader('location', customError.location ?? '')
    .send(customError.serializeErrors());
};

export default handleError;
