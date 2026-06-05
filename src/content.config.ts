import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		startTime: z.string(),
		place: z.string(),
		capacity: z.string(),
		date: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string(),
		heroImageFromUrl: z.string().optional(),
		heroImageFromName: z.string().optional(),
		label: z.string(),
		dateTbd: z.boolean().optional(),
		hiddenAtTop: z.boolean().optional(),
	}),
});

export const collections = { blog };
