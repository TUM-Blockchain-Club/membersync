import { HttpFunction } from '@google-cloud/functions-framework';
import { GoogleWorkspace } from './upstream/googleWorkspace';
import { DiscordDownstream } from './downstream/discord';

/**
 * Cloud Run function that syncs Google Workspace admin users with Discord roles
 */
export const syncAdminWorkspace: HttpFunction = async (req, res) => {
  try {
    // Check for optional auth token in the request headers
    const authHeader = req.headers.authorization;
    const expectedToken = process.env.AUTH_TOKEN;
    
    if (expectedToken && (!authHeader || authHeader !== `Bearer ${expectedToken}`)) {
      res.status(401).send('Unauthorized');
      return;
    }
    
    console.log('Starting Google Workspace to Discord sync');
    
    // Create instances of our Google Workspace upstream and Discord downstream
    const googleWorkspace = new GoogleWorkspace();
    const discordDownstream = new DiscordDownstream();
    
    // Fetch members from Google Workspace
    const members = await googleWorkspace.getMembers();
    console.log(`Fetched ${members.length} members from Google Workspace`);
    
    // Filter out members without Discord user IDs
    const membersWithDiscord = members.filter(member => member.discordUserId);
    console.log(`${membersWithDiscord.length} members have Discord IDs assigned`);
    
    // Update Discord roles for members
    await discordDownstream.handleMembers(membersWithDiscord);
    console.log('Successfully updated Discord roles');
    
    res.status(200).send({
      success: true,
      membersProcessed: members.length,
      membersWithDiscord: membersWithDiscord.length
    });
  } catch (error) {
    console.error('Error syncing workspace:', error);
    res.status(500).send({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
