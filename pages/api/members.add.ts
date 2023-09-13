// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';
import FirebaseAdmin from '@/models/firebase_admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { uid, email, displayName, photoURL } = req.body; // 정보가 body 안에 들어있음
  if (uid === undefined || uid === null) {
    return res.status(400).json({ result: false, message: 'uid가 누락되었습니다.' });
  }
  if (email === undefined || email === null) {
    return res.status(400).json({ result: false, message: 'email이 누락되었습니다.' });
  }

  try {
    //     두가지 모두 동시에 처리하기 위해 transaction을 사용한 밑에 있는 코드로 변경
    // // promise이므로 비동기 처리 => await
    // // function 앞에 async 써야함
    // const addResult = await FirebaseAdmin.getInstance()
    //   .Firebase.collection('members')
    //   // .set 대신 .add를 하면 uid와 다른 값으로 자동 생성되기 때문에 쿼리를 해서 찾아야함
    //   // .doc으로 문서 특정하고, add를 set으로 변경
    //   // add: 추가를 하면 특정 key로 나올 수 있게 바로 반환해줌
    //   .doc(uid)
    //   .set({
    //     uid,
    //     email,
    //     //??: 완전히 존재하지 않는다는 뜻
    //     displayName: displayName ?? '',
    //     photoURL: photoURL ?? '',
    //   });
    // const screenName = (email as string).replace('@gmail.com', '');
    // await FirebaseAdmin.getInstance()
    //   .Firebase.collection('screen_names')
    //   .doc(screenName)
    //   .set({
    //     uid,
    //     email,
    //     displayName: displayName ?? '',
    //     photoURL: photoURL ?? '',
    //   });
    const screenName = (email as string).replace('@gmail.com', '');
    const addResult = await FirebaseAdmin.getInstance().Firebase.runTransaction(async (transaction) => {
      const memberRef = FirebaseAdmin.getInstance().Firebase.collection('members').doc(uid);
      const screenNameRef = FirebaseAdmin.getInstance().Firebase.collection('screen_names').doc(screenName);
      const memberDoc = await transaction.get(memberRef);
      if (memberDoc.exists) {
        //이미 추가된 상태
        return false;
      }
      const addData = {
        uid,
        email,
        displayName: displayName ?? '',
        photoURL: photoURL ?? '',
      };
      await transaction.set(memberRef, addData);
      await transaction.set(screenNameRef, addData);
      return true;
    });
    if (addResult === false) {
      return res.status(201).json({ result: true, id: uid });
    }
    return res.status(200).json({ result: true, id: uid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ result: false });
  }
}
