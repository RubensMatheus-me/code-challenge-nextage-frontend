Frontend - Desafio de Estágio  

Este projeto representa a aplicação **Frontend** do desafio de estágio. Foi desenvolvido com **React (Vite/Next.js)** e tem como objetivo fornecer uma interface amigável e responsiva para interação com a API Backend, permitindo que os usuários gerenciem suas tarefas, realizem autenticação e façam recuperação de senha.  

---

## ✅ Funcionalidades  

- [x] Criação de Tarefas  
- [x] Visualização de Tarefas  
- [x] Edição de Tarefas  
- [x] Marcação de Conclusão  
- [x] Exclusão de Tarefas  
- [x] Autenticação de Usuário (Login/JWT)  
- [x] Recuperação de Senha via e-mail  
- [x] Alteração de Senha com código de validação  
- [x] Filtros e Ordenação de Tarefas   
- [x] Criação de tarefas 

---

## 🛠 Tecnologias Utilizadas  

- **Frontend**: React, Axios, React Router DOM, Context API  
- **Backend**: Spring Boot (Java 17)  
- **Banco de Dados**: MySQL  
- **Outras**: TailwindCSS, shadcn/ui, Lucide Icons  

---

## ▶️ Como Configurar e Executar o Projeto  

### Pré-requisitos  
- NPM ou Yarn  

### Passos  

```bash
# 1. Clone o repositório
frontend: git clone https://github.com/RubensMatheus-me/code-challenge-nextage-frontend.git
cd code-challenge-nextage-frontend
backend: https://github.com/RubensMatheus-me/code-challenge-nextage-backend
cd code-challenge-nextage-backend

# 2. Instale as dependências
npm install
# ou
yarn install

# 3. Configure as variáveis de ambiente
jwtkey
spring.mail

# 4. Inicie o frontend
npm start
# ou
yarn start
