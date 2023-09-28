// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import Chromium from 'chrome-aws-lambda';
import playwright from 'playwright-core';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const localChromePath = process.env.NODE_ENV !== 'development' ? '' : process.env.LOCAL_CHROME_PATH ?? '';
  if (process.env.NODE_ENV !== 'development') {
    // 디벨롭이 아닌 프로덕션 환경이라면 pretendard.ttf 파일을 가져와야함 => host, path가 필요
    const protocol = process.env.PROTOCOL || 'http';
    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || '3000';
    const baseUrl = `${protocol}://${host}:${port}`;
    await Chromium.font(`${baseUrl}/Pretendard-Regular.ttf`);
  }
  const browser = await playwright.chromium.launch({
    args: Chromium.args,
    executablePath: process.env.NODE_ENV !== 'development' ? await Chromium.executablePath : localChromePath,
    headless: process.env.NODE_ENV !== 'development' ? Chromium.headless : true,
  });

  const page = await browser.newPage({
    viewport: {
      width: 1200,
      height: 675,
    },
  });

  const url = req.query.url as string;

  // 어느 페이지로 이동할지
  await page.goto(url);

  const data = await page.screenshot({
    type: 'jpeg',
  });

  await browser.close();

  // 오랜 기간동안 유지할 수 있도록
  res.setHeader('Cache-Control', 's-maxage=31536000, public'); // 31,536,000초 = 365일
  res.setHeader('Content-Type', 'image/jpeg');
  res.end(data);
}
