export interface AppUserProfile {
  firstName: string;
  lastName?: string;
  about?: string;
  email: string;
};

export interface UserProfile {
    email: string;
    firstName: string;
    lastName: string;
    about: string;
    updatedAt: string;
    createdAt: string
}

export interface UserEditForm {
    firstName: string;
    lastName: string;
    about: string;
}