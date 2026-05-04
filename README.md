# Verificação de agendamentos (PWA)

Aplicação web progressiva (**PWA**) em **React** e **Vite** para consultar agendamentos do SUS em Teresina (PI) e cadastrar e-mail para notificações. O resultado da busca é exibido em um **Shadow DOM**, isolando o HTML retornado pelo servidor do restante da página.

## Funcionalidades

- **Verificar agendamentos**: informe o código numérico e busque os detalhes na API pública de agendamentos.
- **Limpar busca**: remove o resultado, o código selecionado e o texto do campo de busca.
- **Salvar código**: guarda códigos frequentes no `localStorage` do navegador.
- **Códigos salvos**: toque ou clique para buscar; **pressione e segure** (~600 ms) para remover um código salvo.
- **Cadastrar e-mail**: envia e-mail e lista de códigos para o backend de notificações (serviço próprio).

## Requisitos

- [Node.js](https://nodejs.org/) 18+ (recomendado a versão LTS atual)

## Como rodar localmente

```bash
npm install
npm run dev
```

Abra o endereço que o Vite exibir no terminal (em geral `http://localhost:5173`).

## Scripts

| Comando        | Descrição                          |
| -------------- | ----------------------------------- |
| `npm run dev`  | Servidor de desenvolvimento com HMR |
| `npm run build`| Build de produção em `dist/`       |
| `npm run preview` | Servir o build localmente       |
| `npm run lint` | ESLint no projeto                  |

## Build e PWA

O projeto usa [`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/) com `registerType: 'autoUpdate'`. Após `npm run build`, os assets em `dist/` podem ser publicados em qualquer hospedagem estática; o `base` está configurado como `./` para funcionar bem em subpastas.

## Stack principal

- React 19, Vite 6
- Tailwind CSS 4 (`@tailwindcss/vite`)
- Axios para requisições HTTP

## Integrações (URLs no código)

- Detalhe do agendamento: `https://agendamentos.sus.fms.pmt.pi.gov.br` (GET com `number_id`).
- Cadastro de notificações: `https://fms-pi-agendamento.live/users/register` (POST com `email` e `codes`).

Alterações de ambiente exigem ajuste em `src/App.tsx` (ou no ficheiro de componente principal que o projeto utilizar).

## Licença e autoria

Projeto desenvolvido por [Kelson Victor](https://github.com/k3lsonvictor). Inclua uma licença no repositório se quiser definir termos de uso explícitos.
