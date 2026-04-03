import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    categories: z.union([z.string(), z.array(z.string())]).optional().transform(val => {
      if (!val) return [];
      return Array.isArray(val) ? val : [val];
    }),
    tags: z.array(z.string()).optional().default([]),
    image: z.string().optional(),
    subtitle: z.string().optional(),
    excerpt: z.string().optional(),
    video: z.string().optional(),
    verdict: z.string().optional(),
    product: z.object({
      name: z.string(),
      creator: z.string().optional(),
      link: z.string().optional(),
      linkText: z.string().optional(),
      image: z.string().optional(),
    }).optional(),
    downloads: z.array(z.object({
      name: z.string(),
      url: z.string(),
      format: z.string().optional(),
      size: z.string().optional(),
    })).optional(),
    redirect_from: z.union([z.string(), z.array(z.string())]).optional(),
  })
});

export const collections = { posts };
