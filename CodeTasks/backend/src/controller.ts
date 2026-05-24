import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { AppraisalAction, UserRole } from './interfaces';
import {
  getAppraisal,
  performAction,
  resetAppraisal,
  updateFormData,
} from './appraisal.service';
import {
  listDocumentsByFin,
  getAppraisalReportPath,
} from './document.service';

function parseBody<T>(req: http.IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        resolve(JSON.parse(body) as T);
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: http.ServerResponse, status: number, data: unknown): void {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  });
  res.end(JSON.stringify(data));
}

export function createController(): http.RequestListener {
  return async (req, res) => {
    // CORS preflight
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      });
      res.end();
      return;
    }

    const url = req.url ?? '';
    const method = req.method ?? '';

    // GET /appraisal?role=CHECK_IN
    if (method === 'GET' && url.startsWith('/appraisal')) {
      const urlObj = new URL(url, 'http://localhost');
      const role = urlObj.searchParams.get('role') as UserRole | null;
      if (!role || !Object.values(UserRole).includes(role)) {
        sendJson(res, 400, { error: 'Missing or invalid role query parameter.' });
        return;
      }
      sendJson(res, 200, getAppraisal(role));
      return;
    }

    // POST /appraisal/action
    if (method === 'POST' && url === '/appraisal/action') {
      try {
        const body = await parseBody<{ action: AppraisalAction; role: UserRole }>(req);
        if (
          !body.action ||
          !body.role ||
          !Object.values(AppraisalAction).includes(body.action) ||
          !Object.values(UserRole).includes(body.role)
        ) {
          sendJson(res, 400, { error: 'Invalid action or role.' });
          return;
        }
        const result = performAction(body.action, body.role);
        sendJson(res, result.success ? 200 : 403, result);
      } catch {
        sendJson(res, 400, { error: 'Invalid request body.' });
      }
      return;
    }

    // POST /appraisal/update
    if (method === 'POST' && url === '/appraisal/update') {
      try {
        const body = await parseBody<{ formData: Parameters<typeof updateFormData>[0] }>(req);
        const updated = updateFormData(body.formData ?? {});
        sendJson(res, 200, { formData: updated });
      } catch {
        sendJson(res, 400, { error: 'Invalid request body.' });
      }
      return;
    }

    // POST /appraisal/reset
    if (method === 'POST' && url === '/appraisal/reset') {
      resetAppraisal();
      sendJson(res, 200, { message: 'Reset successful.' });
      return;
    }

    // GET /documents?fin=<FIN>
    if (method === 'GET' && url.startsWith('/documents') && !url.startsWith('/documents/download')) {
      const urlObj = new URL(url, 'http://localhost');
      const fin = urlObj.searchParams.get('fin');
      
      if (!fin) {
        sendJson(res, 400, { error: 'Missing fin query parameter.' });
        return;
      }

      const documents = listDocumentsByFin(fin);
      sendJson(res, 200, documents);
      return;
    }

    // GET /documents/download?fin=<FIN>
    if (method === 'GET' && url.startsWith('/documents/download')) {
      const urlObj = new URL(url, 'http://localhost');
      const fin = urlObj.searchParams.get('fin');
      
      if (!fin) {
        sendJson(res, 400, { error: 'Missing fin query parameter.' });
        return;
      }

      const reportPath = getAppraisalReportPath(fin);

      if (!reportPath || !fs.existsSync(reportPath)) {
        sendJson(res, 404, { error: 'Bewertungsprotokoll not found for the given FIN.' });
        return;
      }

      const filename = path.basename(reportPath);
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Access-Control-Allow-Origin': '*',
      });

      const readStream = fs.createReadStream(reportPath);
      readStream.pipe(res);
      return;
    }

    sendJson(res, 404, { error: 'Not found.' });
  };
}