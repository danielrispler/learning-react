import { User } from "src/common/common.types";
import Cookies from 'js-cookie';



export const getUserFromCookie = (): string => {
    const token = getCookie("token");
    if (!token) {
        return ""
    }
    const userData = JSON.parse(atob(token.split('.')[1]))
    return userData.iss
};

function getCookie(name: string): string|null {
	const nameLenPlus = (name.length + 1);
	return document.cookie
		.split(';')
		.map(c => c.trim())
		.filter(cookie => {
			return cookie.substring(0, nameLenPlus) === `${name}=`;
		})
		.map(cookie => {
			return decodeURIComponent(cookie.substring(nameLenPlus));
		})[0] || null;
}