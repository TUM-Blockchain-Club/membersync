import { Member } from "../dto/member";

export interface Downstream {
    handleMembers(members: Member[]): Promise<void>;
}