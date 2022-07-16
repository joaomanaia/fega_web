import { getPairUid, getPairUids } from "../../utils/user-utils"

test('get pair uid from two uids', () => { 
    expect(getPairUid("eeeeeee", "aaabbb")).toBe("aaabbbeeeeeee")
})

test('get pair uid from multiple uids', () => { 
    expect(getPairUids(["eeeeeee", "aaabbb", "ccccc"])).toBe("aaabbbccccceeeeeee")
})