import service from "..";
//获取歌单详情页的数据
export function loginFormPost() {
  return service({
    method: "POST",
    url: `/user`,
  });
}
