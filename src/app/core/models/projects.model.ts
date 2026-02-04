import { PostTag } from "./post-tag.model";

export interface Project {
  id: number;
  title: string;
  shortened_description: string;
  full_description: string;

  project_url: string;
  repository_url: string;
  posting_date: string;

  images: ProjectImage[];
  postTags: PostTag[];
}

export interface ProjectImage {
  id_images: number;
  link_images: string;
  alt_images: string | null;
  _cover: boolean;
}

