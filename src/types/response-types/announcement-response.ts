export interface IAnnouncement {
  id: number;
  title: string;
  description: string;
  photoURL: string | null;
  userId: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user?: {
    firstName: string;
    lastName: string;
  };
  User?: {
    firstName: string;
    lastName: string;
  };
}

export interface AnnouncementsResponseType {
  count: number;
  rows: IAnnouncement[];
}

export interface AnnouncementFilterParams {
  page?: string;
  limit?: string;
  order?: string;
  order_by?: string;
  q?: string;
  from?: string;
  to?: string;
}
