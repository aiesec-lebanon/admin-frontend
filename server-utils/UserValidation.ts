'use server'

import { fetchUserInfo } from "./UserFetcher"
import { UserInfo } from "@/layout/types";

interface ValidationResponse {
    isValid: boolean,
    user?: UserInfo,
    group: string,
}

const AIESEC_LB_MC_ID = "182"
const ALLOWED_ROLES = [
    "MCP",
    "MCVP"
]

export default async function validateUser(accessToken: string): Promise<ValidationResponse> {
    try {
        const userInfo = await fetchUserInfo(accessToken);
        
        const isValid = userInfo.current_positions.some(
            (position) => 
                position.office.id === AIESEC_LB_MC_ID &&
                ALLOWED_ROLES.includes(position.role.name)
        );

        return {isValid, user: userInfo, group: "r" }
    } catch (error) {
        return {isValid: false, group: "r"};
    }
}