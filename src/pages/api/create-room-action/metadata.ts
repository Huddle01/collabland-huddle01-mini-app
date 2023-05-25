// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { MiniAppManifest } from "@collabland/models";
import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    DiscordActionMetadata,
    InteractionType,
  } from "@collabland/discord";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const manifest = new MiniAppManifest({
        appId: "create-room-action",
        developer: "collab.land",
        name: "CreateRoomAction",
        platforms: ["discord"],
        shortName: "create-room-action",
        version: { name: "0.0.1" },
        website: "https://collab.land",
        description: "action to create room in huddle01",
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
            // Handle `/create-room-action` slash command
            type: InteractionType.ApplicationCommand,
            names: ["create-room-action"],
          },
        ],
        /**
         * Supported Discord application commands. They will be registered to a
         * Discord guild upon installation.
         */
        applicationCommands: [
          // `/create-room-action` slash command
          {
            metadata: {
              name: "CreateRoomAction",
              shortName: "create-room-action",
              supportedEnvs: ["production", "development"],
            },
            name: "create-room-action",
            type: ApplicationCommandType.ChatInput,
            description: "/create-room-action",
            options: [
              {
                name: "host-wallets",
                description: "Address of hostWallet",
                type: ApplicationCommandOptionType.String,
                required: false,
              },
            ],
          },
        ],
      };
      res.send(metadata);
}
