export interface UserResponse {
  id: string;
  username: string;
  email: string;
  description?: string;
  notifications: boolean;
  features: string[];
  tabcoins: number;
  tabcash: number;
  created_at: Date;
  updated_at: Date;
}
