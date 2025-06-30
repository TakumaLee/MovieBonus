'use server';
/**
 * @fileOverview Curates information on available movie bonuses from various sources.
 *
 * - curateMovieBonuses - A function that curates movie bonus information.
 * - CurateMovieBonusesInput - The input type for the curateMovieBonuses function.
 * - CurateMovieBonusesOutput - The return type for the curateMovieBonuses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CurateMovieBonusesInputSchema = z.object({
  movieTitle: z.string().describe('The title of the movie.'),
});
export type CurateMovieBonusesInput = z.infer<typeof CurateMovieBonusesInputSchema>;

const CurateMovieBonusesOutputSchema = z.object({
  bonuses: z.array(
    z.object({
      bonusName: z.string().describe('The name of the bonus.'),
      description: z.string().describe('A detailed description of the bonus.'),
      imageUrl: z.string().describe('URL of an image representing the bonus.'),
      distributionPeriod: z
        .string()
        .describe('The period during which the bonus is available.'),
      rules: z.string().describe('The rules to acquire the bonus.'),
    })
  ).describe('A list of available bonuses for the movie.'),
});
export type CurateMovieBonusesOutput = z.infer<typeof CurateMovieBonusesOutputSchema>;

export async function curateMovieBonuses(input: CurateMovieBonusesInput): Promise<CurateMovieBonusesOutput> {
  return curateMovieBonusesFlow(input);
}

const curateMovieBonusesPrompt = ai.definePrompt({
  name: 'curateMovieBonusesPrompt',
  input: {schema: CurateMovieBonusesInputSchema},
  output: {schema: CurateMovieBonusesOutputSchema},
  prompt: `You are an expert curator of movie bonus information.

  Given the title of a movie, you will search for and curate information about available bonuses for that movie from various sources.
  You will then return a list of bonuses, including the name of the bonus, a detailed description, an image URL, the distribution period, and the rules to acquire the bonus.

  Movie Title: {{{movieTitle}}}`,
});

const curateMovieBonusesFlow = ai.defineFlow(
  {
    name: 'curateMovieBonusesFlow',
    inputSchema: CurateMovieBonusesInputSchema,
    outputSchema: CurateMovieBonusesOutputSchema,
  },
  async input => {
    const {output} = await curateMovieBonusesPrompt(input);
    return output!;
  }
);
