export interface RedirectEntry {
  target: string;
  group: string;
  slug: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
  title?: string;
  notes?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
}

export interface Role {
  id: string;
  name: string;
}

export interface Office {
  id: string;
  name: string;
  tag: string;
}

export interface Position {
  id: string;
  office: Office;
  role: Role;
}

export interface UserInfo {
  full_name: string;
  profile_photo: string;
  current_positions: Position[];
}