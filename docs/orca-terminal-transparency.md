# Orca ADE terminal transparency

The likely intended app is **Orca ADE** (the agent development environment from
Stably AI). Its current desktop source has a terminal background opacity control.

## Steps

1. Open **Settings** in Orca.
2. Open **Appearance**, expand **Terminal**, then open the **Window** section.
3. Set **Background Opacity** to a value below `1` (for example, `0.70`). The
   control accepts `0` to `1`: `1` is fully opaque and `0` is fully transparent.
4. If a blurred glass effect is wanted, enable **Window Blur** in the same
   section and restart Orca. Blur is a separate setting and the source explicitly
   says it requires a restart.

The opacity setting changes the embedded xterm terminal's theme background to an
RGBA color and enables xterm transparency when the value is below `1`. It is the
setting to use for making the terminal itself see-through; changing the theme
alone does not set alpha.

## Platform notes

Orca's terminal documentation covers macOS, Windows, and Linux, but the native
window blur implementation is platform-specific. The current source requests
Electron's acrylic background material only on Windows; macOS and Linux keep the
normal opaque base window. Therefore, on macOS/Linux the terminal background
opacity can still make the terminal surface transparent within Orca's window,
but desktop wallpaper or another app will not necessarily show through the whole
window as a native glass surface.

Sources (official):

- [Orca terminal documentation](https://www.onorca.dev/docs/terminal) — terminal settings and theme location.
- [TerminalWindowSection.tsx](https://github.com/stablyai/orca/blob/main/src/renderer/src/components/settings/TerminalWindowSection.tsx) — UI labels, range, meaning, and restart behavior.
- [terminal-appearance.ts](https://github.com/stablyai/orca/blob/main/src/renderer/src/components/terminal-pane/terminal-appearance.ts) — RGBA conversion and xterm `allowTransparency` behavior.
- [createMainWindow.ts](https://github.com/stablyai/orca/blob/main/src/main/window/createMainWindow.ts) — platform-specific blur and opaque base window configuration.
- [AppearancePane.tsx](https://github.com/stablyai/orca/blob/main/src/renderer/src/components/settings/AppearancePane.tsx) and [TerminalAppearanceSection.tsx](https://github.com/stablyai/orca/blob/main/src/renderer/src/components/settings/TerminalAppearanceSection.tsx) — Settings → Appearance → Terminal → Window nesting.
