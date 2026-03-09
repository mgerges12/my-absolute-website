import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const poems = defineCollection({
	// Now looking for .md, .mdx, and .txt files!
	loader: glob({ base: './src/content/poems', pattern: '**/*.{md,mdx,txt}' }),
	schema: z.object({
		title: z.string().optional(), // Now optional
		description: z.string().optional(),
		pubDate: z.coerce.date().optional(), // Now optional
	}),
});

const stories = defineCollection({
	loader: glob({ base: './src/content/stories', pattern: '**/*.{md,mdx,txt}' }),
	schema: z.object({
		title: z.string().optional(), // Now optional
		description: z.string().optional(),
		pubDate: z.coerce.date().optional(), // Now optional
	}),
});

export const collections = { poems, stories };
