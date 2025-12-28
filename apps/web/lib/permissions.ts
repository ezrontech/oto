/**
 * Permission utilities for Oto Spaces system
 * Handles role-based access control across Team, Community, and Room spaces
 */

export type SpaceRole = 'owner' | 'admin' | 'moderator' | 'member' | 'guest' | 'content_creator';
export type SpaceType = 'Team' | 'Community' | 'Room';

/**
 * Check if a role can post content in a given space type
 */
export function canPost(role: SpaceRole, spaceType: SpaceType): boolean {
    if (spaceType === 'Community') {
        // Only creators can post in Community Spaces
        return ['owner', 'content_creator'].includes(role);
    }
    // All members can post in Team and Room spaces
    return ['owner', 'admin', 'moderator', 'member'].includes(role);
}

/**
 * Check if a role can moderate content (delete, edit others' posts)
 */
export function canModerate(role: SpaceRole): boolean {
    return ['owner', 'admin', 'moderator'].includes(role);
}

/**
 * Check if a role can manage tools (enable/disable)
 */
export function canManageTools(role: SpaceRole): boolean {
    return ['owner', 'admin'].includes(role);
}

/**
 * Check if a role can manage other users' roles
 */
export function canManageRoles(role: SpaceRole): boolean {
    return ['owner', 'admin'].includes(role);
}

/**
 * Check if a role can create channels (Team Spaces only)
 */
export function canCreateChannels(role: SpaceRole): boolean {
    return ['owner', 'admin'].includes(role);
}

/**
 * Check if a role can invite members
 */
export function canInviteMembers(role: SpaceRole): boolean {
    return ['owner', 'admin', 'moderator'].includes(role);
}

/**
 * Check if a role can access a specific tool
 */
export function canAccessTool(role: SpaceRole, tool: string, spaceType: SpaceType): boolean {
    // Guests have limited access
    if (role === 'guest') {
        return ['calendar', 'notes'].includes(tool.toLowerCase());
    }

    // All other roles have full tool access
    return true;
}

/**
 * Get default tools for a space type
 */
export function getDefaultTools(spaceType: SpaceType): string[] {
    switch (spaceType) {
        case 'Team':
            return [
                'calendar',
                'notes',
                'tasks',
                'goals',
                'crm',
                'bookings',
                'offers',
                'invoice',
                'agent_card',
                'agent_chat',
                'articles',
                'whatsapp',
                'email'
            ];
        case 'Community':
            return [
                'articles',
                'comments',
                'reactions',
                'marketplace',
                'services',
                'events',
                'mailing_lists'
            ];
        case 'Room':
            return [
                'notes',
                'tasks',
                'calendar',
                'polls'
            ];
        default:
            return [];
    }
}

/**
 * Check if a user can perform an action based on their role
 */
export function hasPermission(
    role: SpaceRole,
    action: 'post' | 'moderate' | 'manage_tools' | 'manage_roles' | 'create_channels' | 'invite',
    spaceType: SpaceType
): boolean {
    switch (action) {
        case 'post':
            return canPost(role, spaceType);
        case 'moderate':
            return canModerate(role);
        case 'manage_tools':
            return canManageTools(role);
        case 'manage_roles':
            return canManageRoles(role);
        case 'create_channels':
            return canCreateChannels(role);
        case 'invite':
            return canInviteMembers(role);
        default:
            return false;
    }
}

/**
 * Get role hierarchy level (higher = more permissions)
 */
export function getRoleLevel(role: SpaceRole): number {
    const levels: Record<SpaceRole, number> = {
        owner: 5,
        admin: 4,
        moderator: 3,
        content_creator: 2,
        member: 1,
        guest: 0
    };
    return levels[role] || 0;
}

/**
 * Check if roleA has higher permissions than roleB
 */
export function hasHigherRole(roleA: SpaceRole, roleB: SpaceRole): boolean {
    return getRoleLevel(roleA) > getRoleLevel(roleB);
}
