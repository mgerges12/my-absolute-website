import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const poems = defineCollection({
	// Now accepting .md, .mdx, .txt, AND .html!
	loader: glob({ base: './src/content/poems', pattern: '**/*.{md,mdx,txt,html}' }),
	schema: z.object({
		title: z.string().optional(),
		description: z.string().optional(),
		pubDate: z.coerce.date().optional(),
	}),
});

const stories = defineCollection({
	loader: glob({ base: './src/content/stories', pattern: '**/*.{md,mdx,txt,html}' }),
	schema: z.object({
		title: z.string().optional(),
		description: z.string().optional(),
		pubDate: z.coerce.date().optional(),
	}),
});

export const collections = { poems, stories };
