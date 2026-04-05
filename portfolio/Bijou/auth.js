(function initDB() {
    let db = JSON.parse(localStorage.getItem('bijoux_db'));
    
    if (!db || !db.produits || db.produits.length < 20) {
        db = {
            users: [
                { id: 1, nom: "Admin Mohamed", email: "mohamedsoubhi", pass: "admin123", role: "admin" }
            ],
            produits: [
                { id: 1, nom: "Alliance Or Pur 18K", prix: 3200, categorie: "Bagues", image: "bague_or.png" },
                { id: 2, nom: "Bague Argent Marquise", prix: 2900, categorie: "Bagues", image: "bague_argent.png" },
                { id: 3, nom: "Pendentif Amulette Solaire", prix: 4800, categorie: "Colliers", image: "amullette_or.jpg" },
                { id: 4, nom: "Bague Trilogie Or Jaune", prix: 15500, categorie: "Bagues", image: "bague_or.png" },
                { id: 5, nom: "Collier Rivière Argent", prix: 8900, categorie: "Colliers", image: "amullette_or.jpg" },
                { id: 6, nom: "Chevalière Royale Argent", prix: 4200, categorie: "Bagues", image: "bague_argent.png" },
                { id: 7, nom: "Bracelet Manchette Or", prix: 12500, categorie: "Bracelets", image: "bague_or.png" },
                { id: 8, nom: "Pendentif Émeraude", prix: 7600, categorie: "Colliers", image: "amullette_or.jpg" },
                { id: 9, nom: "Alliance Diamant", prix: 21000, categorie: "Bagues", image: "bague_or.png" },
                { id: 10, nom: "Bague Saphir Moderne", prix: 5400, categorie: "Bagues", image: "bague_argent.png" },
                { id: 11, nom: "Collier Cristal de Roche", prix: 3100, categorie: "Colliers", image: "amullette_or.jpg" },
                { id: 12, nom: "Bague Fine Or Rose", prix: 1800, categorie: "Bagues", image: "bague_or.png" },
                { id: 13, nom: "Bracelet Gourmette Or", prix: 5200, categorie: "Bracelets", image: "bague_or.png" },
                { id: 14, nom: "Collier Perle de Culture", prix: 4100, categorie: "Colliers", image: "amullette_or.jpg" },
                { id: 15, nom: "Bague Émeraude Royale", prix: 18500, categorie: "Bagues", image: "bague_or.png" },
                { id: 16, nom: "Bracelet Jonc Argent", prix: 1200, categorie: "Bracelets", image: "bague_argent.png" },
                { id: 17, nom: "Collier Ras de cou Diamant", prix: 9500, categorie: "Colliers", image: "amullette_or.jpg" },
                { id: 18, nom: "Bague Topaze et Argent", prix: 3400, categorie: "Bagues", image: "bague_argent.png" },
                { id: 19, nom: "Montre Classique Gold", prix: 22000, categorie: "Montres", image: "bague_or.png" },
                { id: 20, nom: "Boucles d'oreilles Or", prix: 2800, categorie: "Boucles", image: "bague_or.png" },
                { id: 21, nom: "Bague Rubis Passion", prix: 14200, categorie: "Bagues", image: "bague_or.png" },
                { id: 22, nom: "Pendentif Cœur Argent", prix: 1500, categorie: "Colliers", image: "amullette_or.jpg" },
                { id: 23, nom: "Bracelet Multi-tours", prix: 3600, categorie: "Bracelets", image: "bague_argent.png" },
                { id: 24, nom: "Alliance Platine", prix: 7800, categorie: "Bagues", image: "bague_argent.png" }
            ],
            orders: [],
            categories: [
                {id:1, nom:"Bagues"}, {id:2, nom:"Colliers"}, {id:3, nom:"Bracelets"}, {id:4, nom:"Montres"}
            ],
            messages: []
        };
        localStorage.setItem('bijoux_db', JSON.stringify(db));
    }
})();

function toggleForms() {
    const login = document.getElementById('loginForm');
    const reg = document.getElementById('registerForm');
    login.style.display = (login.style.display === "block") ? "none" : "block";
    reg.style.display = (reg.style.display === "none") ? "block" : "none";
}

function forceReset() {
    if(confirm("Réinitialiser avec les 24 produits ?")) {
        localStorage.clear();
        location.reload();
    }
}

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let db = JSON.parse(localStorage.getItem('bijoux_db'));
    const newUser = {
        id: Date.now(),
        nom: document.getElementById('regName').value,
        email: document.getElementById('regEmail').value,
        pass: document.getElementById('regPass').value,
        role: 'user'
    };
    db.users.push(newUser);
    localStorage.setItem('bijoux_db', JSON.stringify(db));
    alert("Compte créé pour " + newUser.nom);
    toggleForms();
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const userInp = document.getElementById('loginEmail').value.trim();
    const passInp = document.getElementById('loginPass').value.trim();

    if (userInp === "mohamedsoubhi" && passInp === "admin123") {
        localStorage.setItem('user_session', JSON.stringify({ role: 'admin', name: 'Mohamed' }));
        window.location.href = 'admin.html';
        return;
    }

    const db = JSON.parse(localStorage.getItem('bijoux_db'));
    const user = db.users.find(u => u.email === userInp && u.pass === passInp);
    if (user) {
        localStorage.setItem('user_session', JSON.stringify({ role: 'user', name: user.nom }));
        window.location.href = 'user.html';
    } else { 
        alert("Identifiants incorrects."); 
    }
});