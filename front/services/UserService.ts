import $api from "@/http";

export  class UserService {
  static async fetchUsers() {
    return $api.get("/users");
  }
}
