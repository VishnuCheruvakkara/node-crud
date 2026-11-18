import { User } from './user';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (userData: any) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}
