const API_BASE = 'https://itlearn.pythonanywhere.com/api';
const CLERK_PUBLISHABLE_KEY = 'pk_test_a25vd2luZy1yZWRiaXJkLTE4LmNsZXJrLmFjY291bnRzLmRldiQ';

let _clerk = null;
let _clerkLoading = null;

async function getClerk() {
    if (_clerk) return _clerk;
    if (typeof Clerk === 'undefined') {
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/@clerk/clerk-js@latest/dist/clerk.browser.js';
            script.setAttribute('data-cookieconsent', 'ignore');
            script.setAttribute('data-clerk-publishable-key', CLERK_PUBLISHABLE_KEY);
            script.onload = resolve;
            script.onerror = () => reject(new Error('Failed to load Clerk JS'));
            document.head.appendChild(script);
        });
    }
    if (!_clerkLoading) {
        _clerkLoading = (async () => {
            _clerk = window.Clerk;
            await _clerk.load();
        })();
    }
    await _clerkLoading;
    return _clerk;
}

async function syncSessionToken() {
    const clerk = await getClerk();
    if (!clerk.session) return null;
    const token = await clerk.session.getToken();
    const response = await fetch(`${API_BASE}/auth/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token }),
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
}

export async function checkSession() {
    try {
        const clerk = await getClerk();
        if (clerk.session) {
            try { await syncSessionToken(); } catch (e) {}
        }
        const response = await fetch(`${API_BASE}/session`, {
            method: 'GET',
            credentials: 'include',
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return { logged_in: false, user_id: null };
    }
}

export async function logout() {
    try {
        await fetch(`${API_BASE}/logout`, {
            method: 'POST',
            credentials: 'include',
        });
        const clerk = await getClerk();
        await clerk.signOut();
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function loadProgress() {
    try {
        const response = await fetch(`${API_BASE}/progress/load`, {
            method: 'POST',
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to load progress');
        const data = await response.json();
        return data;
    } catch (error) {
        return { progress: {}, xp: 0, streak: 0, last_active: null, missions: {}, mistakes: [] };
    }
}

export async function saveProgress(progressData) {
    try {
        const response = await fetch(`${API_BASE}/progress/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ progress_data: progressData }),
        });
        const data = await response.json();
        return { success: data.success || false };
    } catch (error) {
        return { success: false };
    }
}

export async function loadBadges() {
    try {
        const response = await fetch(`${API_BASE}/badges/load`, {
            method: 'POST',
            credentials: 'include',
        });
        if (!response.ok) throw new Error(`Failed to load badges (${response.status})`);
        const data = await response.json();
        return data?.badges && typeof data.badges === 'object' ? data.badges : {};
    } catch (error) {
        throw error;
    }
}

export async function saveBadges(badgesData) {
    try {
        const response = await fetch(`${API_BASE}/badges/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ badges: badgesData || {} }),
        });
        const data = await response.json();
        return { success: data.success || false };
    } catch (error) {
        return { success: false };
    }
}

export async function getUserCount() {
    try {
        const response = await fetch(`${API_BASE}/user-count`, { method: 'GET' });
        const data = await response.json();
        return data;
    } catch (error) {
        return { totalUsers: '0+' };
    }
}

export async function linkTrialProgress(trialData) {
    try {
        const response = await fetch(`${API_BASE}/trial/link`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(trialData),
        });
        const data = await response.json();
        if (!response.ok) return { success: false, error: data.error || 'Failed to link trial progress' };
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Network error. Trial progress may not be linked.' };
    }
}

export async function changePassword(newPassword) {
    try {
        const clerk = await getClerk();
        if (clerk.session) {
            const token = await clerk.session.getToken();
            const response = await fetch(`${API_BASE}/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                credentials: 'include',
                body: JSON.stringify({ new_password: newPassword }),
            });
            const data = await response.json();
            if (!response.ok) return { success: false, error: data.error || 'Password change failed' };
            return { success: true };
        }
        const response = await fetch(`${API_BASE}/change-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ new_password: newPassword }),
        });
        const data = await response.json();
        if (!response.ok) return { success: false, error: data.error || 'Password change failed' };
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Network error. Please try again.' };
    }
}

export async function deleteAccount() {
    try {
        const response = await fetch(`${API_BASE}/delete-account`, {
            method: 'POST',
            credentials: 'include',
        });
        const data = await response.json();
        if (!response.ok) return { success: false, error: data.error || 'Account deletion failed' };
        try {
            const clerk = await getClerk();
            await clerk.signOut();
        } catch (e) {}
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Network error. Please try again.' };
    }
}

export async function getMyProfile() {
    try {
        const response = await fetch(`${API_BASE}/profile/me`, {
            method: 'GET',
            credentials: 'include',
        });
        const data = await response.json();
        if (!response.ok) return { success: false, error: data.error || 'Failed to load profile' };
        return { success: true, profile: data };
    } catch (error) {
        return { success: false, error: 'Network error. Please try again.' };
    }
}

export async function updateProfile({ username, bio, avatarUrl, profileTagline }) {
    try {
        const response = await fetch(`${API_BASE}/profile/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, bio, avatar_url: avatarUrl, profile_tagline: profileTagline }),
        });
        const data = await response.json();
        if (!response.ok) return { success: false, error: data.error || 'Failed to update profile' };
        return { success: true, profile: data.profile };
    } catch (error) {
        return { success: false, error: 'Network error. Please try again.' };
    }
}

export async function getPublicProfile(username) {
    try {
        const response = await fetch(`${API_BASE}/profile/${encodeURIComponent(username)}`, {
            method: 'GET',
            credentials: 'include',
        });
        const data = await response.json();
        if (!response.ok) return { success: false, error: data.error || 'Profile not found' };
        return { success: true, profile: data };
    } catch (error) {
        return { success: false, error: 'Network error. Please try again.' };
    }
}

export async function reportProfileBio({ username, reason, details }) {
    try {
        const response = await fetch(`${API_BASE}/profile/report-bio`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, reason, details }),
        });
        if (!response.ok) {
            const statusText = `HTTP ${response.status}${response.statusText ? ` ${response.statusText}` : ''}`;
            let bodyText = '';
            try { bodyText = await response.text(); } catch (readError) { bodyText = ''; }
            let bodyMessage = '';
            const trimmedBody = bodyText.trim();
            if (trimmedBody) {
                try {
                    const parsed = JSON.parse(trimmedBody);
                    bodyMessage = parsed?.error || parsed?.message || trimmedBody;
                } catch (parseError) {
                    bodyMessage = trimmedBody;
                }
            }
            return { success: false, error: bodyMessage ? `${statusText}: ${bodyMessage}` : statusText };
        }
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            try { await response.json(); } catch (parseError) {}
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Network error. Please try again.' };
    }
}