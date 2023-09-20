import { NextApiRequest, NextApiResponse } from 'next';
import MemberModel from '@/models/member/member.model';
import BadReqError from './error/bad_request_error';

async function add(req: NextApiRequest, res: NextApiResponse) {
  const { uid, email, displayName, photoURL } = req.body; // 정보가 body 안에 들어있음
  if (uid === undefined || uid === null) {
    // return res.status(400).json({ result: false, message: 'uid가 누락되었습니다.' });
    throw new BadReqError('uid가 누락되었습니다.');
    // class이기 때문데 new를 사용해야 함
  }
  if (email === undefined || email === null) {
    // return res.status(400).json({ result: false, message: 'email이 누락되었습니다.' });
    throw new BadReqError('email이 누락되었습니다.');
  }

  const addResult = await MemberModel.add({ uid, displayName, email, photoURL });
  if (addResult.result === true) {
    return res.status(200).json(addResult);
  }
  res.status(500).json(addResult);
}

const MemberCtrl = {
  add,
};

export default MemberCtrl;
