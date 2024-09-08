import { METHODS } from "http";

export async function test_url(url: string): Promise<boolean> {
    try{
        const response = await fetch(url, {method: 'HEAD',});
        // console.log(response);   // View Response (For Testing Purposes)
        return(response.ok);
    } catch(error) {
        return false;
    }
}

