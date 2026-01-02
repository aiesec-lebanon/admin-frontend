'use server';

import { UserInfo } from "@/layout/types";
import axios from "axios";

export async function fetchUserInfo(accessToken: string) : Promise<UserInfo> {
    const res = await axios.post(
        process.env.NEXT_PUBLIC_AIESEC_GRAPHQL_API || "",
        { query: USER_QUERY },
        {
            headers: {
                Authorization: accessToken,
            },
        }
    );

    return res.data.data.currentPerson as UserInfo;
}

const USER_QUERY = `{
  currentPerson {
    full_name
    profile_photo
    current_positions{
      id
      office{
        id name tag
      }
      role{
        id name
      }
    }
  }
}`;