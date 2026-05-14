export default class UserSocketController {
  constructor({ userModel }) {
    this.userModel = userModel;
  }

  login = async (userId) => {
    try {
      await this.userModel.login(userId);
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  logout = async (userId) => {
    try {
      await this.userModel.logout(userId);
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };
}
