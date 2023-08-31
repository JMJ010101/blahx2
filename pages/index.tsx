import { NextPage } from 'next';
import { Box, Center, Flex, Heading } from '@chakra-ui/react';
import { ServiceLayout } from '@/components/service_layout';
import { GoogleLoginButton } from '@/components/google_login_button';
import { useAuth } from '@/contexts/auth_user.context';

//const IndexPage: NextPage = () => <>Hello world</>
const IndexPage: NextPage = function () {
  // signInWithPopup(FirebaseClient.getInstance().Auth, provider);
  // 이렇게 작성하면 상시 반응하므로 클릭시에만 반응하게 하기위해 로그인 버튼 수정
  const { signInWithGoogle, authUser } = useAuth();
  console.info(authUser);
  return (
    <ServiceLayout title="test">
      <Box maxW="md" mx="auto">
        {/*chakra-ui에서 제공하는 가장 기본적인 레이아웃. html로 치면 div*/}
        <img src="/main_logo.svg" alt="메인 로고" />
        <Flex justify="center">
          {/* 가운데 정렬 */}
          <Heading>#BlahBlah</Heading>
        </Flex>
      </Box>
      <Center mt="20">
        <GoogleLoginButton onClick={signInWithGoogle} />
      </Center>
    </ServiceLayout>
  );
};

export default IndexPage;
