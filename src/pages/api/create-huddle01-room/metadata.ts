// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { MiniAppManifest } from "@collabland/models";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  DiscordActionMetadata,
  InteractionType,
} from "@collabland/discord";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const manifest = new MiniAppManifest({
    appId: "create-huddle01-room",
    developer: "collab.land",
    name: "CreateHuddle01Room",
    platforms: ["discord"],
    shortName: "create-huddle01-room",
    version: { name: "0.0.1" },
    website: "https://huddle01.com",
    description: "Action to create room for Huddle01",
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
        // Handle `/create-huddle01-room` slash command
        type: InteractionType.ApplicationCommand,
        names: ["create-huddle01-room", "create-huddle01-tokengated-room"],
      },
      {
        type: InteractionType.ModalSubmit,
        ids: ["submit"],
      }
    ],
    /**
     * Supported Discord application commands. They will be registered to a
     * Discord guild upon installation.
     */
    applicationCommands: [
      // `/create-huddle01-room` slash command
      {
        metadata: {
          name: "CreateHuddle01Room",
          shortName: "create-huddle01-room",
          supportedEnvs: ["production", "development"],
        },
        name: "create-huddle01-room",
        type: ApplicationCommandType.ChatInput,
        description: "/create-huddle01-room",
        options: [
          {
            name: "host-wallets",
            description: "Enter the wallet address / NA",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      {
        metadata: {
          name: "CreateHuddle01TokenGatedRoom",
          shortName: "create-huddle01-tokengated-room",
          supportedEnvs: ["production", "development"],
        },
        name: "create-huddle01-tokengated-room",
        type: ApplicationCommandType.ChatInput,
        description: "/create-huddle01-tokengated-room",
        options: [],
      },
    ],
  };
  res.send(metadata);
}
