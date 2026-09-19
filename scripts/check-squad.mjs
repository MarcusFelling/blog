import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const read = (relativePath) => readFileSync(new URL(relativePath, root), 'utf8');
const manifest = JSON.parse(read('package.json'));
const lock = JSON.parse(read('package-lock.json'));
const config = JSON.parse(read('.squad/config.json'));
const mcp = JSON.parse(read('.mcp.json'));
const version = manifest.devDependencies['@bradygaster/squad-cli'];

assert.match(version, /^\d+\.\d+\.\d+$/, 'Pin Squad to a tested stable version');
assert.equal(lock.packages['node_modules/@bradygaster/squad-cli'].version, version);
assert.equal(config.teamRoot, undefined, 'Use the local team, not a machine-specific pointer');
assert.ok(mcp.mcpServers.squad_state.args.includes(`@bradygaster/squad-cli@${version}`),
  'The MCP server must match the installed CLI version');
assert.ok(read('.github/agents/squad.agent.md').includes('SQUAD_COORDINATOR_CANARY_a8f3'),
  'The upgraded coordinator must be complete');
assert.ok(!read('.squad/team.md').includes('copilot-auto-assign: true'),
  'Issue-based Copilot auto-assignment must stay disabled');

const workflows = readdirSync(new URL('.github/workflows/', root));
const issueOrReleaseWorkflows = workflows.filter((name) =>
  /^(squad-|sync-squad-labels).*\.ya?ml$/.test(name));
assert.deepEqual(issueOrReleaseWorkflows, [],
  'Squad upgrade restored upstream workflows; review and remove issue/release scaffolding');

for (const agent of ['keaton', 'verbal', 'mcmanus', 'hockney', 'fenster', 'kobayashi', 'scribe']) {
  assert.ok(read(`.squad/agents/${agent}/charter.md`).trim(), `Missing ${agent} charter`);
}

assert.ok(read('.github/copilot-instructions.md').includes('GitHub Issues are not used'),
  'Restore repo-specific instructions after squad upgrade');

const git = (args, input) => execFileSync('git', args, {
  cwd: fileURLToPath(root), encoding: 'utf8', input
});
const tracked = git(['ls-files', '-z', '--', '.squad', '.copilot/skills', '.github/agents'])
  .split('\0').filter(Boolean);
const shareableSquadPath = /^\.squad\/(?:(?:config\.json|team\.md|routing\.md|ceremonies\.md)|agents\/[^/]+\/charter\.md|casting\/(?:policy|registry)\.json|plugins\/marketplaces\.json|templates\/.+)$/;
const privateFiles = tracked.filter((file) =>
  (file.startsWith('.squad/') && !shareableSquadPath.test(file)) ||
  file.startsWith('.copilot/skills/') || file.endsWith('.local-backup'));
assert.deepEqual(privateFiles, [],
  'Private Squad state is tracked. Untrack it with git rm --cached; preserve local copies.');

const privateProbes = [
  '.squad/agents/example/history.md',
  '.squad/agents/example/history-archive.md',
  '.squad/decisions.md',
  '.squad/decisions/inbox/example.md',
  '.squad/identity/now.md',
  '.squad/log/example.md',
  '.squad/orchestration-log/example.md',
  '.squad/memory/example.json',
  '.squad/skills/example/SKILL.md',
  '.squad/casting/history.json',
  '.squad/new-session-dump.txt',
  '.copilot/skills/example/SKILL.md',
  '.github/agents/squad.agent.md.local-backup'
];
const ignored = new Set(git(['check-ignore', '--no-index', '--stdin', '-z'],
  `${privateProbes.join('\0')}\0`).split('\0').filter(Boolean));
assert.deepEqual(privateProbes.filter((file) => !ignored.has(file)), [],
  'Private Squad state must be ignored by default');

console.log(`Squad ${version}: local team, pinned MCP, on-demand workflow, and private-state exclusions verified (${fileURLToPath(root)})`);