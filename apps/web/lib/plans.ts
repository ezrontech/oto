export type Plan = 'Community' | 'Creator' | 'Campaign';

export const PLAN_LIMITS = {
    Community: {
        maxSpaces: 3,
        canCreateTeamSpaces: true,
        canCreatePublicCommunities: true,
        canUseAdvancedTools: false,
        maxMembersPerSpace: 10,
    },
    Creator: {
        maxSpaces: 10,
        canCreateTeamSpaces: true,
        canCreatePublicCommunities: true,
        canUseAdvancedTools: true,
        maxMembersPerSpace: 50,
    },
    Campaign: {
        maxSpaces: 100,
        canCreateTeamSpaces: true,
        canCreatePublicCommunities: true,
        canUseAdvancedTools: true,
        maxMembersPerSpace: 500,
    }
};

export function canCreateSpace(plan: Plan, type: string) {
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.Community;
    if (type === 'Team') {
        return limits.canCreateTeamSpaces;
    }
    return true;
}

export function hasFeatureAccess(plan: Plan, feature: keyof typeof PLAN_LIMITS['Community']) {
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.Community;
    return limits[feature] === true;
}
