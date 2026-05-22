import * as http from 'http';
import { createController } from './controller';

const PORT = 3000;

const server = http.createServer(createController());

server.listen(PORT, () => {
  console.log(`Vehicle Appraisal Backend running on http://localhost:${PORT}`);
});