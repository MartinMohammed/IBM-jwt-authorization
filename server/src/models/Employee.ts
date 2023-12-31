import { CallbackError, HydratedDocument, Schema, model } from "mongoose";
import IEmployee from "../customTypes/Employee";
import logger from "../logger";
import bycrypt from "bcrypt";
import bHash from "../utils/bHash";

// 2. Create a Schema corresponding to the document interface.
const EmployeeSchema = new Schema<IEmployee>({
  email: { type: String, required: true, lowercase: true, unique: true },
  password: { type: String, required: true, min: 4 },
});

// Define the pre-save middleware function
EmployeeSchema.pre("save", async function (next) {
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
      `An error occurred in the pre-save middleware while trying to hash the user's password.`
    );
    // Call `next()` with the error to stop the saving process
    next(error as CallbackError);
  }
});

/** Add custom methods to the UserSchema  */
EmployeeSchema.methods.isValidPassword = async function (
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
const Employee = model<IEmployee>("employee", EmployeeSchema);
export default Employee;
