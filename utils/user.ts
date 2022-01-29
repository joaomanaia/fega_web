export const getPairUid = (uid1: string, uid2: string): string => {
    if (uid1 < uid2) {
        return uid1 + uid2
    } else {
        return uid2 + uid1
    }
}