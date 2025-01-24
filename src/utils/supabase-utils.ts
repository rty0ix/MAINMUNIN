import { CheckInFormData } from '../types/CheckIn';

export const mapCheckInToSupabase = (checkIn: CheckInFormData) => ({
  name: checkIn.name,
  badge_number: checkIn.badgeNumber,
  title: checkIn.title,
  investigative_role: checkIn.investigativeRole,
  department_number: checkIn.departmentNumber,
  defendant_name: checkIn.defendantName,
  phone_number: checkIn.phoneNumber,
  case_number: checkIn.caseNumber,
  additional_comments: checkIn.additionalComments
});

export const mapSupabaseToCheckIn = (data: any) => ({
  id: data.id,
  name: data.name,
  badgeNumber: data.badge_number,
  title: data.title,
  investigativeRole: data.investigative_role,
  departmentNumber: data.department_number,
  defendantName: data.defendant_name,
  phoneNumber: data.phone_number || '',
  caseNumber: data.case_number || '',
  additionalComments: data.additional_comments || '',
  created_at: data.created_at,
  verified: data.verified,
  flagged: data.flagged
});