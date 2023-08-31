import { Box, Button, Flex, Spacer } from '@chakra-ui/react';
import { useAuth } from '@/contexts/auth_user.context';

const GNB = function () {
  //context에서 값을 뽑아냄
  const { loading, authUser, signOut, signInWithGoogle } = useAuth();

  const loginBtn = (
    <Button
      fontSize="sm"
      fontWeight={600}
      color="white"
      bg="pink.400"
      _hover={{
        bg: 'pink.300',
      }}
      onClick={signInWithGoogle}
    >
      로그인
    </Button>
  );
  const logoutBtn = (
    <Button as="a" fontWeight={400} variant="link" onClick={signOut}>
      로그아웃
    </Button>
  );

  // auth가 로딩중이거나 authUser값이 null이면 initialized
  const authInitialized = loading || authUser === null;

  return (
    <Box borderBottom={1} borderStyle="solid" borderColor="gray.200" bg="white">
      {/* 가로로 나열되게끔 flex */}
      <Flex minH="60px" py={{ base: 2 }} px={{ base: 4 }} align="center" maxW="md" mx="auto">
        {/*Spacer: 공간 차지*/}
        <Spacer />
        {/*flex='1' 설정해서 사이즈 맞추기*/}
        <Box flex="1">
          <img style={{ height: '40px' }} src="/logo.svg" alt="logo" />
        </Box>
        <Box justifyContent="flex-end">{authInitialized ? loginBtn : logoutBtn}</Box>
      </Flex>
    </Box>
  );
};

export default GNB;
