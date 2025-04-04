export interface DepartmentDetail {
    orgUnitPath: string;
    groupKey: string;
    discordRoleId: string;
}

// Mapping of departments to their discord roles
export const Department: Record<string, DepartmentDetail> = {
    IT: {
        orgUnitPath: "it@tum-blockchain.com",
        groupKey: "it@tum-blockchain.com",
        discordRoleId: "986708442783813663",
    },
    Marketing: {
        orgUnitPath: "marketing@tum-blockchain.com",
        groupKey: "marketing@tum-blockchain.com",
        discordRoleId: "979406888749891605",
    },
    Industry: {
        orgUnitPath: "industry@tum-blockchain.com",
        groupKey: "industry@tum-blockchain.com",
        discordRoleId: "980869758364823552",
    },
    External: {
        orgUnitPath: "relations@tum-blockchain.com",
        groupKey: "relations@tum-blockchain.com",
        discordRoleId: "979411226549432380",
    },
    Education: {
        orgUnitPath: "education@tum-blockchain.com",
        groupKey: "education@tum-blockchain.com",
        discordRoleId: "992859715711279125",
    },
    Community: {
        orgUnitPath: "community@tum-blockchain.com",
        groupKey: "community@tum-blockchain.com",
        discordRoleId: "980870207855792188",
    },
    Legal: {
        orgUnitPath: "legalfinance@tum-blockchain.com",
        groupKey: "legalfinance@tum-blockchain.com",
        discordRoleId: "979407318246621284",
    }
} as const;

export interface Member {
    id: string;
    name: string;
    email: string;
    discordUserId: string;
    department: DepartmentDetail;
}
