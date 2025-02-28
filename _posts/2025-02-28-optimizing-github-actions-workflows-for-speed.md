---
id: 1275
title: '⏩ Optimizing GitHub Actions Workflows for Speed and Efficiency'
date: '2025-02-28'
description: 'Optimizing GitHub Actions Workflows for Speed and Efficiency'
layout: post
guid: 'https://marcusfelling.com/?p=1275'
permalink: /blog/2025/optimizing-github-actions-workflows-for-speed
thumbnail-img: /content/uploads/2025/02/optimize-gha.png
nav-short: true
tags: [GitHub Actions, CI/CD]
---

Slow CI/CD pipelines directly impact developer productivity and deployment frequency. When pull request checks take 15+ minutes to complete, developers context-switch to other tasks, breaking their flow and reducing productivity. Additionally, GitHub Actions charges by the minute, so inefficient workflows literally cost you money.

I'll go through some optimization techniques I've found to be effective:

- [Caching Dependencies](#caching-dependencies)
- [Optimize Docker Usage](#optimize-docker-usage)
- [Strategic Job Splitting and Parallelization](#strategic-job-splitting-and-parallelization)
- [Matrix Builds for Testing Efficiently](#matrix-builds-for-testing-efficiently)
- [Selective Testing with Path Filtering](#selective-testing-with-path-filtering)
- [Self-hosted Runners for Specialized Workloads](#self-hosted-runners-for-specialized-workloads)
- [Monitoring Your Workflow Performance](#monitoring-your-workflow-performance)
- [Conclusion](#conclusion)

## Caching Dependencies

The most immediate win for most workflows is proper dependency caching:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          
      - name: Cache dependencies
        uses: actions/cache@v3
        with:
          path: |
            ~/.npm
            node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-
            
      - name: Install dependencies
        run: npm ci --prefer-offline --no-audit
```

The above example includes several optimizations:
- Caching both `~/.npm` and `node_modules`
- Using lockfile hashing for cache keys
- Fallback cache keys for partial hits
- `--prefer-offline` flag to prioritize cached packages

## Optimize Docker Usage

For workflows using Docker, image layering and caching are critical:

```yaml
jobs:
  docker-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
        
      - name: Cache Docker layers
        uses: actions/cache@v3
        with:
          path: /tmp/.buildx-cache
          key: ${{ runner.os }}-buildx-${{ github.sha }}
          restore-keys: |
            ${{ runner.os }}-buildx-
            
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: false
          cache-from: type=local,src=/tmp/.buildx-cache
          cache-to: type=local,dest=/tmp/.buildx-cache-new,mode=max
```

After your build, add this step to prevent cache size explosion:

```yaml
      - name: Move cache
        run: |
          rm -rf /tmp/.buildx-cache
          mv /tmp/.buildx-cache-new /tmp/.buildx-cache
```

## Strategic Job Splitting and Parallelization

Instead of sequential steps, split work into parallel jobs when possible:

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        # ...lint setup and execution
        
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        # ...test setup and execution
        
  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    # This job only runs after lint and test complete successfully
```

## Matrix Builds for Testing Efficiently

For multi-environment testing, use matrix builds:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [14, 16, 18]
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm test
```

## Selective Testing with Path Filtering

Avoid running unnecessary jobs by filtering based on changed paths:

```yaml
jobs:
  frontend-tests:
    if: |
      github.event_name == 'pull_request' &&
      (github.event.pull_request.base.ref == 'main' ||
       contains(github.event.pull_request.labels.*.name, 'run-all-tests'))
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: dorny/paths-filter@v2
        id: filter
        with:
          filters: |
            frontend:
              - 'frontend/**'
              - 'shared/**'
              
      - name: Frontend Tests
        if: steps.filter.outputs.frontend == 'true'
        run: npm test
```

## Self-hosted Runners for Specialized Workloads

For specific needs like GPU access or large compute requirements, [self-hosted runners](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners) can dramatically improve performance:

```yaml
jobs:
  gpu-training:
    runs-on: self-hosted-gpu
    steps:
      - uses: actions/checkout@v3
      # GPU-intensive tasks here
```

## Monitoring Your Workflow Performance

GitHub provides insights into workflow run times. Use the GitHub API to track this data over time:

```javascript
async function getWorkflowRunTimes(owner, repo, workflow_id) {
  const { Octokit } = require("@octokit/rest");
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  
  const runs = await octokit.actions.listWorkflowRuns({
    owner,
    repo,
    workflow_id,
  });
  
  return runs.data.workflow_runs.map(run => ({
    id: run.id,
    duration: new Date(run.updated_at) - new Date(run.created_at),
    conclusion: run.conclusion
  }));
}
```

## Conclusion

Optimizing GitHub Actions workflows is an ongoing process. Start with the high-impact items like caching and job parallelization, then iteratively improve based on metrics. The reward is not just faster builds but happier developers and lower costs.

What optimization techniques have you found most effective for your GitHub Actions workflows? Share your experiences in the comments!
