// Browser-ready patient manager (copied from your class file)

class PatientManager {
    constructor() {
        this.currentPatient = null;
    }

    // Initialize Supabase client if config is present
    initSupabase() {
        // prefer global client created by `supabase-config.js`
        if (window.supabaseClient) {
            this.supabase = window.supabaseClient;
            window.supabase = this.supabase; // keep compatibility
        }

        // restore role from localStorage if set
        this.currentRole = localStorage.getItem('telemed_role') || null;
    }

    async loadPatients() {
        const content = document.getElementById('content');
        if (!this.supabase) this.initSupabase();
        // If supabase exists, try to load; otherwise show placeholder
        if (typeof supabase !== 'undefined') {
            const { data: patients, error } = await supabase
                .from('patients')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error loading patients:', error);
                content.innerHTML = '<div class="card">Error loading patients (see console)</div>';
                return;
            }

            content.innerHTML = this.buildPatientsHtml(patients);
        } else {
            // placeholder demo content
            content.innerHTML = this.buildPatientsHtml([]);
        }

        this.attachEventListeners();
        // update UI by role
        this.updateRoleUI();
    }

    buildPatientsHtml(patients) {
        return `
        <div class="page-header">
            <h2>Patient Management</h2>
            <div>
                <button class="btn btn-primary" id="add-patient-btn">Add Patient</button>
                <button class="btn" id="cashier-btn">Cashier</button>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>All Patients</h3>
                <div class="search-box">
                    <input type="text" id="patient-search" placeholder="Search patients...">
                </div>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Patient Code</th>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Village</th>
                                <th>Chronic Diseases</th>
                                <th>Last Visit</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="patients-tbody">
                            ${this.renderPatientsTable(patients)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div id="modal-container"></div>
        `;
    }

    renderPatientsTable(patients) {
        if (!patients || patients.length === 0) {
            return '<tr><td colspan="8" class="text-center">No patients found</td></tr>';
        }

        return patients.map(patient => `
            <tr>
                <td>${patient.patient_code || ''}</td>
                <td>${patient.first_name || ''} ${patient.last_name || ''}</td>
                <td>${patient.age || ''}</td>
                <td>${patient.gender || ''}</td>
                <td>${patient.village || ''}</td>
                <td>${this.renderChronicDiseases(patient)}</td>
                <td>${this.getLastVisit(patient)}</td>
                <td>
                    <button class="btn btn-sm btn-outline view-patient" data-id="${patient.id}">View</button>
                    <button class="btn btn-sm btn-outline edit-patient" data-id="${patient.id}">Edit</button>
                </td>
            </tr>
        `).join('');
    }

    renderChronicDiseases(patient) {
        if (!patient.chronic_diseases || patient.chronic_diseases.length === 0) {
            return '<span class="badge">Not specified</span>';
        }

        return patient.chronic_diseases.map(disease => 
            `<span class="badge">${disease}</span>`
        ).join(' ');
    }

    getLastVisit() { return 'N/A'; }

    attachEventListeners() {
        const search = document.getElementById('patient-search');
        if (search) search.addEventListener('input', this.handleSearch.bind(this));

        const addBtn = document.getElementById('add-patient-btn');
        if (addBtn) addBtn.addEventListener('click', () => this.showAddPatientModal());

        const cashierBtn = document.getElementById('cashier-btn');
        if (cashierBtn) cashierBtn.addEventListener('click', () => this.showCashierModal());

        // Close modal on overlay click
        document.addEventListener('click', function(e) {
            if (e.target.classList && e.target.classList.contains('modal-overlay')) {
                e.target.remove();
            }
        });
    }

    // Update UI elements based on role
    updateRoleUI() {
        const role = localStorage.getItem('telemed_role') || this.currentRole;
        const cashierBtn = document.getElementById('cashier-btn');
        if (cashierBtn) cashierBtn.style.display = (role === 'cashier' || role === 'admin') ? 'inline-block' : 'none';
        this.currentRole = role;
    }

    async handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        if (typeof supabase !== 'undefined') {
            const { data: patients, error } = await supabase
                .from('patients')
                .select('*')
                .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,patient_code.ilike.%${searchTerm}%,village.ilike.%${searchTerm}%`)
                .order('created_at', { ascending: false });

            if (!error) {
                document.getElementById('patients-tbody').innerHTML = this.renderPatientsTable(patients);
            }
        } else {
            // no backend in demo
            console.log('Search (demo) term:', searchTerm);
        }
    }

    showCashierModal() {
        const modal = document.getElementById('modal-container');
        modal.innerHTML = `
            <div class="modal-overlay active">
                <div class="modal">
                    <div class="modal-header">
                        <h3>Cashier - Patient Intake</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="cashier-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label>First Name *</label>
                                    <input type="text" name="first_name" required />
                                </div>
                                <div class="form-group">
                                    <label>Last Name</label>
                                    <input type="text" name="last_name" />
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label>Age *</label>
                                    <input type="number" name="age" min="0" max="120" required />
                                </div>
                                <div class="form-group">
                                    <label>Sex *</label>
                                    <select name="gender" required>
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label>Village</label>
                                    <input type="text" name="village" />
                                </div>
                                <div class="form-group">
                                    <label>Healthcare Provider</label>
                                    <input type="text" name="healthcare_provider" />
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label>Contact 1 *</label>
                                    <input type="tel" name="contact1" required />
                                </div>
                                <div class="form-group">
                                    <label>Contact 2</label>
                                    <input type="tel" name="contact2" />
                                </div>
                            </div>

                            <div class="form-group">
                                <label>Chronic Disease Type *</label>
                                <select name="chronic_type" required>
                                    <option value="">Select</option>
                                    <option value="diabetes">Diabetes</option>
                                    <option value="hypertension">Hypertension</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                        <button type="submit" form="cashier-form" class="btn btn-primary">Save</button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('cashier-form').addEventListener('submit', this.handleCashierSubmit.bind(this));
    }

    async handleCashierSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const fd = new FormData(form);
        const patientData = {
            first_name: fd.get('first_name'),
            last_name: fd.get('last_name'),
            age: parseInt(fd.get('age')) || null,
            gender: fd.get('gender'),
            village: fd.get('village'),
            healthcare_provider: fd.get('healthcare_provider'),
            contacts: [fd.get('contact1'), fd.get('contact2')].filter(Boolean),
            chronic_type: fd.get('chronic_type')
        };

        if (typeof supabase !== 'undefined') {
            try {
                const { data, error } = await supabase.from('patients').insert([patientData]).select().single();
                if (error) throw error;
                alert('Patient registered — Code: ' + (data.patient_code || data.id));
            } catch (err) {
                alert('Error saving patient: ' + (err.message || err));
            }
        } else {
            console.log('Cashier patient data (demo):', patientData);
            alert('Patient captured (demo). Check console.');
        }

        document.querySelector('.modal-overlay.active')?.remove();
        if (typeof this.loadPatients === 'function') this.loadPatients();
    }

    // minimal welcome UI
    showWelcomePage() {
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="home-hero">
                <h1>Welcome to Telemed</h1>
                <p>Manage patients, appointments, and quick cashier intake.</p>
                <div class="home-actions">
                    <button class="btn btn-primary" id="login-btn">Login</button>
                    <button class="btn btn-outline" id="signup-btn">Sign Up</button>
                    <button class="btn btn-secondary" id="goto-patients">View Patients</button>
                </div>
            </div>
            <div id="modal-container"></div>
        `;

        this.attachAuthListeners();
        document.getElementById('goto-patients').addEventListener('click', () => this.loadPatients());
    }

    attachAuthListeners() {
        document.getElementById('login-btn').addEventListener('click', () => this.showLoginModal());
        document.getElementById('signup-btn').addEventListener('click', () => this.showSignupModal());
    }

    showLoginModal() {
        const modal = document.getElementById('modal-container');
        modal.innerHTML = `
            <div class="modal-overlay active">
                <div class="modal">
                    <div class="modal-header"><h3>Login</h3><button class="modal-close">&times;</button></div>
                    <div class="modal-body">
                        <form id="login-form">
                            <div class="form-group"><label>Email</label><input type="email" name="email" required></div>
                            <div class="form-group"><label>Password</label><input type="password" name="password" required></div>
                            <div class="form-group"><label>Role</label>
                                <select name="role" required>
                                    <option value="cashier">Cashier</option>
                                    <option value="provider">Provider</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                        <button type="submit" form="login-form" class="btn btn-primary">Login</button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const email = fd.get('email');
            const password = fd.get('password');
            try {
                if (this.supabase) {
                    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
                    if (error) throw error;
                    const userId = data.user?.id || data?.user?.id;
                    let role = null;
                    if (userId) {
                        const { data: profile } = await this.supabase.from('profiles').select('role').eq('id', userId).single();
                        role = profile?.role || null;
                    }
                    if (role) localStorage.setItem('telemed_role', role);
                    document.querySelector('.modal-overlay.active')?.remove();
                    alert('Logged in as ' + (role || 'user'));
                    this.updateRoleUI();
                    if (role === 'cashier') this.showCashierModal(); else this.loadPatients();
                } else {
                    const role = fd.get('role');
                    localStorage.setItem('telemed_role', role);
                    document.querySelector('.modal-overlay.active')?.remove();
                    alert('Logged in (demo) as ' + role);
                    this.updateRoleUI();
                    if (role === 'cashier') this.showCashierModal(); else this.loadPatients();
                }
            } catch (err) {
                alert('Login error: ' + (err.message || err));
            }
        });
    }

    showSignupModal() {
        const modal = document.getElementById('modal-container');
        modal.innerHTML = `
            <div class="modal-overlay active">
                <div class="modal">
                    <div class="modal-header"><h3>Sign Up</h3><button class="modal-close">&times;</button></div>
                    <div class="modal-body">
                        <form id="signup-form">
                            <div class="form-group"><label>Full Name</label><input name="name" required></div>
                            <div class="form-group"><label>Email</label><input type="email" name="email" required></div>
                            <div class="form-group"><label>Password</label><input type="password" name="password" required></div>
                            <div class="form-group"><label>Role</label>
                                <select name="role" required>
                                    <option value="cashier">Cashier</option>
                                    <option value="provider">Provider</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                        <button type="submit" form="signup-form" class="btn btn-primary">Sign Up</button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('signup-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const name = fd.get('name');
            const email = fd.get('email');
            const password = fd.get('password');
            const role = fd.get('role');
            try {
                if (this.supabase) {
                    const { data, error } = await this.supabase.auth.signUp({ email, password });
                    if (error) throw error;
                    const userId = data.user?.id || data?.user?.id;
                    if (userId) {
                        await this.supabase.from('profiles').upsert({ id: userId, full_name: name, role });
                    }
                    localStorage.setItem('telemed_role', role);
                    document.querySelector('.modal-overlay.active')?.remove();
                    alert('Signed up as ' + role + '. Please check your email to confirm login if required.');
                    this.updateRoleUI();
                    if (role === 'cashier') this.showCashierModal(); else this.loadPatients();
                } else {
                    localStorage.setItem('telemed_role', role);
                    document.querySelector('.modal-overlay.active')?.remove();
                    alert('Signed up (demo) as ' + role);
                    this.updateRoleUI();
                    if (role === 'cashier') this.showCashierModal(); else this.loadPatients();
                }
            } catch (err) {
                alert('Signup error: ' + (err.message || err));
            }
        });
    }
}

// Initialize patient manager globally for inline usage
const patientManager = new PatientManager();
