import { createServer } from "./presentation/server";

const PORT = process.env.PORT ?? 3001;

const app = createServer();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
