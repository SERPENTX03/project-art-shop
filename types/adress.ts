export type Address = {
  id?: string;
  fullName: string;
  phone: string;
  province: string;
  district: string;
  subDistrict: string;
  postalCode: string;
  addressLine: string;
  type?: "HOME" | "WORK";
  isDefault?: boolean;
};

export type Province = {
  id: number;
  name_th: string;
};

export type Amphure = {
  id: number;
  name_th: string;
  province_id: number;
};

export type Tambon = {
  id: number;
  name_th: string;
  amphure_id: number;
  zip_code: number;
};
