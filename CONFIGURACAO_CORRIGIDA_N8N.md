# Configuração Corrigida - n8n → Supabase

## ⚠️ Problemas Identificados na Sua Configuração Atual

1. **Operação errada**: Está como "Update" → deve ser **"Insert Row(s)"**
2. **JSON aninhado**: O output vem como string JSON dentro de `output`
3. **Nomes de campos**: O AI Agent retorna `pedido` e `endereco`, não `pedido_detalhado` e `endereco_entrega`

## ✅ Solução: Adicionar Nó "Code" para Processar o JSON

Como o output vem assim:
```json
{
  "output": "{\"nome_cliente\":\"anonimo\",\"pedido\":\"xburger\",\"endereco\":\"rua Guaratiba 85\"}"
}
```

Precisamos fazer parse do JSON e renomear os campos.

### Passo 1: Adicionar Nó "Code" Antes do Supabase

1. Entre o nó **"PEDIDOS"** e o nó **"Supabase"**, adicione um nó **"Code"**
2. Procure por "Code" na barra de busca
3. Configure assim:

**Mode**: `Run Once for All Items`

**JavaScript Code**:
```javascript
// Parse do JSON string e transformação dos campos
const items = [];

for (const item of $input.all()) {
  // Parse do JSON que vem como string
  const outputData = JSON.parse(item.json.output);
  
  // Transforma os campos para o formato esperado pela tabela
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

### Passo 2: Configurar o Nó Supabase Corretamente

1. **Operation**: Selecione **"Insert Row(s)"** (NÃO "Update"!)
2. **Table Name or ID**: Digite manualmente `pedidos` (ignore o erro de busca)
3. **Select Type**: "Build Manually"
4. **Data to Send**: "Define Below for Each Column"
5. Clique em **"Add Field"** e adicione:

| Column | Value |
|--------|-------|
| `nome_cliente` | `{{ $json.nome_cliente }}` |
| `pedido_detalhado` | `{{ $json.pedido_detalhado }}` |
| `endereco_entrega` | `{{ $json.endereco_entrega }}` |
| `atendido` | `false` |

### Passo 3: Resolver Erro "Error fetching options from Supabase"

Se aparecer "Error fetching options from Supabase" no campo "Table Name or ID":

1. Clique em **"Select Type"** e escolha **"Build Manually"**
2. Digite manualmente: `pedidos` (sem aspas)
3. O erro de busca é apenas visual, não impede o funcionamento

## 📊 Estrutura Final do Workflow

```
[Trigger] → [AI Agent | PEDIDOS] → [Code] → [Supabase] → ✅
                              ↓
                    Transforma JSON e
                    renomeia campos
```

## 🎯 Alternativa: Usar Nó "Set" + Expressões JSON

Se preferir não usar o nó Code, você pode usar expressões diretamente no Supabase:

### No nó Supabase, use estas expressões:

**nome_cliente**:
```javascript
{{ JSON.parse($json.output).nome_cliente }}
```

**pedido_detalhado**:
```javascript
{{ JSON.parse($json.output).pedido }}
```

**endereco_entrega**:
```javascript
{{ JSON.parse($json.output).endereco }}
```

**atendido**:
```
false
```

## ✅ Teste Rápido

1. Configure conforme acima
2. Execute o workflow no n8n
3. Verifique o OUTPUT do nó Code (deve mostrar os campos transformados)
4. Verifique o OUTPUT do nó Supabase (deve mostrar o pedido inserido)
5. Abra o dashboard: `http://localhost:8000`
6. O pedido deve aparecer automaticamente!

## 🔍 Verificação da Estrutura de Dados

Execute o workflow e verifique o OUTPUT do nó "PEDIDOS":
- Se vier como string JSON dentro de `output` → use o nó Code
- Se vier como objeto JSON direto → pode usar expressões diretas no Supabase

