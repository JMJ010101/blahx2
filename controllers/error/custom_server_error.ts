export default class CustomServerError extends Error {
  //                                  error를 상속받음
  public statusCode: number;
  // 200, 400, 500 등 어떠한 statusCode를 항상 특정해서 반환하고 있기 때문 (서버 사이드 에러)

  public location?: string;
  // 300번대 에러일 때 redirection하기 위해서

  constructor({ statusCode = 500, message, location }: { statusCode?: number; message: string; location?: string }) {
    super(message); //super 키워드를 이용하여 error 쪽에 메시지 전달
    this.statusCode = statusCode;
    this.location = location;
  }

  //  에러 처리를 할 때 동일하게 어떤 에러가 났는지 문자열로 찍어줄수 있도록
  serializeErrors(): { message: string } | string {
    return { message: this.message };
  }
}
