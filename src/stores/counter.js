import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const userDid = ref("did:tdid:w1:0x7a4a2ae6212c4b8d7f7bc1da95b81b78fae7fdd2");

  // 设置用户名
  function setUserDid(did) {
    userDid.value=did
  }
  // function getUserDid() {
  //   return userDid.value
  // }
  return { userDid,setUserDid };
});
