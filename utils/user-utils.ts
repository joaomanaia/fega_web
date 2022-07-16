export const getPairUid = (uid1: string, uid2: string): string => {
  return uid1 < uid2 ? uid1 + uid2 : uid2 + uid1
}

export const getPairUids = (uids: string[]): string => {
    return uids.sort().join("")
}