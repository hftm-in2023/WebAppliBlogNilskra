import { z } from 'zod';

export const BlogPreviewEntrySchema = z.object({
  id: z.coerce.number(),
  title: z.string(),
  contentPreview: z.string().catch(''),
  author: z.string().catch(''),
  likes: z.coerce.number().catch(0),
  comments: z.coerce.number().catch(0),
  headerImageUrl: z.string().nullable().optional(),
});

export const BlogPreviewResponseSchema = z.object({
  data: z.array(BlogPreviewEntrySchema),
});

export const BlogCommentSchema = z.object({
  id: z.coerce.number(),
  content: z.string().catch(''),
  author: z.string().catch(''),
  createdAt: z.string().catch(''),
  updatedAt: z.string().catch(''),
});

export const BlogDetailEntrySchema = z.object({
  id: z.coerce.number(),
  title: z.string(),
  content: z.string().catch(''),
  author: z.string().catch(''),
  likes: z.coerce.number().catch(0),
  comments: z.array(BlogCommentSchema).catch([]),
  headerImageUrl: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  likedByMe: z.boolean().optional(),
  createdByMe: z.boolean().optional(),
});

export type BlogPreviewEntry = z.infer<typeof BlogPreviewEntrySchema>;
export type BlogDetailEntry = z.infer<typeof BlogDetailEntrySchema>;