// 1. Create an interface representing a document in MongoDB.
interface IUser {
  email: string;
  password: string;
  isValidPassword: (password: string) => Promise<boolean>; // Custom method declaration
}

export default IUser;
