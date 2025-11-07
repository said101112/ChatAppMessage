import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config();
export async function sendVerificationEmail(user) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const url = `http://localhost:3000/auth/verify/${user.verifyToken}`;

  await transporter.sendMail({
    from: '"FlowCom" <no-reply@gmail.com>',
    to: user.email,
    subject: "Vérification de votre email",
    html: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vérification de votre compte FlowCom</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background-color: #f0f0f0;
            line-height: 1.6;
            color: #333;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        
        .logo {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .logo-icon {
            font-size: 36px;
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 300;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .welcome-text {
            font-size: 18px;
            color: #2d3748;
            margin-bottom: 25px;
            text-align: center;
        }
        
        .verification-box {
            background: #f8f9fa;
            border-radius: 15px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
            border: 2px dashed #e2e8f0;
        }
        
        .verification-text {
            font-size: 16px;
            color: #4a5568;
            margin-bottom: 20px;
        }
        
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
            color: white;
            text-decoration: none;
            padding: 16px 40px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
            border: none;
            cursor: pointer;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4);
        }
        
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 40px 0;
        }
        
        .feature {
            text-align: center;
            padding: 20px;
            background: #f7fafc;
            border-radius: 12px;
            transition: transform 0.3s ease;
        }
        
        .feature:hover {
            transform: translateY(-5px);
        }
        
        .feature-icon {
            font-size: 24px;
            margin-bottom: 10px;
            color: #25D366;
        }
        
        .feature h3 {
            font-size: 16px;
            color: #2d3748;
            margin-bottom: 8px;
        }
        
        .feature p {
            font-size: 14px;
            color: #718096;
        }
        
        .footer {
            background: #1a202c;
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .footer-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .footer-links a {
            color: #a0aec0;
            text-decoration: none;
            font-size: 14px;
            transition: color 0.3s ease;
        }
        
        .footer-links a:hover {
            color: #25D366;
        }
        
        .copyright {
            font-size: 12px;
            color: #718096;
            margin-top: 20px;
        }
        
        .security-note {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 10px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
            font-size: 14px;
            color: #856404;
        }
        
        @media (max-width: 600px) {
            .content {
                padding: 30px 20px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .features {
                grid-template-columns: 1fr;
            }
            
            .footer-links {
                flex-direction: column;
                gap: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="logo">
                <span class="logo-icon">💬</span>
                FlowCom
            </div>
            <h1>Vérifiez votre compte</h1>
            <p>Rejoignez la conversation en toute sécurité</p>
        </div>
        
        <!-- Content -->
        <div class="content">
            <p class="welcome-text">
                Bonjour <strong>${user.firstName} ${user.lastName}</strong>,<br>
                Bienvenue sur FlowCom - Votre nouvelle application de messagerie
            </p>
            
            <div class="verification-box">
                <p class="verification-text">
                    Pour activer votre compte et commencer à discuter, veuillez cliquer sur le bouton ci-dessous :
                </p>
                <a href="${url}" class="btn">Vérifier mon compte</a>
            </div>
            
            <div class="security-note">
                ⚠️ <strong>Important :</strong> Ce lien expirera dans 24 heures pour des raisons de sécurité.
            </div>
            
            <div class="features">
                <div class="feature">
                    <div class="feature-icon">🔒</div>
                    <h3>Messages chiffrés</h3>
                    <p>Vos conversations sont sécurisées de bout en bout</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">🚀</div>
                    <h3>Rapide & Fluide</h3>
                    <p>Expérience utilisateur optimisée</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">🌐</div>
                    <h3>Multiplateforme</h3>
                    <p>Disponible sur tous vos appareils</p>
                </div>
            </div>
            
            <p style="text-align: center; color: #718096; font-size: 14px; margin-top: 30px;">
                Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
                <span style="color: #25D366; word-break: break-all;">${url}</span>
            </p>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="footer-links">
                <a href="#">Support</a>
                <a href="#">Confidentialité</a>
                <a href="#">Conditions d'utilisation</a>
            </div>
            <p class="copyright">
                © 2024 FlowCom. Tous droits réservés.<br>
                Cette email a été envoyé à [Adresse email de l'utilisateur]
            </p>
        </div>
    </div>
</body>
</html>`
  });
}
