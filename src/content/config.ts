import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		startTime: z.string(),
		place: z.string(),
		capacity: z.string(),
		// Transform string to Date object
		date: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string(),
		heroImageFromUrl: z.string().optional(),
		heroImageFromName: z.string().optional(),
		label: z.string(),
		dateTbd: z.boolean().optional(),
	}),
});

export const collections = { blog };
