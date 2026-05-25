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
  // TODO Story 2: Implement filtering logic to return all documents for a given FIN
  return [];
}

export function getAppraisalReportPath(fin: string): string | null {
  // TODO Story 2: Implement logic to find the specific appraisal report for a given FIN
  return null;
}