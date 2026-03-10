// Force redeploy to clear Vercel cache - March 08 2026
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import fs from 'node:fs';
import path from 'node:path';

// Custom loader to handle HTML files raw with automatic OR explicit dates
function rawHtmlLoader(basePath: string) {
    return {
        name: 'raw-html-loader',
        load: async ({ store, logger }: any) => {
            const dir = path.resolve(basePath);
            if (!fs.existsSync(dir)) return;
            
            const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') || f.endsWith('.md'));
            
            for (const file of files) {
                // Ignore metadata files
                if (file.includes(':Zone.Identifier')) continue;

                const filePath = path.join(dir, file);
                const stats = fs.statSync(filePath);
                const id = file.replace(/\.(html|md)$/, '');
                
                let content = fs.readFileSync(filePath, 'utf-8');
                let finalDate = stats.mtime;
                
                // Extract metadata if it exists
                const dateMatch = content.match(/pubDate:\s*(.*)/i);
                if (dateMatch) {
                    const parsedDate = new Date(dateMatch[1]);
                    if (!isNaN(parsedDate.getTime())) {
                        finalDate = parsedDate;
                        content = content.replace(/pubDate:\s*.*\n?/i, '');
                    }
                }

                // If it's a full HTML file, we need to make sure we keep the <style> and <body> contents
                // but Astro needs a clean string. We'll pass it as is and let the [id].astro handle the extraction.
                
                store.set({
                    id,
                    data: { 
                        title: id, 
                        pubDate: finalDate 
                    },
                    body: content
                });
            }
        }
    };
}

const poems = defineCollection({
	loader: rawHtmlLoader('./src/content/poems'),
	schema: z.object({
		title: z.string().optional(),
		pubDate: z.coerce.date().optional(),
	}),
});

const stories = defineCollection({
	loader: rawHtmlLoader('./src/content/stories'),
	schema: z.object({
		title: z.string().optional(),
		pubDate: z.coerce.date().optional(),
	}),
});

const blog = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/blog" }),
	schema: z.object({
		title: z.string(),
		pubDate: z.coerce.date(),
		description: z.string().optional(),
	}),
});

const videos = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/videos" }),
	schema: z.object({
		title: z.string(),
		pubDate: z.coerce.date(),
		description: z.string().optional(),
		videoUrl: z.string().optional(),
	}),
});

export const collections = { poems, stories, videos };
