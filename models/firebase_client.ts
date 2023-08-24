import { getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
//next.config.js에서 가져옴

const FirebaseCredentials = {
  apiKey: publicRuntimeConfig.apiKey,
  authDomain: publicRuntimeConfig.authDomain,
  projectId: publicRuntimeConfig.projectId,
  //환경변수에 있는 내용들
};

export default class FirebaseClient {
  private static instance: FirebaseClient; //인스턴스로 FirebaseClient를 받음.

  private auth: Auth; //Auth를 전해줌.

  public constructor() {
    //constructor: 클래스의 인스턴스 객체를 생성하고 초기화하는 특별한 메서드.
    const apps = getApps(); //앱이 몇 개나 되어있는지 찾는 것
    if (apps.length === 0) {
      //앱이 이니셜라이즈 되어있지 않다면
      console.info('firebase client init start');
      initializeApp(FirebaseCredentials);
      //이니셜라이즈 진행
    }
    //할당하기
    this.auth = getAuth();
    console.info('firebase auth');
  }

  //FirebaseClient.getInstance를 하면 인스턴스 객체에 바로 액세스할 수 있음
  public static getInstance(): FirebaseClient {
    if (FirebaseClient.instance === undefined || FirebaseClient.instance === null) {
      FirebaseClient.instance = new FirebaseClient();
    }
    return FirebaseClient.instance;
  }

  //getter를 이용해서 auth를 계속적으로 이용할 수 있게
  public get Auth(): Auth {
    return this.auth;
  }
}
