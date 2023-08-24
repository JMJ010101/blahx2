import { Box, Button } from '@chakra-ui/react';

interface Props {
  onClick: () => void;
}
//JS 함수의 특별함
//JavaScript의 함수는 일급 객체(또는 "일급 시민")입니다.
//변수에 할당, 함수 인수로 전달, 함수에서 반환이 가능합니다.

export const GoogleLoginButton = function ({ onClick }: Props) {
  return (
    <Box>
      <Button
        size="lg"
        width="full"
        mx="6"
        maxW="md"
        borderRadius="full"
        bgColor="#4285f4"
        color="white"
        colorScheme="blue"
        leftIcon={<img src="/google.svg" alt="구글 로고" style={{ backgroundColor: 'white', padding: '8px' }} />}
        onClick={onClick}
      >
        Google 계정으로 시작하기
      </Button>
    </Box>
  );
};
