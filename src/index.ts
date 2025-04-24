import { Elysia } from "elysia";
import { ChatHandler } from "./chat";
import swagger from "@elysiajs/swagger";
import cors from "@elysiajs/cors";

const app = new Elysia()
  .use(swagger())
  .use(cors())
  .use(ChatHandler)



app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
