import { UserDTO } from "./UserModel";

export interface ReportPayload {
	postId: number;
	reason: string;
	description: string;
}

export interface Report {
  id: number;
  postId: number;
  reporterId: number;
  reason: string;
  description: string;
  status: 'PENDING' | 'RESOLVED' | 'REJECTED';
  createdAt: string;
  updateAt: string | null;
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

export interface PostReportTer {
  reportId: number;
  reporterUsername: string;
  reason: string;
  description: string;
  status: 'PENDING' | 'RESOLVED' | 'REJECTED';
  reportedAt: string;
}

export interface PostReportDetail {
  postId: number;
  caption: string;
  authorUsername: string;
  postCreatedAt: string;
  reportCount: number;
  reports: PostReportTer[];
}

export interface PaginatedPostReports {
  content: PostReportDetail[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}