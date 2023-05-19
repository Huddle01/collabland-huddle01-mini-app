// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { MiniAppManifest } from "@collabland/models";
import {
  ApplicationCommandType,
  DiscordActionMetadata,
  InteractionType,
} from "@collabland/discord";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const manifest = new MiniAppManifest({
    appId: "token-gated-room",
    developer: "collab.land",
    name: "TokenGateRoom",
    platforms: ["discord"],
    shortName: "token-gated-room",
    version: { name: "0.0.1" },
    website: "https://collab.land",
    description: "An example Collab.Land action",
  });
  const metadata: DiscordActionMetadata = {
    /**
     * Miniapp manifest
     */
    manifest,
    /**
     * Supported Discord interactions. They allow Collab.Land to route Discord
     * interactions based on the type and name/custom-id.
     */
    supportedInteractions: [
      {
        // Handle `/token-gated-room` slash command
        type: InteractionType.ApplicationCommand,
        names: ["token-gated-room"],
      },
      {
        type: InteractionType.ModalSubmit,
        ids: ["submit"],
      },
    ],
    /**
     * Supported Discord application commands. They will be registered to a
     * Discord guild upon installation.
     */
    applicationCommands: [
      // `/token-gated-room <your-name>` slash command
      {
        metadata: {
          name: "TokenGatedRoom",
          shortName: "token-gated-room",
          supportedEnvs: ["production", "development"],
        },
        name: "token-gated-room",
        type: ApplicationCommandType.ChatInput,
        description: "/token-gated-room",
        options: [],
      },
    ],
  };
  res.send(metadata);
}
