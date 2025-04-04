import { Member } from "../dto/member";

export interface Upstream {
    getMembers(): Promise<Member[]>;
}