export interface CheckInFormData {
  name: string;
  badgeNumber: string;
  title: string;
  investigativeRole: string;
  departmentNumber: string;
  defendantName: string;
  phoneNumber?: string;
  caseNumber?: string;
  additionalComments?: string;
}

export interface CheckInResponse extends CheckInFormData {
  id: string;
  created_at: string;
  verified: boolean;
  flagged: boolean;
}