-- ============================================
-- Script SQL para criar a tabela de Pedidos
-- Dashboard de Pedidos em Tempo Real
-- ============================================

-- 1. Criação da tabela 'pedidos'
CREATE TABLE IF NOT EXISTS public.pedidos (
    id BIGSERIAL PRIMARY KEY,
    nome_cliente TEXT NOT NULL,
    pedido_detalhado TEXT NOT NULL,
    endereco_entrega TEXT NOT NULL,
    atendido BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_pedidos_atendido ON public.pedidos(atendido);
CREATE INDEX IF NOT EXISTS idx_pedidos_created_at ON public.pedidos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pedidos_atendido_created_at ON public.pedidos(atendido, created_at DESC);

-- 3. Função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. Trigger para atualizar updated_at automaticamente
DROP TRIGGER IF EXISTS update_pedidos_updated_at ON public.pedidos;
CREATE TRIGGER update_pedidos_updated_at
    BEFORE UPDATE ON public.pedidos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. Habilitar Row Level Security (RLS)
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;

-- 6. Políticas de segurança (permitir leitura e escrita pública para o dashboard)
-- Política para SELECT: todos podem ler pedidos não atendidos
CREATE POLICY "Permitir leitura de pedidos não atendidos"
    ON public.pedidos
    FOR SELECT
    USING (true);

-- Política para INSERT: todos podem inserir pedidos (para o n8n)
CREATE POLICY "Permitir inserção de pedidos"
    ON public.pedidos
    FOR INSERT
    WITH CHECK (true);

-- Política para UPDATE: todos podem atualizar o status de atendido
CREATE POLICY "Permitir atualização de pedidos"
    ON public.pedidos
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- 7. Habilitar Realtime para a tabela pedidos
ALTER PUBLICATION supabase_realtime ADD TABLE public.pedidos;

-- ============================================
-- FIM DO SCRIPT
-- ============================================

-- INSTRUÇÕES:
-- 1. Acesse o Supabase Dashboard
-- 2. Vá em SQL Editor
-- 3. Cole este script completo
-- 4. Execute o script
-- 
-- OBSERVAÇÃO: Se a publicação supabase_realtime não existir,
-- você precisará habilitar o Realtime manualmente:
-- - Vá em Database → Replication
-- - Ative a publicação para a tabela 'pedidos'

