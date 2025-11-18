// Configuração do Supabase
const SUPABASE_URL = 'https://xktfkbflnjpsdhgxwywt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrdGZrYmZsbmpwc2RoZ3h3eXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MzI4NjQsImV4cCI6MjA3OTAwODg2NH0.0XXzCkaHlfgHNZB1pLLvpLb3ac923X4qJZjuwLJIiGs';
const TABELA_PEDIDOS = 'pedidos'; // Nome da tabela que o n8n irá alimentar

// Inicialização do cliente Supabase
let supabase;
let realtimeSubscription;

// Elementos do DOM
const pedidosTableBody = document.getElementById('pedidosTableBody');
const connectionStatus = document.getElementById('connectionStatus');
const statusText = document.getElementById('statusText');
const emptyState = document.getElementById('emptyState');

// Função para inicializar o Supabase
function inicializarSupabase() {
    try {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        atualizarStatusConexao(true);
        console.log('Supabase inicializado com sucesso');
        return true;
    } catch (error) {
        console.error('Erro ao inicializar Supabase:', error);
        atualizarStatusConexao(false);
        return false;
    }
}

// Função para atualizar o status de conexão visual
function atualizarStatusConexao(conectado) {
    if (conectado) {
        connectionStatus.classList.remove('disconnected');
        connectionStatus.classList.add('connected');
        statusText.textContent = 'Conectado';
    } else {
        connectionStatus.classList.remove('connected');
        connectionStatus.classList.add('disconnected');
        statusText.textContent = 'Desconectado';
    }
}

