// Configuração inicial e constantes globais

// URL's da nossa API (Backend)

const ENDPOINT_CHARADAS = 'https://ap-icharada.vercel.app/charadas';
const ENDPOINT_LISTA_TODAS = "https://ap-icharada.vercel.app/charadas/lista"

// Ligando com os elementos HTML

// Ligando os formulários

// Formulário de criação
let formularioCriacao = document.getElementById('create-form');
let inputPerguntaCriacao = document.getElementById('create-name');
let inputRespostaCriacao = document.getElementById('create-description');

// Formulário de Atualização (edição)
let formularioAtualizacao = document.getElementById('update-form');
let inputAtualizacaoId = document.getElementById('update-id');
let inputPerguntaAtualizacao = document.getElementById('update-name');
let inputRespostaAtualizacao = document.getElementById('update-description');
let botaoCancelarAtualizacao = document.getElementById('cancel-update')

// Lista (elementos <div>) onde as charadas serão exibidas
let listaCharadasElemento = document.getElementById('item-list');

//input pesquisa
let pesquisainput = document.getElementById('pesquisainput')

//container paginação
let paginacao = document.getElementById('paginacao')

// --- Estado Global para Ordenação, Pesquisa e Paginação ---
let todascharadas = []; // Armazena todas as charadas buscadas
let currentPage = 1;
const charadasporpag = 4; // Quantidade de charadas por página
let termopesquisa = ''; // Termo de busca atual (por ID)

// ===========================================================
// FUNÇÕES PARA INTERAGIR COM API 
// ===========================================================

// READ (Listar as charadas no elemento lista)

async function buscarListarCharadas() {
    console.log("Buscando charadas na API....");
    listaCharadasElemento.innerHTML = '<p class="p-4 text-center">Carregando charadas...</p>';

    try {
        const respostaHttp = await fetch(ENDPOINT_LISTA_TODAS);

        if(!respostaHttp.ok){
            throw new Error(`Erro na API: ${respostaHttp.status} ${respostaHttp.statusText}`);
        }

        const charadas = await respostaHttp.json();
        console.log("Charadas recebidas: ",charadas)

        // primeiro ordena por id (crescente)
        todascharadas = charadas.sort((a,b)=> Number(a.id)- Number(b.id))

        //reseta para a primeira página e limpa busca ao carregar tudo
        currentPage = 1
        termopesquisa = ""
        pesquisainput.value = ""
        renderPage()

        // exibirCharadasNaTela(charadas);

    } catch (erro) {
        console.error(`Falha ao buscar charadas: ${erro}`);
        listaCharadasElemento.innerHTML = `
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative" role="alert">
            <strong class="font-bold">Erro!</strong>
            <span class="block sm:inline">Falha ao carregar charadas: ${erro.message}</span>
        </div>`
    }
}

// --- CREATE (Criar uma nova charada) ---
async function criarCharada(evento) {
    evento.preventDefault(); // Previne o comportamento padrão do formulário (que é recarregar a página)
    console.log("Tentando criar nova charada...");

    const pergunta = inputPerguntaCriacao.value; //usa a louça
    const respostaCharada = inputRespostaCriacao.value;

    if (!pergunta || !respostaCharada) {
        showToast("Por favor, preencha a pergunta e a resposta.", 'error')
        return
    } //verificando se os campos estão cheios

    const novaCharada = {
        pergunta: pergunta,
        resposta: respostaCharada
    }; //cria um array chave valor para pegar a charada e a resposta

    try {
        // Mostra um feedback visual que está enviando
        const submitButton = formularioCriacao.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = `<i data-lucide="loader-2" class="animate-spin mr-2"></i> Adicionando...`;
        lucide.createIcons();

        const respostaHttp = await fetch(ENDPOINT_CHARADAS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novaCharada)
        }); //espera os valores do formulário e cria o json com o array chave valor

        const resultadoApi = await respostaHttp.json(); //envia para a api

        if (!respostaHttp.ok) {
            throw new Error(resultadoApi.mensagem || `Erro ao criar charada: ${respostaHttp.status}`);
        }//verifica o status code da API para ver se funcionou 

        console.log("Charada criada com sucesso!", resultadoApi)
        showToast(resultadoApi.mensagem || "Charada adcionada com sucesso!", 'success')

        inputPerguntaCriacao.value = ''; //lava a louça
        inputRespostaCriacao.value = '';

        await buscarListarCharadas(); //atualiza o front-end com a charada nova

    } catch (erro) {
        console.error("Falha ao criar charada:", erro)
        showToast(`Erro ao criar charada: ${erro.message}`, 'error')
    }finally {
        // Restaura o botão de submit
        const submitButton = formularioCriacao.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.innerHTML = `<i data-lucide="plus"></i>Adicionar`;
        lucide.createIcons();
    }
}

