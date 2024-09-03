import axios from "axios";
import globals from "node-global-storage";
import AppError from "../utils/error.utils.js";

const bkashAuth = async (req, res, next) => {
  //   console.log(Object.getOwnPropertyNames(globals));

  globals.unsetValue("id_token");

  try {
    const { data } = await axios.post(
      process.env.bkash_grant_token_url,
      {
        app_key: process.env.bkash_api_key,
        app_secret: process.env.bkash_secret_key,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          username: process.env.bkash_username,
          password: process.env.bkash_password,
        },
      }
    );

    globals.setValue("id_token", data.id_token, { protected: true });

    next();
  } catch (error) {
    next(new AppError("Authentication failed: " + error.message, 401));
  }
};

export default bkashAuth;
