# 🔧 Como Resolver "Error fetching options from Supabase"

## ⚠️ Problema Atual

Você está vendo o erro:
- **"Error fetching options from Supabase"** no campo "Table Name or ID"

Este erro aparece quando o n8n não consegue buscar a lista de tabelas do Supabase, mas **NÃO IMPEDE** que você configure manualmente!

## ✅ Solução Rápida (Funciona Sempre)

### Passo 1: Ignorar o Erro e Digitar Manualmente

1. **No campo "Table Name or ID"**, ignore o erro (é apenas visual)
2. **Clique dentro do campo** e digite manualmente: `pedidos`
3. Não use aspas, apenas: `pedidos`

### Passo 2: Verificar se a Operação está Correta

- **Resource**: `Row` ✅
- **Operation**: `Create` ✅ (está correto!)

### Passo 3: Adicionar os Campos

Clique em **"Add Field"** e adicione cada campo:

#### Campo 1: `nome_cliente`
- **Column**: `nome_cliente`
- **Value**: `{{ JSON.parse($json.output).nome_cliente }}`

#### Campo 2: `pedido_detalhado`
- **Column**: `pedido_detalhado`
- **Value**: `{{ JSON.parse($json.output).pedido }}`

#### Campo 3: `endereco_entrega`
- **Column**: `endereco_entrega`
- **Value**: `{{ JSON.parse($json.output).endereco }}`

#### Campo 4: `atendido`
- **Column**: `atendido`
- **Value**: `false` (sem aspas, valor booleano)

### Passo 4: Executar

1. Clique em **"Execute step"** (botão vermelho no topo)
2. Verifique o OUTPUT no painel direito
3. Se aparecer erro, continue para as soluções abaixo

---

## 🔍 Por que o Erro Acontece?

### Causas Possíveis:

1. **Credenciais incorretas** (mais comum)
2. **Service Role Key não configurada**
3. **Tabela não existe ainda**
4. **Problema de conexão**

---

## 🛠️ Soluções Detalhadas

### Solução 1: Verificar e Corrigir Credenciais

1. **Clique em "Supabase account 3"** (ou o nome da sua credencial)
2. **Ou clique em "Create New Credential"**

Configure assim:

```
Host: xktfkbflnjpsdhgxwywt.supabase.co
Service Role Secret: [SUA_SERVICE_ROLE_KEY]
Database: [deixe em branco]
Schema: public
Port: 5432
```

#### ⚠️ IMPORTANTE: Service Role Key

Você precisa usar a **Service Role Key**, NÃO a Anon Key!

**Como obter:**
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **API**
4. Copie a chave **`service_role`** (não a `anon`!)

### Solução 2: Verificar se a Tabela Existe

1. Acesse o Supabase Dashboard
2. Vá em **Table Editor**
3. Verifique se a tabela `pedidos` existe
4. Se não existir, execute o script `setup.sql` no **SQL Editor**

### Solução 3: Verificar Permissões

Se mesmo com a Service Role Key não funcionar:

1. No Supabase Dashboard → **SQL Editor**
2. Execute este comando para verificar permissões:

```sql
-- Verificar se a tabela existe e tem permissões corretas
SELECT 
    tablename 
FROM 
    pg_tables 
WHERE 
    schemaname = 'public' 
    AND tablename = 'pedidos';
```

3. Se retornar resultado, a tabela existe
4. Se não retornar nada, execute o `setup.sql`

---

## 🎯 Configuração Completa do Nó Supabase

### Configuração Visual:

```
┌─────────────────────────────────────┐
│ Create a row                        │
├─────────────────────────────────────┤
│ Credential: Supabase account 3     │
│ Resource: Row                       │
│ Operation: Create                   │
│ Table Name or ID: pedidos          │ ← Digite manualmente
│ Data to Send: Define Below...      │
│                                     │
│ Fields to Send:                     │
│ ┌─────────────────────────────────┐ │
│ │ nome_cliente                    │ │
│ │ {{ JSON.parse($json.output)... │ │
│ ├─────────────────────────────────┤ │
│ │ pedido_detalhado                │ │
│ │ {{ JSON.parse($json.output)... │ │
│ ├─────────────────────────────────┤ │
│ │ endereco_entrega                │ │
│ │ {{ JSON.parse($json.output)... │ │
│ ├─────────────────────────────────┤ │
│ │ atendido                        │ │
│ │ false                           │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 🧪 Teste de Conexão

### 1. Teste Simples (Sem Nó Code)

Se você ainda não adicionou o nó Code, teste direto no Supabase:

**No campo "Fields to Send", adicione:**

| Column | Value |
|--------|-------|
| `nome_cliente` | `{{ JSON.parse($json.output).nome_cliente }}` |
| `pedido_detalhado` | `{{ JSON.parse($json.output).pedido }}` |
| `endereco_entrega` | `{{ JSON.parse($json.output).endereco }}` |
| `atendido` | `false` |

### 2. Se o AI Agent tiver Executado

1. **Execute o nó "PEDIDOS" primeiro** (clique em "Execute previous nodes")
2. Verifique o INPUT no painel esquerdo
3. Deve mostrar o JSON com o campo `output`
4. Então execute o nó Supabase

---

## ✅ Checklist de Verificação

Antes de executar, verifique:

- [ ] Credencial do Supabase configurada com **Service Role Key**
- [ ] Tabela `pedidos` existe no Supabase
- [ ] Operação está como **"Create"** (não "Update")
- [ ] Campo "Table Name or ID" preenchido manualmente: `pedidos`
- [ ] Todos os 4 campos adicionados em "Fields to Send"
- [ ] Expressões JSON.parse() corretas para cada campo
- [ ] Campo `atendido` com valor `false` (sem aspas)

---

## 🚀 Workflow Recomendado

Para melhor organização, use este fluxo:

```
[Trigger] → [AI Agent | PEDIDOS] → [Code] → [Supabase] → ✅
```

**Com o nó Code entre o AI Agent e o Supabase:**

1. O nó Code faz o parse do JSON e transforma os campos
2. O nó Supabase recebe dados já formatados
3. Fica mais fácil de manter e debugar

**Código do nó Code:**
```javascript
const items = [];
for (const item of $input.all()) {
  const outputData = JSON.parse(item.json.output);
  items.push({
    json: {
      nome_cliente: outputData.nome_cliente || 'Anônimo',
      pedido_detalhado: outputData.pedido || '',
      endereco_entrega: outputData.endereco || '',
      atendido: false
    }
  });
}
return items;
```

**Então no Supabase use expressões simples:**
- `nome_cliente`: `{{ $json.nome_cliente }}`
- `pedido_detalhado`: `{{ $json.pedido_detalhado }}`
- `endereco_entrega`: `{{ $json.endereco_entrega }}`
- `atendido`: `false`

---

## 🆘 Ainda com Erro?

Se após seguir todos os passos ainda houver erro:

1. **Verifique o OUTPUT do nó Supabase**
2. Copie a mensagem de erro completa
3. Verifique os logs do Supabase no dashboard
4. Confirme que a Service Role Key está correta
5. Tente criar uma nova credencial do zero

---

## 💡 Dica Final

O erro "Error fetching options from Supabase" é apenas um aviso visual. Se você digitar manualmente `pedidos` no campo, tudo funciona normalmente! 

A busca automática de tabelas é uma conveniência, mas não é obrigatória.

