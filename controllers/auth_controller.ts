import {
  create, verify, decode, getNumericDate, RouterContext, hashSync, compareSync
} from "../deps.ts";
import { userCollection } from "../mongo.ts";
import User from "../models/user.ts";

export class AuthController {
  async signup(ctx: RouterContext) {
    const  { email, password }  = await ctx.request.body().value; 
   // const result = await ctx.request.body({ type: "json" }).value;


    let user = await User.findOne({ email });
    if (user) {
      ctx.response.status = 422;
      ctx.response.body = { message: "Email is already exist" };
      return ;
    }
    const hashedPassword = hashSync(password);
    user = new User({  email, password: hashedPassword });
    await user.save(user);

    const key = await crypto.subtle.generateKey(
      { name: "HMAC", hash: "SHA-512" },
      true,
      ["sign", "verify"],
    );

    const jwt = await create( { 
      alg: "HS512",
      typ: "JWT",
    }, {
      iss: user.email,
      exp: getNumericDate(
        Date.now() + parseInt(Deno.env.get("JWT_EXP_DURATION") || "0"))
    },
    key
    );

    ctx.response.status = 201;
    // ctx.response.headers = {  "Access-Control-Allow-Origin": "*", // Required for CORS support to work
    // "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
    // "Access-Control-Allow-Headers": "Origin,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,locale",
    // "Access-Control-Allow-Methods": "POST, OPTIONS"};
    ctx.response.body = {
      id: user.id,
      name: user.name,
      email: user.email,
      password : user.password,
      idToken: jwt,
      expiresIn:  getNumericDate(
        Date.now() + parseInt(Deno.env.get("JWT_EXP_DURATION") || "0"))

    };
    console.log(Response);

  }
  async login(ctx: RouterContext) {
    const { email, password }  = await ctx.request.body().value;
    if (!email || !password) {
      ctx.response.status = 422;
      ctx.response.body = { message: "Please provide email and password" };
      return;
    }
    let user = await User.findOne({ email });
    if (!user) {
      ctx.response.status = 422;
      ctx.response.body = { message: "Incorrect email" };
      return;
    }
    if (!compareSync(password, user.password)) {
      ctx.response.status = 422;
      ctx.response.body = { message: "Incorrect password" };
      return;
    }

    const key = await crypto.subtle.generateKey(
      { name: "HMAC", hash: "SHA-512" },
      true,
      ["sign", "verify"],
    );

    const jwt = await create( { 
      alg: "HS512",
      typ: "JWT",
    }, {
      iss: user.email,
      exp: getNumericDate(
        Date.now() + parseInt(Deno.env.get("JWT_EXP_DURATION") || "0"))
    },
    key
    );

    ctx.response.body = {
      id: user.id,
      name: user.name,
      email: user.email,
      idToken: jwt,
      expiresIn:  getNumericDate(
        Date.now() + parseInt(Deno.env.get("JWT_EXP_DURATION") || "0"))

    };
  }
}

export default new AuthController();
