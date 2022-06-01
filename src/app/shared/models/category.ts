import { Link } from "./link";

export interface Category {
  id: number;
  name: string;
  _links: Record<string, Link>;
}
