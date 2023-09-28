import { Box, Img } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import PrintText from '@/components/print_text';

const OpenGraphImgPage: NextPage = function () {
  // Next.js에서 제공되는 useRouter에서 query 파라미터를 가져올 수 있음
  const { query } = useRouter();
  const text = query.text ?? '';
  const printText = Array.isArray(text) ? text[0] : text;
  return (
    <Box width="full" bgColor="white" p="25px" pt="50px" borderRadius="lg">
      <PrintText printText={printText} />
      <Img src="/screenshot_bg.svg" alt="frame" />
    </Box>
  );
};

export default OpenGraphImgPage;
