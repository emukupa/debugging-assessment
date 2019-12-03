export interface INote {
  title: string;
  isPublic: boolean;
  description?: string;
  userId?: string;
  recycled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  sharedWith?: string[];
}
