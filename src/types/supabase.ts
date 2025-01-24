export interface Database {
  public: {
    Tables: {
      check_ins: {
        Row: {
          id: string;
          name: string;
          badge_number: string;
          title: string;
          investigative_role: string;
          department_number: string;
          defendant_name: string;
          phone_number: string | null;
          agency: string | null;
          additional_comments: string | null;
          created_at: string;
          verified: boolean;
          flagged: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          badge_number: string;
          title: string;
          investigative_role: string;
          department_number: string;
          defendant_name: string;
          phone_number?: string | null;
          agency?: string | null;
          additional_comments?: string | null;
          created_at?: string;
          verified?: boolean;
          flagged?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          badge_number?: string;
          title?: string;
          investigative_role?: string;
          department_number?: string;
          defendant_name?: string;
          phone_number?: string | null;
          agency?: string | null;
          additional_comments?: string | null;
          created_at?: string;
          verified?: boolean;
          flagged?: boolean;
        };
      };
    };
  };
}