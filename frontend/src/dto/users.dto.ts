export interface UserViewDto {
  id: string;
  name: string;
  email: string;
  date: string;
}

export interface CreateUserDto {
    name: string;
    email: string;
}

export type UpdateUserDto = Partial<CreateUserDto>;