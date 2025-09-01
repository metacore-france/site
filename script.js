document.addEventListener('DOMContentLoaded', () => {
    // Éléments du header et des overlays
    const stickyHeader = document.getElementById('stickyHeader');
    const mainHeader = document.getElementById('mainHeader');
    const loginOverlay = document.getElementById('loginOverlay');
    const donationOverlay = document.getElementById('donationOverlay');
    const userIcon = document.getElementById('userIcon');
    const userIconSticky = document.getElementById('userIconSticky');
    const closeLoginBtn = document.getElementById('closeLogin');
    const soutenirBtn = document.getElementById('soutenir-btn');
    const closeDonationBtn = document.getElementById('closeDonation');

    // Éléments des étapes de don
    const step1 = document.getElementById('donation-step-1');
    const step2 = document.getElementById('donation-step-2');

    // Éléments du formulaire de don (étape 1)
    const amountButtons = document.querySelectorAll('.amount-btn');
    const donationAmountInput = document.getElementById('donationAmount');
    const donationMessageInput = document.getElementById('donationMessage');
    const continueBtn = document.getElementById('continue-btn');

    // Éléments du virement bancaire (étape 2)
    const ibanCopyBtn = document.querySelector('.copy-btn');
    const ibanInput = document.getElementById('iban');
    const qrCodeImg = document.getElementById('qrCode');
    const backBtn = document.getElementById('back-btn');

    // IBAN pour les virements
    const iban = "FR7628233000017695100980019";
    const iban_pretty = "FR76 2823 3000 0176 9510 0980 019";
    
    // Fonctions pour gérer les overlays et les étapes
    function openOverlay(overlay) {
        overlay.classList.add('is-open');
        document.body.classList.add('blur-bg');
        document.body.classList.add('no-scroll');
    }

    function closeOverlay(overlay) {
        overlay.classList.remove('is-open');
        document.body.classList.remove('blur-bg');
        document.body.classList.remove('no-scroll');
        // Réinitialiser les étapes de don
        step1.style.display = 'block';
        step2.style.display = 'none';
    }

    function showStep(stepId) {
        step1.style.display = 'none';
        step2.style.display = 'none';
        document.getElementById(stepId).style.display = 'block';
    }

    // Logique du "Sticky Header"
    window.addEventListener('scroll', () => {
        if (window.scrollY > mainHeader.offsetHeight) {
            stickyHeader.style.top = '0';
            stickyHeader.style.opacity = '1';
        } else {
            stickyHeader.style.top = '-100px';
            stickyHeader.style.opacity = '0';
        }
    });

    // Effet "hover" sur les cartes
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    // Gestion de l'overlay de connexion
    userIcon.addEventListener('click', () => openOverlay(loginOverlay));
    userIconSticky.addEventListener('click', () => openOverlay(loginOverlay));
    closeLoginBtn.addEventListener('click', () => closeOverlay(loginOverlay));
    loginOverlay.addEventListener('click', (e) => {
        if (e.target.id === 'loginOverlay') {
            closeOverlay(loginOverlay);
        }
    });
    
    // Gestion de l'overlay de don
    soutenirBtn.addEventListener('click', () => openOverlay(donationOverlay));
    closeDonationBtn.addEventListener('click', () => closeOverlay(donationOverlay));
    donationOverlay.addEventListener('click', (e) => {
        if (e.target.id === 'donationOverlay') {
            closeOverlay(donationOverlay);
        }
    });

    // Logique des boutons de montant de don
    amountButtons.forEach(button => {
        button.addEventListener('click', () => {
            amountButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            donationAmountInput.value = button.dataset.amount;
        });
    });

    // Désélectionner les boutons si l'utilisateur entre un montant personnalisé
    donationAmountInput.addEventListener('input', () => {
        amountButtons.forEach(btn => btn.classList.remove('selected'));
    });

    // Étape 1: Continuer vers l'IBAN
    continueBtn.addEventListener('click', () => {
        const amount = parseFloat(donationAmountInput.value);
        if (isNaN(amount) || amount <= 0) {
            // Utiliser un message affiché sur la page au lieu d'une alerte bloquante
            const messageElement = document.createElement('p');
            messageElement.textContent = "Veuillez entrer un montant valide.";
            messageElement.style.color = 'red';
            messageElement.style.marginTop = '1rem';
            messageElement.style.fontSize = '0.9rem';
            messageElement.classList.add('temp-message');
            document.getElementById('donation-step-1').appendChild(messageElement);

            setTimeout(() => {
                messageElement.remove();
            }, 3000);
            return;
        }
        
        // Créer un QR code dynamique (simplifié pour une meilleure compatibilité)
        const qrData = `iban:${iban}?amount=${amount}&currency=EUR`;
        const encodedData = encodeURIComponent(qrData);
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodedData}`;
        qrCodeImg.src = qrUrl;

        showStep('donation-step-2');
    });

    // Étape 2: Retourner à la sélection de montant
    backBtn.addEventListener('click', () => showStep('donation-step-1'));

    // Copier l'IBAN avec fallback
    ibanCopyBtn.addEventListener('click', () => {
        const textToCopy = ibanInput.value;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Afficher un petit message de confirmation au lieu d'une alerte
                const messageElement = document.createElement('span');
                messageElement.textContent = "Copié !";
                messageElement.style.marginLeft = '10px';
                messageElement.style.color = 'lightgreen';
                messageElement.classList.add('temp-message');
                ibanCopyBtn.parentNode.appendChild(messageElement);
                setTimeout(() => {
                    messageElement.remove();
                }, 2000);
            }).catch(err => {
                console.error('Erreur lors de la copie (clipboard API) :', err);
                // Fallback pour les navigateurs plus anciens ou les environnements restreints
                const textArea = document.createElement("textarea");
                textArea.value = textToCopy;
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    const successful = document.execCommand('copy');
                    const msg = successful ? 'Copié !' : 'Erreur de copie';
                    // Afficher un petit message de confirmation
                    const messageElement = document.createElement('span');
                    messageElement.textContent = msg;
                    messageElement.style.marginLeft = '10px';
                    messageElement.style.color = successful ? 'lightgreen' : 'red';
                    messageElement.classList.add('temp-message');
                    ibanCopyBtn.parentNode.appendChild(messageElement);
                    setTimeout(() => {
                        messageElement.remove();
                    }, 2000);
                } catch (err) {
                    console.error('Erreur lors de la copie (execCommand) :', err);
                }
                document.body.removeChild(textArea);
            });
        }
    });
});
