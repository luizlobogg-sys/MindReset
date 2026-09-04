# Login Google e sincronização na nuvem

O MindReset V7 já contém a interface e a integração de Firebase Authentication + Cloud Firestore, mas o projeto precisa ser configurado com as credenciais do seu próprio projeto Firebase antes de o login funcionar.

1. Crie um projeto no Firebase Console.
2. Ative Authentication > Sign-in method > Google.
3. Crie/ative o Cloud Firestore.
4. Adicione um app Web e copie a configuração Firebase.
5. No `www/index.html`, substitua os valores `YOUR_FIREBASE_*` no objeto `firebaseConfig`.
6. Configure as regras do Firestore para que cada usuário só leia/escreva `users/{uid}`.
7. Para Android/produção, também configure o domínio/fluxo OAuth conforme o Firebase Console e registre os dados do app.

O app continua funcionando localmente sem login. Quando o Firebase estiver configurado e o usuário entrar com Google, o estado do MindReset é sincronizado no documento `users/{uid}`.

Não existe garantia técnica de que dados ficarão salvos "para sempre". A persistência depende da conta/projeto Firebase, das regras, disponibilidade do serviço e de não apagar os dados.
