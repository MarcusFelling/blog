import type { SquadConfig } from '@bradygaster/squad';

/**
 * Squad Configuration for blog
 * 
 */
const config: SquadConfig = {
  version: '1.0.0',
  
  models: {
    defaultModel: 'claude-opus-4.6',
    defaultTier: 'standard',
    fallbackChains: {
      premium: ['claude-opus-4.6', 'claude-opus-4.6-fast', 'claude-opus-4.5', 'claude-sonnet-4.5'],
      standard: ['claude-sonnet-4.5', 'gpt-5.2-codex', 'claude-sonnet-4', 'gpt-5.2'],
      fast: ['claude-haiku-4.5', 'gpt-5.1-codex-mini', 'gpt-4.1', 'gpt-5-mini']
    },
    preferSameProvider: true,
    respectTierCeiling: true,
    nuclearFallback: {
      enabled: false,
      model: 'claude-haiku-4.5',
      maxRetriesBeforeNuclear: 3
    }
  },
  
  routing: {
    rules: [
      {
        workType: 'feature-dev',
        agents: ['@keaton', '@mcmanus'],
        confidence: 'high'
      },
      {
        workType: 'bug-fix',
        agents: ['@keaton', '@mcmanus'],
        confidence: 'high'
      },
      {
        workType: 'testing',
        agents: ['@hockney'],
        confidence: 'high'
      },
      {
        workType: 'documentation',
        agents: ['@verbal'],
        confidence: 'high'
      },
      {
        workType: 'design',
        agents: ['@fenster'],
        confidence: 'high'
      },
      {
        workType: 'devrel',
        agents: ['@kobayashi'],
        confidence: 'high'
      }
    ],
    governance: {
      eagerByDefault: true,
      scribeAutoRuns: false,
      allowRecursiveSpawn: false
    }
  },
  
  casting: {
    allowlistUniverses: [
      'The Usual Suspects',
      'Breaking Bad',
      'The Wire',
      'Firefly'
    ],
    overflowStrategy: 'generic',
    universeCapacity: {
      'The Usual Suspects': 6
    }
  },
  
  platforms: {
    vscode: {
      disableModelSelection: false,
      scribeMode: 'sync'
    }
  }
};

export default config;
