const session = JSON.parse(localStorage.getItem('user_session'));
if (!session) window.location.href = 'index.html';

document.getElementById('welcome').innerText = "Bienvenue, " + session.name;

const db = JSON.parse(localStorage.getItem('bijoux_db'));
const grid = document.getElementById('grid');

function render() {
    grid.innerHTML = db.produits.map(p => `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="card h-100 shadow-sm border-0">
                <div class="card-img-container p-3" style="background: #fdfdfd;">
                    <img src="${p.image}" class="card-img-top" style="height:200px; object-fit:contain;">
                </div>
                <div class="card-body text-center d-flex flex-column">
                    <h6 class="fw-bold mb-2" style="height: 40px; overflow: hidden;">${p.nom}</h6>
                    <p class="text-warning fs-5 fw-bold mb-3">${p.prix} DH</p>
                    <button onclick="acheter('${p.nom}', ${p.prix})" class="btn btn-buy mt-auto w-100">
                        <i class="fas fa-shopping-cart me-2"></i>Commander
                    </button>
                </div>
            </div>
        </div>`).join('');
}

function acheter(nom, prix) {
    db.orders.push({ 
        id: Date.now(), 
        client: session.name, 
        produit: nom, 
        prix: prix, 
        status: 'Payé', 
        date: new Date().toLocaleDateString() 
    });
    localStorage.setItem('bijoux_db', JSON.stringify(db));
    alert("Merci pour votre achat ! La commande de " + nom + " est validée.");
}

function logout() { 
    localStorage.removeItem('user_session'); 
    window.location.href = 'index.html'; 
}

render();