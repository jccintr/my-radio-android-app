# MyRadio

App Android (Expo 54 + React Native) para tocar rádios web em streaming, com player em segundo plano.

## O que está implementado

- **Lista de rádios**: busca `GET https://radios-api-production.up.railway.app/radios/all` e lista todas (logo + nome), ordenadas alfabeticamente. Pull-to-refresh incluso.
- **Player**: tela dedicada com capa, play/stop e slider de volume. Também há uma mini-barra de player fixa na lista (como Spotify) para trocar/parar sem abrir a tela cheia.
- **Reprodução em segundo plano**: usa `react-native-track-player`, que roda como *foreground service* no Android — a rádio continua tocando com o app minimizado ou a tela bloqueada, com controles (play/stop) na notificação e na lock screen.
- **Tema único**: dark, inspirado no Spotify (`src/theme/theme.ts`).
- **HLS**: rádios marcadas com `hsl: true` na API são carregadas como stream HLS (ExoPlayer cuida disso nativamente no Android).
- **HTTP sem TLS**: uma das rádios da lista usa `http://` puro; por isso `usesCleartextTraffic: true` está habilitado no `app.json`.

## Estrutura

```
App.tsx                        # navegação + providers
index.js                       # entry point, registra o serviço de background
src/api/radios.ts              # fetch + tipos da API
src/context/PlayerContext.tsx  # inicializa o TrackPlayer, expõe play/stop/volume
src/services/PlaybackService.ts# handlers de eventos remotos (notificação/bluetooth/fone)
src/screens/RadioListScreen.tsx
src/screens/PlayerScreen.tsx
src/components/RadioListItem.tsx
src/components/MiniPlayer.tsx
src/theme/theme.ts
```

## Como integrar ao projeto que você já criou

Como você já tem o app Expo com os ícones personalizados (`icon`, `adaptive-icon`, `splash`, etc.), a forma mais simples é:

1. Copie as pastas `src/` e os arquivos `App.tsx`, `index.js` deste projeto para o seu.
2. No seu `app.json`, adicione (mantendo seus ícones/splash já configurados):
   ```json
   {
     "expo": {
       "android": {
         "usesCleartextTraffic": true,
         "permissions": [
           "FOREGROUND_SERVICE",
           "FOREGROUND_SERVICE_MEDIA_PLAYBACK",
           "WAKE_LOCK",
           "POST_NOTIFICATIONS",
           "ACCESS_NETWORK_STATE",
           "INTERNET"
         ]
       }
     }
   }
   ```
3. Instale as dependências de `package.json` que ainda não tem:
   ```bash
   npx expo install react-native-track-player @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context react-native-gesture-handler @react-native-community/slider expo-status-bar @expo/vector-icons
   ```
4. O arquivo `assets/notification-icon.png` (ícone monocromático branco usado na notificação de reprodução) é referenciado via `require` em `PlayerContext.tsx` — copie-o também para `assets/`, ou aponte o `require` para um ícone seu equivalente.
5. Como o app usa um módulo nativo (`react-native-track-player`), ele **não roda no Expo Go** — é necessário Dev Client ou build (`npx expo prebuild` + `npx expo run:android`, ou EAS Build).

## Rodando localmente

```bash
npm install
npx expo prebuild --platform android
npx expo run:android
```

## Notas

- O player intencionalmente só oferece **play/stop** (sem pause/seek), já que é rádio ao vivo — parar e tocar de novo sempre retoma o streaming ao vivo.
- `AppKilledPlaybackBehavior.ContinuePlayback` mantém o serviço/áudio vivo mesmo se o app for removido dos recentes; ajuste em `PlayerContext.tsx` se preferir que pare nesse caso.
- Testado com `tsc --noEmit` e `expo prebuild` (gera o projeto Android nativo sem erros) neste ambiente.
