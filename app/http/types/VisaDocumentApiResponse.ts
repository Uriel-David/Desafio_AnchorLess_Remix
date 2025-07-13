export type DocumentTag = 'visa' | 'passport' | 'photo';

export interface VisaDocument {
  id: number;
  name: string;
  url: string;
  type: 'document' | 'image';
  tag: DocumentTag;
  ext: string; 
  created_at?: string;
  updated_at?: string;
}

export type VisaDocumentGrouped = Record<DocumentTag, VisaDocument[]>;

export interface VisaDocumentApiResponseGrouped {
  success: boolean;
  data: VisaDocumentGrouped;
  message: string;
}

export interface VisaDocumentApiResponseUnity {
  success: boolean;
  data: VisaDocument;
  message: string;
}