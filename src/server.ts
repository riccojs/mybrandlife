import app from "./app.js";
import http from "http";
const port = process.env.PORT || 3000;
const server = http.createServer(app);
import { init } from "./middelware/socket.js";

init(server);
server.listen(port, () => {
  console.log(`app is running http://localhost:${port}`);
});
