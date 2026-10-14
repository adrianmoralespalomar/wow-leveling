export interface TalentBuild {
  id: string;
  name: string;
  summary: string;
  verified: boolean;
  note: string;
  /** Un id de talento por nivel, empezando en el nivel 10. */
  points: string[];
}
