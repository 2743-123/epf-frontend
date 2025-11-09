export interface Customer {
  id: number;
  name: string;
  aadharCardName: string;
  uanNumber: string;
  aadharNumber: string;
  dob: string;
  aadharMobile: string;
  uanPassword: string;
  workStatus: string;
  updatedStatus: string;
  bankAccountNumber: string;
  ifscCode: string;
  commissionAmount: number;
  password: string;
  paidAmount: number | null;
}