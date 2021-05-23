import init from './config/express.js';
import config from "./config/config.js";

const app = init();

app.listen(config.port, () => console.log(`App now listening on port ${config.port}`));
