import * as fs from 'fs';
import * as path from 'path';

export enum DocumentType {
  BEWERTUNGSPROTOKOLL = 'Bewertungsprotokoll',
  GUTACHTEN = 'Gutachten',
  SCHADENSBILD = 'Schadensbild',
  ZULASSUNGSBESCHEINIGUNG = 'Zulassungsbescheinigung',
  UNBEKANNT = 'Unbekannt',
}

const DOCS_DIR = path.resolve(__dirname, '../../../TestDocuments');

export interface DocumentInfo {
  filename: string;
  documentType: DocumentType;
}

const DOCUMENT_TYPE_MAP: Record<string, DocumentType> = {
  'AppraisalReport_123.pdf': DocumentType.BEWERTUNGSPROTOKOLL,
  'AppraisalReport_456.pdf': DocumentType.BEWERTUNGSPROTOKOLL,
  'Gutachten_456.pdf':       DocumentType.GUTACHTEN,
  'Gutachten_789.pdf':       DocumentType.GUTACHTEN,
  'Schadensbild_456.pdf':    DocumentType.SCHADENSBILD,
  'ZulBesch1_123.pdf':       DocumentType.ZULASSUNGSBESCHEINIGUNG,
  'ZulBesch1_456.pdf':       DocumentType.ZULASSUNGSBESCHEINIGUNG,
};

export function getDocumentType(filename: string): DocumentType {
  return DOCUMENT_TYPE_MAP[filename] ?? DocumentType.UNBEKANNT;
}

export function listDocumentsByFin(fin: string): DocumentInfo[] {
  if (!fs.existsSync(DOCS_DIR)) {
    return [];
  }

  const files = fs.readdirSync(DOCS_DIR);

  return files
    .filter(file => file.includes(fin) && file.toLowerCase().endsWith('.pdf'))
    .map(filename => ({
      filename,
      documentType: getDocumentType(filename),
    }));
}

export function getAppraisalReportPath(fin: string): string | null {
  const documents = listDocumentsByFin(fin);
  
  const appraisalReport = documents.find(
    doc => doc.documentType === DocumentType.BEWERTUNGSPROTOKOLL
  );

  if (appraisalReport) {
    return path.join(DOCS_DIR, appraisalReport.filename);
  }
  
  return null;
}