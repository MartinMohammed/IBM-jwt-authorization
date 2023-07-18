import { CallbackError, HydratedDocument, Schema, model } from "mongoose";
import IUser from "../customTypes/User";
import logger from "../logger";
import bycrypt from "bcrypt";
import bHash from "../utils/bHash";

// 2. Create a Schema corresponding to the document interface.
const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, lowercase: true, unique: true },
  password: { type: String, required: true },
});

// Define the pre-save middleware function
UserSchema.pre("save", async function (next) {
  // `this` refers to the document being saved

  try {
    // Generate a hash.
    this.password = await bHash(this.password, 12);

    // Call `next()` to continue with the saving process
    next();
  } catch (error) {
    // Handle any errors that occurred during the pre-save middleware
    // ...

    logger.error(
      `A error occurred in the pre-save middleware trying to hash the password of the user.`
    );
    // Call `next()` with the error to stop the saving process
    next(error as CallbackError);
  }
});

/** Add custom methods to the UserSchema  */
UserSchema.methods.isValidPassword = async function (
  password: string
): Promise<boolean> {
  /** Extract the generated salt in the password hash and the workload rounds. */
  try {
    const result = await bycrypt.compare(password, this.password);
    return result;
  } catch (error) {
    throw error;
  }
};

// 3. Create a Model.
const User = model<IUser>("user", UserSchema);
export default User;