// Função para buscar todos os pedidos
async function fetchPedidos() {
    try {
        // Busca apenas pedidos não atendidos, ordenados por data de criação (mais recentes primeiro)
        const { data, error } = await supabase
            .from(TABELA_PEDIDOS)
            .select('*')
            .eq('atendido', false)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        // Limpa a tabela
        pedidosTableBody.innerHTML = '';

        // Verifica se há pedidos
        if (!data || data.length === 0) {
            mostrarEstadoVazio();
            return;
        }

        // Oculta estado vazio se houver pedidos
        emptyState.style.display = 'none';

        // Renderiza os pedidos
        data.forEach(pedido => {
            adicionarPedidoNaTabela(pedido, false);
        });

    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        pedidosTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="loading" style="color: #ff4444;">
                    Erro ao carregar pedidos. Verifique a conexão com o Supabase.
                </td>
            </tr>
        `;
    }
}

// Função para adicionar um pedido na tabela
function adicionarPedidoNaTabela(pedido, isNovo = true) {
    const tr = document.createElement('tr');
    
    if (isNovo) {
        tr.classList.add('new-order');
    }

    // Formatação da data de criação
    const dataFormatada = pedido.created_at 
        ? new Date(pedido.created_at).toLocaleString('pt-BR')
        : 'N/A';

    tr.innerHTML = `
        <td>
            <div class="status-cell">
                ${isNovo ? '<span class="new-badge">Novo</span>' : '<span></span>'}
            </div>
        </td>
        <td>
            <div class="client-name">${escaparHTML(pedido.nome_cliente || 'N/A')}</div>
            <small style="color: var(--text-secondary); font-size: 0.8rem;">${dataFormatada}</small>
        </td>
        <td>
            <div class="pedido-detalhado">${escaparHTML(pedido.pedido_detalhado || 'N/A')}</div>
        </td>
        <td>
            <div class="endereco">${escaparHTML(pedido.endereco_entrega || 'N/A')}</div>
        </td>
        <td>
            <button class="btn-atender" onclick="marcarComoAtendido(${pedido.id})">
                Marcar como Atendido
            </button>
        </td>
    `;

    // Adiciona atributos data-label para responsividade mobile
    const cells = tr.querySelectorAll('td');
    const labels = ['Status', 'Nome do Cliente', 'Pedido Detalhado', 'Endereço de Entrega', 'Ação'];
    cells.forEach((cell, index) => {
        cell.setAttribute('data-label', labels[index]);
    });

    // Se for um novo pedido, adiciona no topo
    if (isNovo) {
        pedidosTableBody.insertBefore(tr, pedidosTableBody.firstChild);
        
        // Remove a classe de animação após a animação terminar
        setTimeout(() => {
            tr.classList.remove('new-order');
        }, 500);
    } else {
        pedidosTableBody.appendChild(tr);
    }

    // Oculta estado vazio se houver pedidos
    emptyState.style.display = 'none';
}

// Função para escapar HTML e prevenir XSS
function escaparHTML(texto) {
    if (!texto) return '';
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// Função para marcar pedido como atendido
async function marcarComoAtendido(id) {
    try {
        const button = event.target;
        button.disabled = true;
        button.textContent = 'Atendendo...';

        const { error } = await supabase
            .from(TABELA_PEDIDOS)
            .update({ atendido: true })
            .eq('id', id);

        if (error) {
            throw error;
        }

        // Remove a linha da tabela com animação
        const tr = button.closest('tr');
        tr.classList.add('attended');
        
        setTimeout(() => {
            tr.remove();
            
            // Verifica se não há mais pedidos
            if (pedidosTableBody.children.length === 0) {
                mostrarEstadoVazio();
            }
        }, 300);

    } catch (error) {
        console.error('Erro ao marcar pedido como atendido:', error);
        alert('Erro ao marcar pedido como atendido. Tente novamente.');
        
        // Reabilita o botão em caso de erro
        const button = event.target;
        button.disabled = false;
        button.textContent = 'Marcar como Atendido';
    }
}

// Função para mostrar estado vazio
function mostrarEstadoVazio() {
    pedidosTableBody.innerHTML = '';
    emptyState.style.display = 'block';
}

// Função para configurar Realtime
function configurarRealtime() {
    try {
        // Remove subscription anterior se existir
        if (realtimeSubscription) {
            supabase.removeChannel(realtimeSubscription);
        }

        // Cria nova subscription para eventos INSERT
        realtimeSubscription = supabase
            .channel('pedidos_channel')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: TABELA_PEDIDOS,
                    filter: 'atendido=eq.false'
                },
                (payload) => {
                    console.log('Novo pedido recebido:', payload.new);
                    
                    // Adiciona o novo pedido no topo da tabela
                    adicionarPedidoNaTabela(payload.new, true);
                    
                    // Notificação visual (opcional - pode ser customizada)
                    mostrarNotificacao(`Novo pedido de ${payload.new.nome_cliente || 'Cliente'}`);
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('Inscrito no canal Realtime com sucesso');
                    atualizarStatusConexao(true);
                } else if (status === 'CHANNEL_ERROR') {
                    console.error('Erro na subscription do canal Realtime');
                    atualizarStatusConexao(false);
                }
            });

    } catch (error) {
        console.error('Erro ao configurar Realtime:', error);
        atualizarStatusConexao(false);
    }
}

// Função para mostrar notificação (opcional)
function mostrarNotificacao(mensagem) {
    // Cria uma notificação visual simples
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent-color);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = mensagem;
    
    // Adiciona animação CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove a notificação após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    }, 3000);
}

// Função de inicialização principal
async function inicializar() {
    // Verifica se as chaves foram configuradas
    if (SUPABASE_URL === 'SUA_URL_DO_SUPABASE' || SUPABASE_ANON_KEY === 'SUA_CHAVE_ANON_PUBLIC') {
        pedidosTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="loading" style="color: #ffaa00;">
                    ⚠️ Configure as chaves do Supabase no arquivo script.js antes de usar o dashboard.
                </td>
            </tr>
        `;
        atualizarStatusConexao(false);
        return;
    }

    // Inicializa Supabase
    if (!inicializarSupabase()) {
        return;
    }

    // Busca pedidos iniciais
    await fetchPedidos();

    // Configura Realtime
    configurarRealtime();

    // Adiciona listener para reconexão em caso de perda de conexão
    window.addEventListener('online', () => {
        console.log('Conexão restaurada');
        fetchPedidos();
        configurarRealtime();
    });

    window.addEventListener('offline', () => {
        console.log('Conexão perdida');
        atualizarStatusConexao(false);
    });
}

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
} else {
    inicializar();
}

// Cleanup ao fechar a página
window.addEventListener('beforeunload', () => {
    if (realtimeSubscription) {
        supabase.removeChannel(realtimeSubscription);
    }
});

