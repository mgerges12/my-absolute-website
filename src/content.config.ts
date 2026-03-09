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
            
            // Map to store the latest version of each file by its normalized ID
            const latestFiles = new Map();

            for (const file of files) {
                const filePath = path.join(dir, file);
                const stats = fs.statSync(filePath);
                
                // Normalize ID: "Someday-Ill-Love-Myself" and "SomedayIllLoveMyself" 
                // both become "somedayilllovemyself" for comparison
                const id = file.replace(/\.(html|md)$/, '');
                const normalizedId = id.toLowerCase().replace(/[^a-z0-9]/g, '');
                
                if (!latestFiles.has(normalizedId) || stats.mtime > latestFiles.get(normalizedId).mtime) {
                    latestFiles.set(normalizedId, {
                        id, // Keep the original ID for the store
                        filePath,
                        mtime: stats.mtime
                    });
                }
            }
            
            for (const { id, filePath, mtime } of latestFiles.values()) {
                let content = fs.readFileSync(filePath, 'utf-8');
                let finalDate = mtime;
                const dateMatch = content.match(/pubDate:\s*(.*)/i);
                if (dateMatch) {
                    const parsedDate = new Date(dateMatch[1]);
                    if (!isNaN(parsedDate.getTime())) {
                        finalDate = parsedDate;
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
