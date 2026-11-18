export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  profileImage: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
