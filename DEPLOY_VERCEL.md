# 🚀 Guia de Deploy no Vercel

## Opção 1: Deploy via Vercel Dashboard (Recomendado)

### Passo 1: Acessar o Vercel
1. Acesse [https://vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub

### Passo 2: Importar Projeto
1. Clique em **"Add New Project"** ou **"Import Project"**
2. Selecione o repositório **`ryanasafebusiness/sandubao`**
3. Clique em **"Import"**

### Passo 3: Configurar Build
O Vercel detectará automaticamente que é um projeto estático:
- **Framework Preset**: Other
- **Build Command**: (deixe vazio - não precisa build)
- **Output Directory**: (deixe vazio - arquivos na raiz)
- **Install Command**: (deixe vazio)

### Passo 4: Deploy
1. Clique em **"Deploy"**
2. Aguarde o deploy (alguns segundos)
3. Pronto! Seu dashboard estará online! 🎉

### Passo 5: Acessar o Dashboard
O Vercel fornecerá uma URL como:
- `https://sandubao.vercel.app`
- `https://sandubao-{seu-usuario}.vercel.app`

## Opção 2: Deploy via Vercel CLI

### Passo 1: Instalar Vercel CLI
```bash
npm i -g vercel
```

### Passo 2: Login
```bash
vercel login
```

### Passo 3: Deploy
```bash
vercel
```

### Passo 4: Deploy para Produção
```bash
vercel --prod
```

## 🔧 Configurações Adicionais

### Domínio Personalizado
1. No Vercel Dashboard, vá em **Settings** → **Domains**
2. Adicione seu domínio personalizado
3. Siga as instruções de DNS

### Variáveis de Ambiente (Opcional)
Se quiser usar variáveis de ambiente para as chaves do Supabase:

1. No Vercel Dashboard, vá em **Settings** → **Environment Variables**
2. Adicione:
   - `VITE_SUPABASE_URL` = `https://xktfkbflnjpsdhgxwywt.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `sua_chave_anon`

3. Atualize o `script.js` para usar:
   ```javascript
   const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'SUA_URL_DO_SUPABASE';
   const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'SUA_CHAVE_ANON_PUBLIC';
   ```

## ✅ Verificação Pós-Deploy

Após o deploy, verifique:

1. ✅ O dashboard carrega corretamente
2. ✅ O efeito Aurora aparece no fundo
3. ✅ As credenciais do Supabase estão configuradas
4. ✅ O Realtime está funcionando (teste inserindo um pedido)

## 🔄 Deploy Automático

O Vercel faz deploy automático sempre que você fizer push no GitHub:

```bash
git add .
git commit -m "Sua mensagem"
git push
```

O Vercel detectará automaticamente e fará o deploy!

## 📝 Notas

- O arquivo `vercel.json` já está configurado
- O projeto é estático, não precisa de build
- Funciona perfeitamente com CDN do Vercel
- Todas as dependências (Three.js, Supabase) são carregadas via CDN

## 🆘 Problemas Comuns

**Erro 404 ao acessar**
- Verifique se os arquivos estão na raiz do repositório
- Confirme que `index.html` existe

**Efeito Aurora não aparece**
- Verifique se o Three.js está carregando (Console do navegador)
- Confirme que o CDN está acessível

**Supabase não conecta**
- Verifique as credenciais no `script.js`
- Confirme que o Realtime está habilitado na tabela

