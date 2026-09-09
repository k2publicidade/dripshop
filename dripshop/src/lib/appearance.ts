import {z} from 'zod';

const color=z.string().regex(/^#[0-9a-fA-F]{6}$/).or(z.literal('')).default('');
export const appearanceSchema=z.object({background:color,text:color,button:color,buttonText:color});
export type Appearance=z.infer<typeof appearanceSchema>;
