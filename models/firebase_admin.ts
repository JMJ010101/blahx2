import * as admin from 'firebase-admin';
//firebase-admin에 있는 모든 것을 admin이라는 이름으로  import

interface Config {
  //Config라는 interface 정의
  //interface는 typescript에서 사용하는 명세?
  credential: {
    privateKey: string;
    clientEmail: string;
    projectId: string;
  };
}

export default class FirebaseAdmin {
  //외부에서 사용할 수 있게 빼냄
  public static instance: FirebaseAdmin; //FirebaseAdmin을 그대로 받음

  private init = false; //초기화 여부 확인

  public static getInstance(): FirebaseAdmin {
    //public static으로 instance 생성. FirebaseAdmin 그대로 받아옴.
    if (FirebaseAdmin.instance === undefined || FirebaseAdmin.instance === null) {
      //초기화 진행
      FirebaseAdmin.instance = new FirebaseAdmin(); //instance에 Firebase를 만들어서 넣어줌. TODO로 넣어줌.
      //TODO: 환경을 초기화한다.
      FirebaseAdmin.instance.bootstrap();
    }
    return FirebaseAdmin.instance; //instance를 리턴.
    //getInstance라는 메서드에 접근하면 계속적으로 같은 인스턴스를 반환받을 수 있음.
  }

  //환경초기화 시 사용할 메서드
  private bootstrap(): void {
    //어플리케이션이 등록되어있는지 확인
    const haveApp = admin.apps.length !== 0; //앱이 존재
    if (haveApp) {
      this.init = true; //this에 init을 true로 할당하고
      return; //더이상 로직 진행 X
    }

    //config를 활용해서 초기화
    const config: Config = {
      //Config라는 인터페이스를 이용해서 config라는 객체 할당
      credential: {
        projectId: process.env.projectId || '', //env하면 환경변수를 그대로 갖다쓸 수 있음.
        clientEmail: process.env.clientEmail || '', //값이 없을 수도 있으므로 ''사용
        privateKey: (process.env.privateKey || '').replace(/\\n/g, '\n'),
        //텍스트를 변경해주는 replace 필요
        //개행문자를 실제 개행이 될 수 있도록 변경
      },
    };
    //사용
    admin.initializeApp({ credential: admin.credential.cert(config.credential) });
    //credential은 그냥 안들어감. 타입으로 받기 때문에 만들어줘야함.
    //cert라는 메서드에 config의 credential을 갖다 넣어주면 됨. => 초기화
    //line 26 추가
    console.info('bootstrap firebase admin');
  }

  /** firestore를 반환 */
  public get Firestore(): FirebaseFirestore.Firestore {
    //getter이용. fucntion처럼 생겼는데 실행할 때는 field처럼 실행.
    if (this.init === false) {
      this.bootstrap();
    }
    return admin.firestore();
  }

  public get Auth(): admin.auth.Auth {
    if (this.init === false) {
      this.bootstrap();
    }
    return admin.auth();
  }
}
