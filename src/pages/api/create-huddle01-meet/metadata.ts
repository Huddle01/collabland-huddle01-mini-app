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
    keywords: ['communication', 'meetings', 'token-gated', 'live-video', 'huddle01'],
    tags: ['communication', 'meetings', 'token-gated', 'live-video', 'huddle01'],
    shortDescription: "Your one app to meet, work or hang out. Enjoy exciting features like wallet login, token-gating, live streaming, recording, NFTs as PFPs, DIDs as display names and much more on Huddle01.",
    description: `
    Your one app to meet, work or hang out. Enjoy exciting features like wallet and social login, token-gating, live streaming, recording, NFTs as PFPs, DIDs as display names and much more on Huddle01.
    
    ### More about Huddle01

    Building the decentralized real-time communication network. Our current suite of developer-friendly SDKs enable powerful audio/video experiences for web and mobile app with just a quick plug in.
   
    ### Commands Description
            
    /create-huddle01-meet
    - creates a room for meeting
    - accepts host-wallet address as the parameter
    --
    /create-huddle01-token-gated-meet
      - creates a token-gated meeting
      - allows a person to token-gated their meeting on chains
        - Ethereum (ERC20, ERC721, ERC1155) 
        - Polygon (ERC20, ERC721, ERC1155)
        - BSC (BEP20, BEP721)`,
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
        description: "/create-huddle01-meet",
        options: [
          {
            name: "host-wallets",
            description: "Enter the wallet address / NA",
            type: ApplicationCommandOptionType.String,
            required: true,
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
        description: "/create-huddle01-tokengated-meet",
        options: [],
      },
    ],
  };
  res.send(metadata);
}
