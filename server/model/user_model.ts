import mongoose, { Document, Schema, Model } from "mongoose";

export interface user_type extends Document {
  user_name: string;
  email: string;
  password: string;
  is_verify: boolean;
  reset_pass_token?: string;
  reset_pass_token_expire?: Date;
  verify_token?: string;
  verify_token_expire?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface send_user_type extends Document {
  user_name: string;
  email: string;
  is_verify: boolean;
}

const user_schema: Schema<user_type> = new Schema({
  user_name: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  is_verify: {
    type: Boolean,
    default: false,
  },
  reset_pass_token: String,
  reset_pass_token_expire: Date,
  verify_token: String,
  verify_token_expire: Date,
});

const user_model: Model<user_type> = mongoose.model<user_type>(
  "User",
  user_schema
);

export default user_model;
