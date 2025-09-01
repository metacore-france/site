document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    // Mettez vos identifiants EmailJS ici
    const SERVICE_ID = 'service_ey0aszf'; 
    const TEMPLATE_ID = 'template_dso6obl';
    const PUBLIC_KEY = 'hjAYYh4RKUtQyCWLa';

    // Initialisation d'EmailJS avec votre clé publique
    emailjs.init(PUBLIC_KEY);

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Afficher le message d'envoi en cours
            formStatus.textContent = "Envoi en cours...";
            formStatus.className = '';
            
            // Collecte des données du formulaire
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const serviceType = document.getElementById('serviceType').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Préparation des paramètres de l'email
            const templateParams = {
                from_name: name,
                from_email: email,
                service_type: serviceType,
                subject: subject,
                message: message,
            };
            
            emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
                .then(() => {
                    // Succès de l'envoi
                    formStatus.textContent = "Votre message a été envoyé avec succès !";
                    formStatus.className = 'success';
                    contactForm.reset(); // Réinitialiser le formulaire
                }, (error) => {
                    // Échec de l'envoi
                    console.error('Échec de l\'envoi...', error);
                    formStatus.textContent = "Échec de l'envoi. Veuillez vérifier votre connexion ou réessayer plus tard.";
                    formStatus.className = 'error';
                });
        });
    }
});