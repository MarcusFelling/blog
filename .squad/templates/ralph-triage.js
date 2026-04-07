#!/usr/bin/env node
/**
 * ralph-triage.js — Smart issue triage for Squad heartbeat
 * 
 * Reads team roster and routing rules, matches issue content to team members,
 * and outputs triage decisions as JSON.
 * 
 * Usage: node ralph-triage.js --squad-dir .squad --output triage-results.json
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse CLI args
const args = process.argv.slice(2);
const squadDirIdx = args.indexOf('--squad-dir');
const outputIdx = args.indexOf('--output');
const squadDir = squadDirIdx !== -1 ? args[squadDirIdx + 1] : '.squad';
const outputFile = outputIdx !== -1 ? args[outputIdx + 1] : 'triage-results.json';

// Read team roster
function parseTeam(squadDir) {
  const teamFile = path.join(squadDir, 'team.md');
  if (!fs.existsSync(teamFile)) {
    const fallback = teamFile.replace('.squad', '.ai-team');
    if (!fs.existsSync(fallback)) {
      console.error('No team.md found');
      process.exit(1);
    }
    return parseTeamFile(fallback);
  }
  return parseTeamFile(teamFile);
}

function parseTeamFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const members = [];
  let inTable = false;

  for (const line of lines) {
    if (/^##\s+(Members|Team Roster)/i.test(line)) {
      inTable = true;
      continue;
    }
    if (inTable && line.startsWith('## ')) break;
    if (inTable && line.startsWith('|') && !line.includes('---') && !line.includes('Name')) {
      const cells = line.split('|').map(c => c.trim()).filter(Boolean);
      if (cells.length >= 2 && cells[0] !== 'Scribe' && cells[0] !== 'Ralph') {
        members.push({ name: cells[0], role: cells[1] });
      }
    }
  }

  // Check @copilot
  const hasCopilot = content.includes('🤖 Coding Agent');
  const autoAssign = content.includes('<!-- copilot-auto-assign: true -->');

  // Parse capability profile
  let goodFit = ['bug fix', 'test coverage', 'lint', 'format', 'dependency update', 'small feature', 'scaffolding', 'doc fix', 'documentation'];
  let needsReview = ['medium feature', 'refactoring', 'api endpoint', 'migration'];
  let notSuitable = ['architecture', 'system design', 'security', 'auth', 'encryption', 'performance'];

  const goodMatch = content.match(/🟢\s*Good fit[^|]*\|[^|]*\|\s*(.+)\s*\|/i);
  const reviewMatch = content.match(/🟡\s*Needs review[^|]*\|[^|]*\|\s*(.+)\s*\|/i);
  const notMatch = content.match(/🔴\s*Not suitable[^|]*\|[^|]*\|\s*(.+)\s*\|/i);

  if (goodMatch) goodFit = goodMatch[1].split(',').map(s => s.trim().toLowerCase());
  if (reviewMatch) needsReview = reviewMatch[1].split(',').map(s => s.trim().toLowerCase());
  if (notMatch) notSuitable = notMatch[1].split(',').map(s => s.trim().toLowerCase());

  return { members, hasCopilot, autoAssign, goodFit, needsReview, notSuitable };
}

// Role-to-keyword mapping for routing
const ROLE_KEYWORDS = {
  'frontend': ['ui', 'frontend', 'css', 'component', 'button', 'page', 'layout', 'design', 'template', 'html', 'style'],
  'backend': ['api', 'backend', 'database', 'endpoint', 'server', 'auth', 'data'],
  'content': ['blog', 'post', 'article', 'writing', 'content', 'draft', 'seo', 'copy', 'front matter'],
  'test': ['test', 'bug', 'fix', 'regression', 'coverage', 'playwright', 'e2e', 'spec'],
  'design': ['typography', 'spacing', 'color', 'accessibility', 'a11y', 'ux', 'visual', 'responsive'],
  'devops': ['deploy', 'ci', 'pipeline', 'docker', 'infrastructure', 'workflow', 'build', 'github actions'],
  'devrel': ['community', 'social', 'promotion', 'announcement', 'open graph', 'og:', 'share']
};

function matchRole(role) {
  const r = role.toLowerCase();
  for (const [key, _] of Object.entries(ROLE_KEYWORDS)) {
    if (r.includes(key)) return key;
  }
  return null;
}

// Fetch open issues with squad label but no squad:{member} sub-label
function getUntriagedIssues() {
  try {
    const result = execSync(
      'gh issue list --label "squad" --state open --json number,title,body,labels --limit 20',
      { encoding: 'utf8', timeout: 30000 }
    );
    const issues = JSON.parse(result);

    // Filter to only untriaged (have "squad" but no "squad:" member label)
    return issues.filter(issue => {
      const labels = issue.labels.map(l => l.name);
      const hasSquad = labels.includes('squad');
      const hasMember = labels.some(l => l.startsWith('squad:'));
      return hasSquad && !hasMember;
    });
  } catch (e) {
    console.error('Failed to fetch issues:', e.message);
    return [];
  }
}

// Main triage logic
function triage() {
  const team = parseTeam(squadDir);
  const issues = getUntriagedIssues();

  if (issues.length === 0) {
    console.log('📋 No untriaged issues found');
    fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
    return;
  }

  const decisions = [];

  for (const issue of issues) {
    const text = `${issue.title}\n${issue.body || ''}`.toLowerCase();
    let assignTo = null;
    let reason = '';
    let label = '';

    // First, check @copilot fit
    if (team.hasCopilot && team.autoAssign) {
      const isNotSuitable = team.notSuitable.some(kw => text.includes(kw));
      const isGoodFit = !isNotSuitable && team.goodFit.some(kw => text.includes(kw));

      if (isGoodFit) {
        assignTo = '@copilot';
        reason = '🟢 Good fit for @copilot — matches capability profile';
        label = 'squad:copilot';
      }
    }

    // If not routed to @copilot, match by role keywords
    if (!assignTo) {
      for (const member of team.members) {
        if (member.name === '@copilot') continue;
        const roleKey = matchRole(member.role);
        if (roleKey && ROLE_KEYWORDS[roleKey]) {
          const keywords = ROLE_KEYWORDS[roleKey];
          if (keywords.some(kw => text.includes(kw))) {
            assignTo = member.name;
            reason = `Issue matches ${member.role} domain`;
            label = `squad:${member.name.toLowerCase()}`;
            break;
          }
        }
      }
    }

    // Default to Lead
    if (!assignTo) {
      const lead = team.members.find(m =>
        m.role.toLowerCase().includes('lead') ||
        m.role.toLowerCase().includes('architect')
      );
      if (lead) {
        assignTo = lead.name;
        reason = 'No specific domain match — routed to Lead';
        label = `squad:${lead.name.toLowerCase()}`;
      }
    }

    if (assignTo && label) {
      decisions.push({
        issueNumber: issue.number,
        title: issue.title,
        assignTo,
        label,
        reason,
        source: 'ralph-heartbeat'
      });
    }
  }

  fs.writeFileSync(outputFile, JSON.stringify(decisions, null, 2));
  console.log(`🔄 Ralph triaged ${decisions.length} issue(s)`);
}

triage();
