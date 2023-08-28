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
    appId: "Huddle01",
    developer: "Huddle01",
    name: "Huddle01",
    platforms: ["discord"],
    shortName: "Huddle01",
    version: { name: "0.0.1" },
    website: "https://huddle01.com",
    keywords: [
      "communication",
      "meetings",
      "token-gated",
      "live-video",
      "huddle01",
    ],
    tags: [
      "communication",
      "meetings",
      "token-gated",
      "live-video",
      "huddle01",
    ],
    shortDescription:
      "Your one app to meet, work or hang out. Enjoy exciting features like wallet login, token-gating, live streaming, recording, NFTs as PFPs, DIDs as display names and much more on Huddle01.",
    description: `Your one app to meet, work or hang out. Enjoy exciting features like wallet and social login, token-gating, live streaming, recording, NFTs as PFPs, DIDs as display names and much more on Huddle01.
### More about Huddle01 
Building the decentralized real-time communication network. Our current suite of developer-friendly SDKs enable powerful audio/video experiences for web and mobile app with just a quick plug in.`,
    thumbnails: [
      {
        label: "Huddle01 Meet Command",
        src: "https://huddle01-assets-frontend.s3.amazonaws.com/collabland/Collabland-1.png",
        sizes: "40x40",
      },
      {
        label: "Token Gated Meet Command",
        src: "https://huddle01-assets-frontend.s3.amazonaws.com/collabland/Collabland-2.png",
        sizes: "40x40",
      },
      {
        label: "Hostwallet address",
        src: "https://huddle01-assets-frontend.s3.amazonaws.com/collabland/Collabland-3.png",
        sizes: "40x40",
      },
      {
        label: "Huddle01 Room Id",
        src: "https://huddle01-assets-frontend.s3.amazonaws.com/collabland/Collabland-4.png",
        sizes: "40x40",
      },
      {
        label: "Huddle01 room overview",
        src: "https://huddle01-assets-frontend.s3.amazonaws.com/collabland/Collabland-5.png",
        sizes: "40x40",
      },
    ],
    icons: [
      {
        label: 'AppIcon',
        src: 'https://huddle01-assets-frontend.s3.amazonaws.com/general/AppIcon.png',
        sizes: '40x40'
      }
    ]
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
        // Handle `/create-huddle01-meet` slash command
        type: InteractionType.ApplicationCommand,
        names: ["create-huddle01-meet", "create-huddle01-tokengated-meet"],
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
      // `/create-huddle01-meet` slash command
      {
        metadata: {
          name: "CreateHuddle01Meet",
          shortName: "create-huddle01-meet",
          supportedEnvs: ["production", "development"],
        },
        name: "create-huddle01-meet",
        type: ApplicationCommandType.ChatInput,
        description: "Allows you to create normal huddle01 meeting link",
        options: [
          {
            name: "host-wallets",
            description: "Enter the wallet address / NA",
            type: ApplicationCommandOptionType.String,
            required: false,
          },
        ],
      },
      // `/create-huddle01-tokengated-meet` slash command
      {
        metadata: {
          name: "CreateHuddle01TokenGatedMeet",
          shortName: "create-huddle01-tokengated-meet",
          supportedEnvs: ["production", "development"],
        },
        name: "create-huddle01-tokengated-meet",
        type: ApplicationCommandType.ChatInput,
        description: "Allows you to create token gated meeting link",
        options: [],
      },
    ],
  };
  res.send(metadata);
}
