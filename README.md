# 🚀 Dashboard de Pedidos em Tempo Real

Dashboard web moderno para visualizar pedidos em tempo real, conectado ao Supabase com efeito de aurora animado no fundo.

## ✨ Funcionalidades

- ⚡ **Tempo Real**: Recebe pedidos instantaneamente via Supabase Realtime
- 🎨 **Efeito Aurora**: Fundo animado com Three.js (efeito heróis)
- 📱 **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- 🌙 **Dark Mode**: Interface escura e moderna
- 🔔 **Notificações**: Alertas visuais para novos pedidos

## 🛠️ Tecnologias

- HTML5, CSS3, JavaScript (Vanilla)
- [Supabase](https://supabase.com) - Backend e Realtime
- [Three.js](https://threejs.org) - Efeitos visuais 3D
- [Vercel](https://vercel.com) - Deploy

## 📋 Pré-requisitos

1. Conta no Supabase
2. Tabela `pedidos` criada (execute o `setup.sql`)
3. Chaves de configuração do Supabase

## 🚀 Configuração

### 1. Configurar Supabase

Edite o arquivo `script.js` e substitua as credenciais:

```javascript
const SUPABASE_URL = 'SUA_URL_DO_SUPABASE';
const SUPABASE_ANON_KEY = 'SUA_CHAVE_ANON_PUBLIC';
```

### 2. Criar Tabela

Execute o script `setup.sql` no SQL Editor do Supabase Dashboard.

### 3. Deploy no Vercel

```bash
# Instalar Vercel CLI (opcional)
npm i -g vercel

# Fazer deploy
vercel
```

Ou conecte diretamente pelo [Vercel Dashboard](https://vercel.com) apontando para este repositório.

## 📊 Estrutura da Tabela

A tabela `pedidos` deve ter os seguintes campos:

- `id` (BIGSERIAL PRIMARY KEY)
- `nome_cliente` (TEXT)
- `pedido_detalhado` (TEXT)
- `endereco_entrega` (TEXT)
- `atendido` (BOOLEAN, default: false)
- `created_at` (TIMESTAMPTZ, default: NOW())

## 🔗 Integração com n8n

Veja os guias:
- `GUIA_CONEXAO_N8N.md` - Guia completo de conexão
- `CONFIGURACAO_CORRIGIDA_N8N.md` - Correções específicas
- `RESOLVER_ERRO_SUPABASE.md` - Troubleshooting

## 📁 Estrutura do Projeto

```
sandubao/
├── index.html          # Página principal
├── style.css           # Estilos e tema dark
├── script.js           # Lógica do Supabase e Realtime
├── aurora.js           # Efeito visual de aurora
├── setup.sql           # Script SQL para criar tabela
├── vercel.json         # Configuração do Vercel
└── README.md           # Este arquivo
```

## 🎯 Como Usar

1. Configure as credenciais do Supabase no `script.js`
2. Execute o `setup.sql` no Supabase
3. Configure o n8n para inserir pedidos na tabela
4. Abra o dashboard e veja os pedidos em tempo real!

## 🔧 Variáveis de Ambiente (Vercel)

O projeto funciona sem variáveis de ambiente (credenciais estão no código), mas para produção recomendamos usar variáveis de ambiente do Vercel.

## 📝 Licença

MIT

## 👨‍💻 Autor

Desenvolvido para gerenciamento de pedidos em tempo real.

