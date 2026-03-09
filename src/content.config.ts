import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import fs from 'node:fs';
import path from 'node:path';

// Custom loader to handle HTML files raw with automatic dates
function rawHtmlLoader(basePath: string) {
    return {
        name: 'raw-html-loader',
        load: async ({ store, logger }: any) => {
            const dir = path.resolve(basePath);
            if (!fs.existsSync(dir)) return;
            
            const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') || f.endsWith('.md'));
            
            for (const file of files) {
                const filePath = path.join(dir, file);
                const content = fs.readFileSync(filePath, 'utf-8');
                const id = file.replace(/\.(html|md)$/, '');
                
                // Get the actual "Last Modified" date from the file
                const stats = fs.statSync(filePath);
                const fileDate = stats.mtime; // mtime is the last modified time
                
                store.set({
                    id,
                    data: { 
                        title: id, 
                        pubDate: fileDate // Now using the real file date!
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
