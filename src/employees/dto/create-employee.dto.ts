export class CreateEmployeeDto {
  name: string;
  document: string;
  zipCode: string;
  birthDate: Date;
  createdAt: Date;
  responsible: boolean;
  sector?: string;
}
