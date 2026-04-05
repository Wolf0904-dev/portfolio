
       
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });

        // Scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

        // Interactive car cards
        document.querySelectorAll('.car-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02) rotate(1deg)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1) rotate(0deg)';
            });
        });

        // Book buttons
        document.querySelectorAll('.book-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const carName = this.closest('.car-info').querySelector('.car-name').textContent;
                alert(`Réservation initiée pour ${carName} ! 🚗\nVous serez redirigé vers le formulaire de réservation.`);
            });
        });

        // Search button
        document.querySelector('.search-button').addEventListener('click', function() {
            alert('Recherche en cours... 🔍\nNous recherchons les meilleures offres pour vous !');
        });
