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
  const finFiles = fs.readdirSync(DOCS_DIR).filter(file => file.includes(fin));
  return finFiles.map(filename => ({
    filename,
    documentType: getDocumentType(filename),
  }));
}

export function getAppraisalReportPath(fin: string): string | null {
  const appraisalReport = fs.readdirSync(DOCS_DIR).find(filename => filename.includes(fin))
  if (appraisalReport && getDocumentType(appraisalReport) === DocumentType.BEWERTUNGSPROTOKOLL) {
    return path.join(DOCS_DIR, "../TestDocuments", appraisalReport);
  }
  else {
    return null;
  }

}