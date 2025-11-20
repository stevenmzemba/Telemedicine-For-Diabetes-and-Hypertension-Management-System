class AuthService {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    async init() {
        // Check current session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            this.currentUser = session.user;
            await this.loadUserProfile();
        }
        this.updateUI();
    }

    async login(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            this.currentUser = data.user;
            await this.loadUserProfile();
            this.updateUI();
            
            return { success: true, user: this.currentUser };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async logout() {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            this.currentUser = null;
            this.updateUI();
        }
    }

    async loadUserProfile() {
        if (!this.currentUser) return;

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', this.currentUser.id)
            .single();

        if (!error && data) {
            this.currentUser.profile = data;
        }
    }

    updateUI() {
        const authSection = document.getElementById('auth-section');
        const appSection = document.getElementById('app-section');
        const userInfo = document.getElementById('user-info');

        if (this.currentUser) {
            authSection.classList.add('hidden');
            appSection.classList.remove('hidden');
            
            if (userInfo && this.currentUser.profile) {
                userInfo.textContent = `${this.currentUser.profile.first_name} ${this.currentUser.profile.last_name} (${this.currentUser.profile.role})`;
            }
            
            // Load dashboard based on user role
            this.loadDashboard();
        } else {
            authSection.classList.remove('hidden');
            appSection.classList.add('hidden');
        }
    }

    loadDashboard() {
        if (!this.currentUser?.profile) return;

        const dashboard = new Dashboard();
        dashboard.load(this.currentUser.profile.role);
    }
}

// Initialize auth service
const authService = new AuthService();

// Login form handler
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const result = await authService.login(email, password);
    
    if (!result.success) {
        alert('Login failed: ' + result.error);
    }
});

// Logout handler
document.getElementById('logout-btn')?.addEventListener('click', () => {
    authService.logout();
});