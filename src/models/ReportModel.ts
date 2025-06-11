import { UserDTO } from "./UserModel";

export interface ReportPayload {
	postId: number;
	reason: string;
	description: string;
}

export interface Report {
  id: number;
  reporter: UserDTO;
  postId: number;
  reason: string;
  description: string;
  status: 'PENDING' | 'RESOLVED' | 'REJECTED';
  createdAt: string;
}

export interface PaginatedReports {
  content: Report[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface UserViolationSummary  {
  user: UserDTO;
  violationCount: number;
};

export interface ReportDetail  {
  reporter: {
    id: number;
    fullName: string;
    avatar: string;
  };
  reason: string;
  description: string;
  createdAt: string;
};