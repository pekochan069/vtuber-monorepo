import { defineAction, z } from "astro:actions";
import { env } from "@repo/env/admin";

export const getYoutubeIcon = defineAction({
  input: z.string(),
  handler: async (
    handle,
  ): Promise<{ ok: true; image: string } | { ok: false }> => {
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&forHandle=${handle}&maxResults=1&key=${env.YOUTUBE_API_KEY}`,
      );

      const data = await res.json();

      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const thumbnail = (data as any).items[0].snippet.thumbnails.high.url as
        | string
        | undefined
        | null;

      if (typeof thumbnail !== "string") {
        return {
          ok: false,
        };
      }

      // const image = await fetch(thumbnail);
      // const blob = await image.blob();

      return {
        ok: true,
        image: thumbnail,
      };
    } catch {
      return {
        ok: false,
      };
    }
  },
});
