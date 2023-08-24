import Head from 'next/head';

// const ServiceLayout = function ({title = 'blahx2', children}:{title: string; children: React.ReactNode})
//      ==> 이렇게 하면 너무 장황해지므로 상단에 interface로 빼줌.
interface Props {
  //주어지는 것들은 props라고 부름.
  title: string;
  children: React.ReactNode;
}

export const ServiceLayout = function ({ title = 'blah x2', children }: Props) {
  //title이라는 값을 가지는 function
  //children: component 하부에 nested 구조로 딸려오는 모든 컴포넌트를 뜻함
  return (
    <div>
      <Head>
        {/* next header: html 상단에 들어가는 meta들의 정보를 가진 부분 */}
        <title>{title}</title>
      </Head>
      {children}
    </div>
  );
};
