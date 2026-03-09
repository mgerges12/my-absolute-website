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
                const filePath = path.join(dir, file);
                let content = fs.readFileSync(filePath, 'utf-8');
                const id = file.replace(/\.(html|md)$/, '');
                
                // Detect explicit pubDate: in the content
                let finalDate = fs.statSync(filePath).mtime;
                const dateMatch = content.match(/pubDate:\s*(.*)/i);
                if (dateMatch) {
                    const parsedDate = new Date(dateMatch[1]);
                    if (!isNaN(parsedDate.getTime())) {
                        finalDate = parsedDate;
                        // Clean up the pubDate line so it doesn't show in the body
                        content = content.replace(/pubDate:\s*.*\n?/i, '');
                    }
                }
                
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

export const collections = { poems, stories };
