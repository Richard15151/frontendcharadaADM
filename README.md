### Curso Técnico de Desenvolvimento de Sistemas - Senai Itapeva

![Imagem de capa](/gifs/capaadmcharadas.gif)  <!-- Substitua pelo caminho correto do seu GIF/imagem de capa do admin -->

**Descrição:**

Este projeto fornece a interface web de administração para o sistema Charadas. Construída com HTML, Tailwind CSS e JavaScript, esta interface permite gerenciar o conteúdo do jogo (adicionar, visualizar, editar e excluir charadas) interagindo com uma API RESTful externa (separada). Ela oferece funcionalidades essenciais de CRUD, pesquisa e paginação para uma administração eficiente.

## Índice

* [Funcionalidades](#funcionalidades)
* [Tecnologias Utilizadas](#tecnologias-utilizadas)
* [Como Executar](#como-executar)
* [API](#api)
* [Autor](#autor)
* [Licença](#licença)

## Funcionalidades

*   **Listagem de Charadas:** Exibe todas as charadas cadastradas no banco de dados, ordenadas por ID.
*   **Paginação:** Navega pela lista de charadas em páginas, exibindo um número limitado de itens por vez (4 por página).
*   **Pesquisa por ID:** Filtra a lista de charadas exibindo apenas aquelas cujo ID contém o termo pesquisado.

![gif de funcionalidades](/gifs/vercharadas.gif)

*   **Adicionar Nova Charada:** Formulário para inserir uma nova pergunta e resposta, que são enviadas para a API para criação.

![gif de funcionalidades](/gifs/criarcharadas.gif)

*   **Editar Charada Existente:** Permite modificar a pergunta e/ou resposta de uma charada selecionada.

![gif de funcionalidades](/gifs/editarcharadas.gif)

*   **Excluir Charada:** Remove uma charada do banco de dados através da API, com confirmação prévia.

![gif de funcionalidades](/gifs/deletarcharadas.gif)

*   **Feedback Visual (Toasts):** Exibe notificações (pop-ups) para indicar o sucesso ou falha das operações (Criar, Atualizar, Excluir) e para mensagens de validação ou erro.

## Tecnologias Utilizadas

![image](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![image](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![image](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![image](https://img.shields.io/badge/Lucide_Icons-3298DC?style=for-the-badge&logo=lucide&logoColor=white)

## Como Executar

1.  **Certifique-se de que a API esteja funcionando:** A API RESTFUL (não incluída neste repositório) deve estar em execução e acessível na sua rede local ou onde for hospedada.
    *   Acesse o repositório da API: https://github.com/Richard15151/APIcharada
    *   Siga as instruções do repositório da API para configurá-la e iniciá-la (executar `app.py`).
    *   **Importante:** Atualize as variáveis `ENDPOINT_CHARADAS` e `ENDPOINT_LISTA_TODAS` no arquivo `script2.js` (deste front-end de admin) com o endereço IP e porta corretos da sua API em execução. Exemplo:
        ```javascript
        const ENDPOINT_CHARADAS = 'http://SEU_IP_AQUI:SUA_PORTA_AQUI/charadas';
        const ENDPOINT_LISTA_TODAS = "http://SEU_IP_AQUI:SUA_PORTA_AQUI/charadas/lista";
        ```
2.  **Abra os arquivos:** Abra o arquivo `index.html` (o arquivo HTML deste front-end de admin) em um navegador web.

## API

Esta interface de administração depende de uma API RESTFUL externa (não incluída neste repositório) para gerenciar as charadas. A API deve fornecer os seguintes endpoints:

*   **`GET /charadas/lista`**: Retorna uma lista (array) de todas as charadas cadastradas em formato JSON. Cada objeto na lista deve conter pelo menos `id`, `pergunta` e `resposta`.
    *   Exemplo de resposta: `[{"id": 1, "pergunta": "...", "resposta": "..."}, {"id": 2, ...}]`
*   **`POST /charadas`**: Recebe um corpo JSON com `pergunta` e `resposta` para criar uma nova charada. Retorna uma mensagem de sucesso ou erro.
    *   Exemplo de corpo da requisição: `{"pergunta": "Nova pergunta?", "resposta": "Nova resposta"}`
*   **`PUT /charadas/<id>`**: Recebe um corpo JSON com `pergunta` e `resposta` para atualizar a charada com o `id` especificado na URL. Retorna uma mensagem de sucesso ou erro.
    *   Exemplo de corpo da requisição: `{"pergunta": "Pergunta editada?", "resposta": "Resposta editada"}`
*   **`DELETE /charadas/<id>`**: Exclui a charada com o `id` especificado na URL. Retorna uma mensagem de sucesso ou erro.
*   A API deve ser configurada adequadamente para lidar com solicitações CORS (Cross-Origin Resource Sharing), permitindo requisições vindas da origem onde o front-end de admin está sendo executado.

## Autor

-   Richard - https://github.com/Richard15151 - richard.oliveira.senai@gmail.com

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE (se existir no seu repositório) para mais detalhes.