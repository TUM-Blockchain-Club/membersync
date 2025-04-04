import { Downstream } from "./downstream";
import ky from "ky";
import { Member, Department } from "../dto/member";

export class DiscordDownstream implements Downstream {
    private versionNumber: string = '10';
    private baseUrl: string = `https://discord.com/api/v${this.versionNumber}`;
    private botToken: string = process.env.DISCORD_BOT_TOKEN!;
    private userAgent: string = 'DiscordBot';

    constructor() { 

    }

    async handleMembers(members: Member[]): Promise<void> {
        // Remote all other roles related to the department
        const removingRolePromises: Promise<Response>[] = [];
        for (const member of members) {
            for (const dept of Object.values(Department)) {
                const url = `${this.baseUrl}/guilds/${process.env.DISCORD_GUILD_ID}/members/${member.discordUserId}/roles/${dept.discordRoleId}`;
                removingRolePromises.push(ky.delete(url, {
                    headers: {
                        Authorization: `Bot ${this.botToken}`,
                        'User-Agent': `${this.userAgent} (${url}, ${this.versionNumber})`,
                        'Content-Type': 'application/json',
                    },
                }));
            }
        }
        await Promise.all(removingRolePromises);

        const addingRolePromises: Promise<Response>[] = [];
        for (const member of members) {
            const url = `${this.baseUrl}/guilds/${process.env.DISCORD_GUILD_ID}/members/${member.discordUserId}/roles/${member.department.discordRoleId}`;
            addingRolePromises.push(ky.put(url, {
                headers: {
                    Authorization: `Bot ${this.botToken}`,
                    'User-Agent': `${this.userAgent} (${url}, ${this.versionNumber})`,
                    'Content-Type': 'application/json',
                },
            }));
        }
        await Promise.all(addingRolePromises);
    }
}