// --- UPDATE (Atualizar uma charada existente) ---
async function atualizarCharada(evento) {
    evento.preventDefault();
    console.log("Tentando atualizar charada...");

    const id = inputAtualizacaoId.value;
    const pergunta = inputPerguntaAtualizacao.value;
    const respostaCharada = inputRespostaAtualizacao.value;

    
    if (!id) {
        console.error("ID da charada para atualização não encontrado!")
        showToast("Erro interno: ID da charada não encontrado.", 'error')
        return;
    }
    
    if (!pergunta || !respostaCharada) {
        showToast("Por favor, preencha a pergunta e a resposta.", 'error')
        return
    }
    
    const dadosCharadaAtualizada = {
        pergunta: pergunta,
        resposta: respostaCharada
    }
    // Mostra um feedback visual que está enviando
    const submitButton = formularioAtualizacao.querySelector('button[type="submit"]');
    const cancelButton = formularioAtualizacao.querySelector('#cancel-update');
    submitButton.disabled = true;
    cancelButton.disabled = true;
    submitButton.innerHTML = `<i data-lucide="loader-2" class="animate-spin mr-2"></i> Salvando...`;
    lucide.createIcons();

    try {
        const respostaHttp = await fetch(`${ENDPOINT_CHARADAS}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosCharadaAtualizada)
        });

        const resultadoApi = await respostaHttp.json();

        if (!respostaHttp.ok) {
            throw new Error(resultadoApi.mensagem || `Erro ao atualizar charada: ${respostaHttp.status}`);
        }

        console.log("Charada atualizada com sucesso! ID:", id);
        showToast(resultadoApi.mensagem || "Charada atualizada com sucesso!", 'success');

        esconderFormularioAtualizacao();
        await buscarListarCharadas();

    } catch (erro) {
        console.error("Falha ao atualizar charada:", erro);
        showToast(`Erro ao atualizar charada: ${erro.message}`, 'error');
    }finally {
        // Restaura os botões
        submitButton.disabled = false;
        cancelButton.disabled = false;
        submitButton.innerHTML = `<i data-lucide="save"></i>Salvar alterações`;
        lucide.createIcons();
    }
}

// --- DELETE (Excluir uma charada) ---
async function excluirCharada(id) {
    console.log(`Tentando excluir charada com ID: ${id}`);

    // Pega o botão para desativar durante a exclusão
    const charadaDiv = document.getElementById(`charada-${id}`)
    const deleteButton = charadaDiv ? charadaDiv.querySelector('.delete-btn') : null
    const editButton = charadaDiv ? charadaDiv.querySelector('.edit-btn') : null

    if (!confirm(`Tem certeza que deseja excluir a charada com ID ${id}? Esta ação não pode ser desfeita.`)) {
        console.log("Exclusão cancelada pelo usuário.");
        showToast("Exclusão cancelada.", 'info', 2000);
        return;
    }
    if (deleteButton) deleteButton.disabled = true;
    if (editButton) editButton.disabled = true;
    if (deleteButton) deleteButton.innerHTML = `<i data-lucide="loader-2" class="animate-spin"></i>`;
    lucide.createIcons();

    try {
        const respostaHttp = await fetch(`${ENDPOINT_CHARADAS}/${id}`, {
            method: 'DELETE'
        });

        const resultadoApi = await respostaHttp.json();

        if (!respostaHttp.ok) {
            throw new Error(resultadoApi.mensagem || `Erro ao excluir charada: ${respostaHttp.status}`);
        }

        console.log("Charada excluída com sucesso!", id);
        showToast(resultadoApi.mensagem || "Charada excluída com sucesso!", 'success');

        await buscarListarCharadas();

    } catch (erro) {
        console.error("Falha ao excluir charada:", erro);
        alert(`Erro ao excluir charada: ${erro.message}`)
        if (deleteButton) deleteButton.disabled = false;
        if (editButton) editButton.disabled = false;
        if (deleteButton) deleteButton.innerHTML = `<i data-lucide="trash-2" class="w-4 h-4 mr-1"></i>Excluir`;
        lucide.createIcons();
    }
}

// ============================================================
// FUNÇÕES PARA MANIPULAR O HTML (Atualizar a Página)
// ============================================================

// --- Mostrar as charadas na lista ---
// --- Função Central para Renderizar a Página (com filtro e paginação) ---
function renderPage() {
    console.log(`Renderizando página: ${currentPage}, Termo de busca: "${termopesquisa}"`);

    // 1. Filtrar as charadas (já ordenadas em todascharadas) pelo ID
    const filteredCharadas = termopesquisa
        ? todascharadas.filter(charada => String(charada.id).includes(termopesquisa))
        : [...todascharadas]; // Se não há busca, usa todas

    // 2. Calcular itens para a página atual
    const totalItems = filteredCharadas.length;
    const totalPages = Math.ceil(totalItems / charadasporpag);
    // Ajustar currentPage se for inválida (ex: após filtro ficar menor)
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    }
    if (currentPage < 1) {
        currentPage = 1;
    }

    const startIndex = (currentPage - 1) * charadasporpag;
    const endIndex = startIndex + charadasporpag;
    const itemsToDisplay = filteredCharadas.slice(startIndex, endIndex);

    // 3. Exibir os itens da página
    exibirCharadasNaTela(itemsToDisplay, filteredCharadas.length === 0 && termopesquisa !== ''); // Passa se a busca não retornou resultados

    // 4. Renderizar os controles de paginação
    renderPagination(totalPages, totalItems);

    // 5. Atualizar ícones Lucide (se houver novos na lista ou paginação)
    lucide.createIcons();
}

function exibirCharadasNaTela(charadasParaExibir, buscaSemResultados = false) {
    console.log("Atualizando a lista de charadas na tela...");
    listaCharadasElemento.innerHTML = '';

    if (charadasParaExibir.length === 0) {
        if (buscaSemResultados) {
            listaCharadasElemento.innerHTML = `<p class="p-4 text-center text-gray-500">Nenhuma charada encontrada para o ID "${searchTerm}".</p>`;
        } else if (todascharadas.length === 0) {
             listaCharadasElemento.innerHTML = '<p class="p-4 text-center text-gray-500">Nenhuma charada cadastrada ainda.</p>';
        } else {
            // Isso pode acontecer se a página estiver fora do alcance, mas renderPage deve corrigir
            listaCharadasElemento.innerHTML = '<p class="p-4 text-center text-gray-500">Nenhuma charada para exibir nesta página.</p>';
        }
        return;
    }

    // Cria os elementos para cada charada da página
    for (const charada of charadasParaExibir) {
        const elementoCharadaDiv = document.createElement('div');
        elementoCharadaDiv.classList.add('bg-blue-50', 'border', 'border-blue-100', 'p-4', 'mb-3', 'rounded-xl', 'shadow-sm', 'flex', 'flex-col', 'sm:flex-row', 'sm:items-center', 'gap-3'); // Ajustes de padding/margin/layout
        elementoCharadaDiv.id = `charada-${charada.id}`;

        elementoCharadaDiv.innerHTML = `
            <div class="flex-grow">
                <strong class="text-base font-medium text-blue-900">${charada.pergunta || 'Pergunta não definida'}</strong>
                <p class="text-sm text-blue-800"><span class="font-medium">Resposta:</span> ${charada.resposta || 'Não definida'}</p>
                <p class="text-xs text-gray-500 mt-1"><span class="font-medium">ID:</span> ${charada.id}</p>
            </div>
            <div class="flex gap-2 flex-shrink-0">
                <button class="edit-btn bg-yellow-400 text-black font-medium px-3 py-1.5 rounded-lg hover:bg-yellow-500 text-sm flex items-center gap-1">
                    <i data-lucide="edit-3" class="w-4 h-4"></i>Editar
                </button>
                <button class="delete-btn bg-red-500 text-white font-medium px-3 py-1.5 rounded-lg hover:bg-red-600 text-sm flex items-center gap-1">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>Excluir
                </button>
            </div>
        `;

        // Adiciona listeners aos botões de Editar e Excluir
        const botaoEditar = elementoCharadaDiv.querySelector('.edit-btn');
        botaoEditar.addEventListener('click', () => { // Usa arrow function para manter 'charada' no escopo
            console.log(`Botão Editar clicado para a charada ID: ${charada.id}`);
            exibirFormularioAtualizacao(charada.id, charada.pergunta, charada.resposta);
        });

        const botaoExcluir = elementoCharadaDiv.querySelector('.delete-btn');
        botaoExcluir.addEventListener('click', () => {
            console.log(`Botão Excluir clicado para a charada ID: ${charada.id}`);
            excluirCharada(charada.id);
        });

        listaCharadasElemento.appendChild(elementoCharadaDiv);
    }
}
// --- Renderizar os controles de paginação ---
function renderPagination(totalPages, totalItems) {
    paginacao.innerHTML = ''; // Limpa controles antigos

    if (totalItems === 0 || totalPages <= 1) {
         paginacao.innerHTML = ''; // Não mostra paginação se não precisar
         // Opcional: Mostrar mensagem se a busca zerou os resultados
         if (totalItems === 0 && termopesquisa) {
            // A mensagem já está na lista de charadas
         }
        return;
    }

    // Botão Anterior
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Anterior';
    prevButton.classList.add('px-3', 'py-2', 'rounded-l-xl', 'bg-blue-100', 'text-blue-700', 'hover:bg-blue-200', 'disabled:opacity-50', 'disabled:cursor-not-allowed');
    if (currentPage === 1) {
        prevButton.disabled = true;
    }
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage();
        }
    });
    paginacao.appendChild(prevButton);

    // Botões de Número de Página (simplificado para não ter muitos botões)
    // Mostra primeira, última, e algumas em torno da atual
    const maxPageButtons = 5; // Máximo de botões de número a mostrar
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    // Ajusta startPage se endPage for o limite e ainda houver espaço
     if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxPageButtons + 1);
    }


    if (startPage > 1) {
        // Botão para a primeira página
        const firstPageButton = createPageButton(1);
         paginacao.appendChild(firstPageButton);
        if (startPage > 2) {
             // Indicador de páginas puladas "..."
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.classList.add('px-3', 'py-2', 'bg-blue-100', 'text-blue-700');
            paginacao.appendChild(ellipsis);
        }
    }


    for (let i = startPage; i <= endPage; i++) {
        const pageButton = createPageButton(i);
        paginacao.appendChild(pageButton);
    }

     if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            // Indicador de páginas puladas "..."
             const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.classList.add('px-3', 'py-2', 'bg-blue-100', 'text-blue-700');
            paginacao.appendChild(ellipsis);
        }
         // Botão para a última página
        const lastPageButton = createPageButton(totalPages);
        paginacao.appendChild(lastPageButton);
    }


    // Botão Próximo
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Próximo';
    nextButton.classList.add('px-3', 'py-2', 'rounded-r-xl', 'bg-blue-100', 'text-blue-700', 'hover:bg-blue-200', 'disabled:opacity-50', 'disabled:cursor-not-allowed');
    if (currentPage === totalPages) {
        nextButton.disabled = true;
    }
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPage();
        }
    });
    paginacao.appendChild(nextButton);
}

// Helper para criar botões de número de página
function createPageButton(pageNumber) {
    const pageButton = document.createElement('button');
    pageButton.textContent = pageNumber;
    pageButton.classList.add('px-3', 'py-2', 'bg-blue-100', 'text-blue-700', 'hover:bg-blue-200');
    if (pageNumber === currentPage) {
        pageButton.classList.remove('bg-blue-100', 'hover:bg-blue-200');
        pageButton.classList.add('bg-blue-500', 'text-white', 'font-bold', 'cursor-default'); // Estilo da página ativa
        pageButton.disabled = true; // Não clicável
    } else {
         pageButton.addEventListener('click', () => {
            currentPage = pageNumber;
            renderPage();
        });
    }
    return pageButton;
}
// --- Mostrar o formulário de atualização (edição) ---
function exibirFormularioAtualizacao(id, pergunta, resposta) {
    console.log("Mostrando formulário de atualização para a charada ID:", id);
    inputAtualizacaoId.value = id;
    inputPerguntaAtualizacao.value = pergunta || "";
    inputRespostaAtualizacao.value = resposta || "";

    formularioAtualizacao.classList.remove('hidden');
    formularioCriacao.classList.add('hidden');

    formularioAtualizacao.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// --- Esconder o formulário de atualização ---
function esconderFormularioAtualizacao() {
    console.log("Escondendo formulário de atualização.");
    formularioAtualizacao.classList.add('hidden');
    formularioCriacao.classList.remove('hidden');

    inputAtualizacaoId.value = '';
    inputPerguntaAtualizacao.value = '';
    inputRespostaAtualizacao.value = '';
}

// ============================================================
// FUNÇÕES DE FEEDBACK (TOASTS)
// ============================================================

function showToast(message, type = 'success', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) {
        console.error('Toast container not found!');
        return;
    }

    const toastId = `toast-${Date.now()}`; // ID único para o toast
    const toastElement = document.createElement('div');
    toastElement.id = toastId;
    toastElement.classList.add(
        'p-4', 'rounded-lg', 'shadow-lg', 'flex', 'items-start', 'gap-3',
        'text-sm', 'font-medium', 'border',
        'opacity-0', 'translate-x-full', 'transform', 'transition-all', 'duration-300', 'ease-out' // Animação de entrada
    );

    let iconHtml = '';
    // Define cor e ícone com base no tipo
    if (type === 'success') {
        toastElement.classList.add('bg-green-50', 'border-green-300', 'text-green-800');
        iconHtml = '<i data-lucide="check-circle" class="w-5 h-5 text-green-500 flex-shrink-0"></i>';
    } else if (type === 'error') {
        toastElement.classList.add('bg-red-50', 'border-red-300', 'text-red-700');
        iconHtml = '<i data-lucide="x-circle" class="w-5 h-5 text-red-500 flex-shrink-0"></i>';
    } else { // Tipo 'info' ou default
        toastElement.classList.add('bg-blue-50', 'border-blue-300', 'text-blue-700');
        iconHtml = '<i data-lucide="info" class="w-5 h-5 text-blue-500 flex-shrink-0"></i>';
    }

    toastElement.innerHTML = `
        ${iconHtml}
        <div class="flex-1">${message}</div>
        <button class="ml-auto -mx-1.5 -my-1.5 p-1.5 inline-flex h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg focus:ring-2 focus:ring-gray-300" aria-label="Close">
            <i data-lucide="x" class="w-5 h-5"></i>
        </button>
    `;

    // Adiciona evento para o botão fechar
    const closeButton = toastElement.querySelector('button');
    closeButton.addEventListener('click', () => removeToast(toastElement));

    // Adiciona o toast ao container
    container.appendChild(toastElement);

    // Renderiza o ícone Lucide DENTRO do toast
    lucide.createIcons({
         nodes: [toastElement.querySelector('i[data-lucide]'), closeButton.querySelector('i[data-lucide]')]
    });

    // Força reflow para aplicar estilos iniciais antes da transição
    void toastElement.offsetWidth;

    // Inicia animação de entrada
    toastElement.classList.remove('opacity-0', 'translate-x-full');
    toastElement.classList.add('opacity-100', 'translate-x-0');


    // Define timeout para remover o toast automaticamente
    setTimeout(() => {
        removeToast(toastElement);
    }, duration);
}

function removeToast(toastElement) {
    if (!toastElement || !toastElement.parentNode) return; // Já removido ou não existe

    // Inicia animação de saída
    toastElement.classList.remove('opacity-100', 'translate-x-0');
    toastElement.classList.add('opacity-0', 'translate-x-full'); // Ou outra animação de saída

    // Remove o elemento do DOM após a animação
    setTimeout(() => {
        if (toastElement.parentNode) {
            toastElement.parentNode.removeChild(toastElement);
        }
    }, 300); // Duração da animação de saída (igual à da entrada)
}

//=====================================================================
//EVENT LISTENERS GLOBAIS(Campanhias principais da página)

formularioCriacao.addEventListener('submit',criarCharada);//ao acontecer o submit do botão do formulário, chama a função criar charada
formularioAtualizacao.addEventListener('submit', atualizarCharada);
botaoCancelarAtualizacao.addEventListener('click', (e) => 
    {e.preventDefault()
    esconderFormularioAtualizacao()}
);

pesquisainput.addEventListener('input', () => {
    termopesquisa = pesquisainput.value.trim(); // Atualiza o termo de busca
    currentPage = 1; // Volta para a primeira página ao pesquisar
    renderPage(); // Re-renderiza a lista com o filtro
});
//=====================================================================
// INICIALIZAÇÃO DA PÁGINA

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM completamente carregado. Iniciando busca de charadas...");
    buscarListarCharadas();
}); 