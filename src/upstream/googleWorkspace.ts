import { Upstream } from "./upstream";
import { Member, Department, DepartmentDetail } from "../dto/member";
import { google, admin_directory_v1 } from 'googleapis';
import { JWT } from 'google-auth-library';

export class GoogleWorkspace implements Upstream {
    private auth: JWT;
    private googleService: admin_directory_v1.Admin;
    
    constructor() {
        this.auth = new google.auth.JWT({
            email: process.env.GOOGLE_WORKSPACE_EMAIL,
            key: process.env.GOOGLE_WORKSPACE_KEY,
            scopes: ["https://www.googleapis.com/auth/admin.directory.user.readonly"],
        });
        this.googleService = google.admin({ version: 'directory_v1', auth: this.auth });
    }   

    async getMembers(): Promise<Member[]> {
        const members = await this.googleService.users.list({
            domain: 'tum-blockchain.com',
        });
        
        if (!members.data.users) {
            return [];
        }
        
        return members.data.users.map((user) => {
            const email = user.primaryEmail || '';
            const discordUserId = typeof user.customSchemas?.discord === 'string' 
                ? user.customSchemas.discord 
                : '';
            const userGroup = user.orgUnitPath || '';
            const department = this.getDepartmentFromOrgUnitPath(userGroup);
            
            return {
                id: user.id || '',
                name: user.name?.fullName || '',
                email: email,
                department: department,
                discordUserId: discordUserId,
            };
        });
    }
    
    private getDepartmentFromOrgUnitPath(orgUnitPath: string): DepartmentDetail {
        const deptEntry = Object.entries(Department).find(
            ([_, dept]) => orgUnitPath.includes(dept.orgUnitPath)
        );
        return deptEntry ? deptEntry[1] : Department.IT;
    }
}