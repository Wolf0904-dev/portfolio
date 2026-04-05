const app = {
    db: () => JSON.parse(localStorage.getItem('bijoux_db')),
    save: (data) => localStorage.setItem('bijoux_db', JSON.stringify(data)),

    showDash: () => {
        const data = app.db();
        const revenus = data.orders.reduce((acc, o) => acc + parseInt(o.prix), 0);
        const attente = data.orders.filter(o => o.status === 'En attente').length;

        document.getElementById('main').innerHTML = `
            <h2>Tableau de Bord</h2>
            <div class="row g-3 my-4">
                <div class="col-md-3"><div class="stats-card"><h3>${data.users.length}</h3><p>Utilisateurs</p></div></div>
                <div class="col-md-3"><div class="stats-card"><h3>${data.orders.length}</h3><p>Commandes</p></div></div>
                <div class="col-md-3"><div class="stats-card"><h3>${revenus} DH</h3><p>Revenus</p></div></div>
                <div class="col-md-3"><div class="stats-card border-danger"><h3>${attente}</h3><p>En attente</p></div></div>
            </div>
            <div class="row g-4">
                <div class="col-md-4"><div class="chart-box"><canvas id="c1"></canvas></div></div>
                <div class="col-md-4"><div class="chart-box"><canvas id="c2"></canvas></div></div>
                <div class="col-md-4"><div class="chart-box"><canvas id="c3"></canvas></div></div>
                <div class="col-md-6"><div class="chart-box"><canvas id="c4"></canvas></div></div>
                <div class="col-md-6"><div class="chart-box"><canvas id="c5"></canvas></div></div>
            </div>`;
        app.renderCharts();
    },

    renderCharts: () => {
        const ctx = (id) => document.getElementById(id).getContext('2d');
        new Chart(ctx('c1'), { type: 'pie', data: { labels: ['Ventes', 'Stock'], datasets: [{ data: [60, 40], backgroundColor: ['#d4af37','#333'] }] } });
        new Chart(ctx('c2'), { type: 'doughnut', data: { labels: ['Or', 'Argent'], datasets: [{ data: [70, 30], backgroundColor: ['#d4af37','#999'] }] } });
        new Chart(ctx('c3'), { type: 'polarArea', data: { labels: ['Bagues', 'Colliers', 'Bracelets'], datasets: [{ data: [15, 10, 5] }] } });
        new Chart(ctx('c4'), { type: 'bar', data: { labels: ['Jan', 'Fev', 'Mar'], datasets: [{ label: 'Ventes', data: [15, 25, 20], backgroundColor: '#d4af37' }] } });
        new Chart(ctx('c5'), { type: 'line', data: { labels: ['S1', 'S2', 'S3'], datasets: [{ label: 'CA', data: [5000, 18000, 12000], borderColor: '#d4af37' }] } });
    },

    showCRUD: (entity, search = '') => {
        let data = app.db()[entity] || [];
        if(search) {
            data = data.filter(item => Object.values(item).some(val => String(val).toLowerCase().includes(search.toLowerCase())));
        }
        const cols = data.length > 0 ? Object.keys(data[0]) : ["nom"];
        
        document.getElementById('main').innerHTML = `
            <div class="d-flex justify-content-between mb-4">
                <h2>Gestion : ${entity.toUpperCase()}</h2>
                <button class="btn btn-success" onclick="app.openModal('${entity}')"><i class="fas fa-plus"></i> Ajouter</button>
            </div>
            <div class="bg-white p-3 rounded shadow-sm">
                <div class="row mb-3">
                    <div class="col-md-8">
                        <input type="text" class="form-control" placeholder="Rechercher..." oninput="app.showCRUD('${entity}', this.value)">
                    </div>
                    <div class="col-md-4 text-end">
                        <button class="btn btn-outline-secondary btn-sm" onclick="app.exportCSV('${entity}')">Export CSV</button>
                    </div>
                </div>
                <table class="table">
                    <thead class="table-dark">
                        <tr>${cols.map(c => `<th>${c}</th>`).join('')}<th>Actions</th></tr>
                    </thead>
                    <tbody>
                        ${data.map(item => `
                            <tr>
                                ${cols.map(c => `<td>${item[c]}</td>`).join('')}
                                <td>
                                    <button class="btn btn-sm btn-info text-white" onclick="app.openModal('${entity}', ${item.id})"><i class="fas fa-edit"></i></button>
                                    <button class="btn btn-sm btn-danger" onclick="app.deleteItem('${entity}', ${item.id})"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>`).join('')}
                    </tbody>
                </table>
            </div>`;
    },

    openModal: (entity, id = null) => {
        const db = app.db();
        const item = id ? db[entity].find(i => i.id === id) : null;
        
        // Liste des champs par entité pour l'ajout
        const schema = {
            users: ['nom', 'email', 'pass', 'role'],
            produits: ['nom', 'prix', 'categorie', 'image'],
            orders: ['client', 'produit', 'prix', 'status'],
            categories: ['nom', 'desc'],
            messages: ['auteur', 'sujet', 'date']
        };

        const fields = schema[entity] || ['nom'];
        document.getElementById('modalTitle').innerText = id ? "Modifier" : "Nouvel Ajout";
        const form = document.getElementById('crudForm');
        
        form.innerHTML = fields.map(f => `
            <div class="mb-3">
                <label class="form-label text-capitalize">${f}</label>
                <input type="text" class="form-control" name="${f}" value="${item ? item[f] : ''}" required>
            </div>`).join('') + `<input type="hidden" name="id" value="${id || ''}">`;
            
        new bootstrap.Modal(document.getElementById('crudModal')).show();
        
        form.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const entry = Object.fromEntries(formData.entries());
            let currentDB = app.db();
            
            if(entry.id) {
                // Modification (Update)
                const index = currentDB[entity].findIndex(i => i.id == entry.id);
                currentDB[entity][index] = {...currentDB[entity][index], ...entry, id: parseInt(entry.id)};
            } else {
                // AJOUT (Create)
                entry.id = Date.now();
                currentDB[entity].push(entry);
            }
            
            app.save(currentDB);
            bootstrap.Modal.getInstance(document.getElementById('crudModal')).hide();
            app.showCRUD(entity);
        };
    },

    deleteItem: (entity, id) => {
        if(confirm("Supprimer définitivement ?")) {
            let data = app.db();
            data[entity] = data[entity].filter(i => i.id !== id);
            app.save(data);
            app.showCRUD(entity);
        }
    },

    exportCSV: (entity) => {
        const data = app.db()[entity];
        const csv = [Object.keys(data[0]).join(','), ...data.map(r => Object.values(r).join(','))].join('\n');
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
        a.download = `${entity}.csv`;
        a.click();
    }
};

app.showDash();