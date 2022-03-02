import { RouterContext, verify } from "../deps.ts";
import User from "../models/user.ts";

export const authMiddleware = async (ctx: RouterContext, next: Function) => {
  const headers = ctx.request.headers;

  const authHeader = headers.get("Authorization");
  if (!authHeader) {
    ctx.response.status = 401;
    return;
  }
  const jwt = authHeader.split(" ")[1];
  if (!jwt) {
    ctx.response.status = 401;
    return;
  }
  const key = await crypto.subtle.generateKey(
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"],
  );
  const payload = await verify(
    jwt,
    key
    //Deno.env.get("JWT_SECRET_KEY") || "",
    //{ isThrowing: false },
  );
  if (payload) {
    const user = await User.findOne({ email: payload?.iss });
    ctx.state.user = user;
    await next();
  } else {
    ctx.response.status = 401;
  }
};
