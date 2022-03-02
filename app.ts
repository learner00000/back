import { Application } from "./deps.ts"; 
import router from "./router.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
// import { stockSave , stockLoad } from "./middleware/stockMiddleware.ts";
import { stockSave  } from "./middleware/stockMiddleware.ts";


const app = new Application();

app.addEventListener("listen", ({ hostname, port, secure }) => {
  console.log(
    `Listening on: ${secure ? "https://" : "http://"}${hostname ??
      "localhost"}:${port}`,
  );
});

app.addEventListener("error", (evt) => {
  console.log(evt.error);
});

stockSave();
// stockLoad();


app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
