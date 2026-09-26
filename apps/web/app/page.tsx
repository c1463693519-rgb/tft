import { ENGINE_VERSION } from '@tft/mechanics';

// Bootstrap placeholder. Real pages start at TASKS.md Phase 5 (T0501+).
export default function HomePage() {
  return (
    <main>
      <h1>TFT Mechanics &amp; Data Platform</h1>
      <p>Project bootstrap — no mechanics implemented yet.</p>
      <dl>
        <dt>Engine version</dt>
        <dd>{ENGINE_VERSION}</dd>
      </dl>
    </main>
  );
}
