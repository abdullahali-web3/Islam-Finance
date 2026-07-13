# Maestro E2E flows

End-to-end flows for the IslamFinance app, per **ADR 0011 (testing strategy)**. Maestro is the E2E
layer that lets `qa-functional-tester` actually *drive* a wizard → review → result flow instead of
only reading code. Chosen over Detox for lighter Expo setup.

## What's here

- `smoke.yaml` — shell smoke test: app boots, home header + four tabs render, tab navigation works.

As calculators land, add one flow per calculator (`zakat.yaml`, …) driving inputs → review → result
and asserting the headline figure from the fiqh doc's Worked Examples.

## Running

Maestro is an **external CLI, not an npm dependency** (ADR 0011), so it isn't in `package.json`.

1. Install the Maestro CLI: https://maestro.mobile.dev (`curl -Ls "https://get.maestro.mobile.dev" | bash`).
2. Build and install a **dev-client** build on a device/emulator (Expo Go can't run this app —
   WatermelonDB + MMKV + notifications are native). Requires EAS build profiles (not yet set up —
   see the roadmap; confirm before running any build).
3. Set the `appId` in each flow to match `app.json`'s `android.package` / `ios.bundleIdentifier`
   once those are defined.
4. Run: `maestro test .maestro/smoke.yaml`

E2E is **not yet wired into CI** (CI itself is deferred, ADR 0011) — these run locally/manually for
now. Wire them in when CI lands.
