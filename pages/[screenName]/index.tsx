import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Switch,
  Text,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { TriangleDownIcon } from '@chakra-ui/icons';
import { GetServerSideProps, NextPage } from 'next';
import ResizeTextarea from 'react-textarea-autosize';
import { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import { ServiceLayout } from '@/components/service_layout';
import { useAuth } from '@/contexts/auth_user.context';
import { InAuthUser } from '@/models/in_auth_user';
import MessageItem from '@/components/message_item';
import { InMessage } from '@/models/message/in_message';

interface Props {
  userInfo: InAuthUser | null;
  screenName: string;
}

async function postMessage({
  uid,
  message,
  author,
}: {
  uid: string;
  message: string;
  author?: {
    displayName: string;
    photoURL?: string;
  };
}) {
  if (message.length <= 0) {
    return {
      result: false,
      message: '메시지를 입력해주세요',
    };
  }
  try {
    await fetch('/api/messages.add', {
      method: 'post',
      // 내용이 json 형식으로 간다고 특정하기
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        uid,
        message,
        author,
      }),
    });
    return {
      result: true,
    };
  } catch (err) {
    console.error(err);
    return {
      result: false,
      message: '메시지 등록 실패',
    };
  }
}

const UserHomePage: NextPage<Props> = function ({ userInfo, screenName }) {
  const [message, setMessage] = useState('');
  const [isAnonymous, setAnonymous] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [messageList, setMessageList] = useState<InMessage[]>([]);
  // 리프레쉬 트리거
  const [messageListFetchTrigger, setMessageListFetchTrigger] = useState(false);
  const toast = useToast();
  const { authUser } = useAuth();

  // useQuery로 대신사용
  // async function fetchMessageList(uid: string) {
  //   try {
  //     const resp = await fetch(`/api/messages.list?uid=${uid}&page=${page}&size=10`);
  //     if (resp.status === 200) {
  //       const data: {
  //         totalElements: number;
  //         totalPages: number;
  //         page: number;
  //         size: number;
  //         content: InMessage[];
  //       } = await resp.json();
  //       setTotalPages(data.totalPages);
  //       setMessageList((prev) => [...prev, ...data.content]);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  async function fetchMessageInfo({ uid, messageId }: { uid: string; messageId: string }) {
    try {
      const resp = await fetch(`/api/messages.info?uid=${uid}&messageId=${messageId}`);
      if (resp.status === 200) {
        const data: InMessage = await resp.json();
        setMessageList((prev) => {
          const findIndex = prev.findIndex((fv) => fv.id === data.id);
          if (findIndex >= 0) {
            const updateArr = [...prev];
            updateArr[findIndex] = data;
            return updateArr;
          }
          return prev;
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  const messageListQueryKey = ['messageList', userInfo?.uid, page, messageListFetchTrigger];
  useQuery(
    messageListQueryKey,
    async () =>
      //eslint-disable-next-line no-return-await
      await axios.get<{
        totalElements: number;
        totalPages: number;
        page: number;
        size: number;
        content: InMessage[];
      }>(`/api/messages.list?uid=${userInfo?.uid}&page=${page}&size=10`),
    {
      keepPreviousData: true, // 기존 데이터 유지
      refetchOnWindowFocus: false, // refetch 시키지 않음
      onSuccess: (data) => {
        // 데이터를 받아오고 어떤 처리를 할지
        setTotalPages(data.data.totalPages);
        // 중복키를 가진 경우 그 내용 제거 => 1페이지인 경우 기존정보 사용하지 않기
        if (page === 1) {
          setMessageList([...data.data.content]);
          return;
        }
        setMessageList((prev) => [...prev, ...data.data.content]); // 기존 값과 비교해서 넣기
      },
    },
  );

  // useQuery로 대신사용
  // useEffect(() => {
  //   if (userInfo === null) return;
  //   fetchMessageList(userInfo.uid);
  // }, [userInfo, messageListFetchTrigger, page]);

  if (userInfo === null) {
    return <p>사용자를 찾을 수 없습니다.</p>;
  }
  const isOwner = authUser !== null && authUser.uid === userInfo.uid;
  return (
    <ServiceLayout title={`${userInfo.displayName}의 홈`} minH="100vh" backgroundColor="gray.50">
      <Box maxW="md" mx="auto" pt="6">
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" mb="2" bg="white">
          <Flex p="6">
            <Avatar size="lg" src={userInfo.photoURL ?? 'https://bit.ly/broken-link'} mr="2" />
            <Flex direction="column" justify="center">
              <Text fontSize="md">{userInfo.displayName}</Text>
              <Text fontSize="xs">{userInfo.email}</Text>
            </Flex>
          </Flex>
        </Box>
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" mb="2" bg="white">
          <Flex align="center" p="2">
            <Avatar
              size="xs"
              src={isAnonymous ? 'https://bit.ly/broken-link' : authUser?.photoURL ?? 'https://bit.ly/broken-link'}
              // isAnonymous면 원래 이미지, 아니면 authUser의 photoURL. 값이 존재하지 않으면 원래 이미지
              mr="2"
            />
            {/** anonymous 이미지처럼 나온다*/}
            <Textarea
              bg="gray.100"
              border="none"
              placeholder="무엇이 궁금한가요?"
              resize="none"
              minH="unset"
              overflow="hidden"
              fontSize="xs"
              mr="2"
              maxRows={7}
              as={ResizeTextarea}
              value={message}
              onChange={(e) => {
                if (e.currentTarget.value) {
                  const lineCount = (e.currentTarget.value.match(/[^\n]*\n[^\n]*/gi)?.length ?? 1) + 1;
                  // 8줄에 들어가서 경고 메시지가 뜨는 게 아닌, 7줄에서 엔터를 누르면 바로 경고를 띄우기 위해 +1를 함.
                  if (lineCount > 7) {
                    toast({
                      title: '최대 7줄까지만 입력 가능합니다.',
                      position: 'top-right',
                    });
                    return;
                  }
                }
                setMessage(e.currentTarget.value);
              }}
            />
            <Button
              disabled={message.length === 0}
              bgColor="#FFB86C"
              color="white"
              colorScheme="yellow"
              variant="solid"
              size="sm"
              onClick={async () => {
                const postData: {
                  message: string;
                  uid: string;
                  author?: {
                    displayName: string;
                    photoURL?: string;
                  };
                } = {
                  message,
                  uid: userInfo.uid,
                };
                if (isAnonymous === false) {
                  postData.author = {
                    photoURL: authUser?.photoURL ?? 'https://bit.ly/broken-link',
                    displayName: authUser?.displayName ?? 'anonymous',
                  };
                }
                // 메시지 등록 response
                const messageResp = await postMessage(postData);
                if (messageResp.result === false) {
                  toast({ title: '메시지 등록 실패', position: 'top-right' });
                }
                // 등록 후 입력창 리셋
                setMessage('');
                setPage(1);
                // 페이지 먼저 변경된 후, 50밀리세컨드 이후 messageList 조회
                setTimeout(() => {
                  setMessageListFetchTrigger((prev) => !prev);
                }, 50);
              }}
            >
              등록
            </Button>
          </Flex>
          <FormControl display="flex" alignItems="center" mt="1" mx="2" pb="2">
            {/*Anonymous 변경 값을 Switch로 받아줌 */}
            <Switch
              size="sm"
              colorScheme="orange"
              id="anonymous"
              mr="1"
              isChecked={isAnonymous}
              onChange={() => {
                if (authUser === null) {
                  toast({ title: '로그인이 필요합니다.', position: 'top-right' });
                  return;
                }
                setAnonymous((prev) => !prev);
              }}
            />
            <FormLabel htmlFor="anonymous" mb="0" fontSize="xx-small">
              Anonymous
            </FormLabel>
          </FormControl>
        </Box>
        <VStack spacing="12px" mt="6">
          {messageList.map((messageData) => (
            <MessageItem
              key={`message-item-${userInfo.uid}-${messageData.id}`}
              item={messageData}
              uid={userInfo.uid}
              screenName={screenName}
              displayName={userInfo.displayName ?? ''}
              photoURL={userInfo.photoURL ?? 'https://bit.ly/broken-link'}
              isOwner={isOwner}
              onSendComplete={() => {
                fetchMessageInfo({ uid: userInfo.uid, messageId: messageData.id });
              }}
            />
          ))}
        </VStack>
        {totalPages > page && (
          <Button
            width="full"
            mt="2"
            fontSize="sm"
            leftIcon={<TriangleDownIcon />}
            onClick={() => {
              setPage((p) => p + 1);
            }}
          >
            더보기
          </Button>
        )}
      </Box>
    </ServiceLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const { screenName } = query; //query에서 screenName 꺼내기
  // screenName이 없으면 null로 반환
  if (screenName === undefined) {
    return {
      props: {
        userInfo: null,
        screenName: '',
      },
    };
  }
  const screenNameToStr = Array.isArray(screenName) ? screenName[0] : screenName;
  // 실제로 정보 얻는 부분
  try {
    const protocol = process.env.PROTOCOL || 'http';
    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || '3000';
    const baseUrl = `${protocol}://${host}:${port}`;
    const userInfoResp: AxiosResponse<InAuthUser> = await axios(`${baseUrl}/api/user.info/${screenName}`);
    // 서버사이드에서 동작을 하기 때문에 클라이언트 사이드에서처럼 fetch를 사용할 수 없음
    //  => node.js에서 사용하는 api call 라이브러리나 다른 것들을 사용해야 함 ex) axios
    // 서버사이드이기 때문에 슬래시로 하면 어디에 요청을 해야할지 모름 => baseUrl 만들기!
    return {
      props: {
        userInfo: userInfoResp.data ?? null,
        screenName: screenNameToStr,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      props: {
        userInfo: null,
        screenName: '',
      },
    };
  }
};

export default UserHomePage;
