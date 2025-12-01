# Agendei Mobile App

Aplicação nativa desenvolvida com Expo, compartilhando regras de negócio com a versão Web.

## Tech Stack

- **Core:** React Native, Expo
- **Routing:** Expo Router (File-based routing)
- **Styling:** NativeWind
- **State:** Zustand
- **Networking:** Axios

## Destaques de Implementação

### Paridade de Tipagem
Compartilhamento estrito de interfaces TypeScript com o Frontend Web, garantindo consistência de contratos de dados entre as plataformas.

### Navegação
Utilização do **Expo Router** para navegação baseada em arquivos, simplificando a estrutura de rotas e deep linking.

### Deep Linking
Integração nativa com **WhatsApp** para comunicação direta entre prestadores e clientes.

## Setup de Ambiente

1. **Configuração de API:**
   Certifique-se de configurar o IP da sua máquina local nas variáveis de ambiente ou constantes da API para permitir conexão via emulador/dispositivo físico (ex: `192.168.x.x`).

2. **Execução:**

```bash
# Instalar dependências
npm install

# Iniciar o Metro Bundler
npx expo start
```

## Gestão

Acompanhe o progresso do projeto no Trello:
[Board Agendei](https://trello.com/invite/b/6923691dc80ae47b7f0729f8/ATTI39f8a221bb69fd07e5cafddd97ac5004A6DA3F14/agendai)
