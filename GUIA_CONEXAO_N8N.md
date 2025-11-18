# Guia de Conexão: n8n → Supabase

Este guia mostra como conectar seu workflow n8n ao Supabase para inserir pedidos na tabela.

## 📋 Passo a Passo

### 1. Adicionar o Nó Supabase no n8n

1. No seu workflow "AI AGENT | PEDIDOS"
2. Após o nó "PEDIDOS" (AI Agent), clique no **"+"** ao lado do output
3. Procure por **"Supabase"** na barra de busca de nós
4. Selecione o nó **"Supabase"**

### 2. Configurar Credenciais do Supabase

No nó Supabase:

1. Clique em **"Create New Credential"** (ou use uma existente)
2. Preencha os campos:
   - **Host**: `xktfkbflnjpsdhgxwywt.supabase.co`
   - **Service Role Secret**: [Sua chave de serviço do Supabase]
     - ⚠️ **IMPORTANTE**: Use a **Service Role Key**, não a **Anon Key**
     - Para obter: Supabase Dashboard → Settings → API → `service_role` secret
   - **Database**: Deixe em branco (usa o padrão)
   - **Schema**: `public` (padrão)
   - **Port**: `5432` (padrão)

3. Clique em **"Save"**

### 3. Configurar a Operação de Inserção

No nó Supabase:

1. **Operation**: Selecione **"Insert Row(s)"**
2. **Table**: Digite `pedidos`
3. **Columns**: Configure os campos mapeando do output do AI Agent:

```
{
  "nome_cliente": "{{ $json.nome_cliente }}",
  "pedido_detalhado": "{{ $json.pedido_detalhado }}",
  "endereco_entrega": "{{ $json.endereco_entrega }}",
  "atendido": false
}
```

**OU** use o modo visual clicando em **"Add Column"** para cada campo:
- `nome_cliente` → Mapeie do output do AI Agent
- `pedido_detalhado` → Mapeie do output do AI Agent  
- `endereco_entrega` → Mapeie do output do AI Agent
- `atendido` → Valor fixo: `false`

### 4. Estrutura Esperada do Output do AI Agent

O AI Agent deve retornar um JSON com esta estrutura:

```json
{
  "nome_cliente": "João Silva",
  "pedido_detalhado": "1 X-Burger, 1 Batata Frita, 1 Coca-Cola",
  "endereco_entrega": "Rua Exemplo, 123 - Centro - São Paulo/SP"
}
```

### 5. Exemplo de Mapeamento de Campos

Se o output do AI Agent tiver nomes diferentes, você pode usar expressões n8n:

```javascript
// Para nome_cliente
{{ $json.cliente || $json.nome || $json.customer_name }}

// Para pedido_detalhado
{{ $json.pedido || $json.itens || $json.order_details }}

// Para endereco_entrega
{{ $json.endereco || $json.address || $json.endereco_completo }}
```

### 6. Nó "Set" (Opcional - para transformar dados)

Se o output do AI Agent não estiver no formato correto, adicione um nó **"Set"** antes do Supabase:

1. Adicione o nó **"Set"** entre o AI Agent e o Supabase
2. Configure os campos:
   - **Keep Only Set Fields**: Desmarque
   - **Fields to Set**:
     - Name: `nome_cliente` → Value: `{{ $json.cliente }}`
     - Name: `pedido_detalhado` → Value: `{{ $json.pedido }}`
     - Name: `endereco_entrega` → Value: `{{ $json.endereco }}`
     - Name: `atendido` → Value: `false`

### 7. Testar a Conexão

1. Clique em **"Execute Workflow"** no n8n
2. Verifique os logs do nó Supabase
3. Confira no dashboard web se o pedido apareceu em tempo real

## 🔑 Como Obter a Service Role Key

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **API**
4. Copie a chave **`service_role`** (NÃO use a `anon` key aqui)
5. ⚠️ **ATENÇÃO**: Esta chave tem permissões completas - mantenha-a segura!

## 📊 Estrutura Final do Workflow

```
[Trigger] → [AI Agent | PEDIDOS] → [Set (opcional)] → [Supabase] → ✅
```

## ✅ Verificação

Após configurar:

1. Execute o workflow no n8n
2. Abra o dashboard em: `http://localhost:8000`
3. O pedido deve aparecer automaticamente em tempo real!

## 🐛 Troubleshooting

**Erro: "permission denied"**
- Use a **Service Role Key** em vez da Anon Key

**Erro: "relation does not exist"**
- Verifique se executou o script `setup.sql` no Supabase

**Pedidos não aparecem em tempo real**
- Verifique se o Realtime está habilitado na tabela `pedidos`
- No Supabase: Database → Replication → Ative para `pedidos`

**Erro de conexão**
- Verifique se o host está correto: `xktfkbflnjpsdhgxwywt.supabase.co`
- Verifique se as credenciais estão corretas

