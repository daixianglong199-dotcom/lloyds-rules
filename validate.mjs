import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isIP } from 'node:net';
import { createHash } from 'node:crypto';

// Offline only: never reads raw Loon logs, sends requests or writes rules.
const root = dirname(fileURLToPath(import.meta.url));
const shared = ['dynatrace.com', 'amazontrust.com', 'online-metrix.net',
  'threatmetrix.com', 'demdex.net', 'everesttech.net', 'omtrdc.net',
  'adobedc.net', 'dashboard.co.uk', 'qualtrics.com', 'tiqcdn.com'];
const unrelated = ['halifax.co.uk', 'halifax.com', 'tsb.co.uk', 'bankofscotland.co.uk',
  'monzo.com', 'monzo-alt.net', 'monzo.me', 'kraken.com', 'kraken.ws',
  'worldfirst.com', 'worldfirst.com.cn'];
const broad = new Set(['uk', 'co.uk', 'org.uk', 'ac.uk', 'gov.uk', 'com', 'net', 'info']);
const under = (host, domain) => host === domain || host.endsWith(`.${domain}`);
const fqdn = host => host.length <= 253 && !isIP(host) &&
  /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(host);
const matching = (rules, host) => rules.some(rule => rule.type === 'DOMAIN'
  ? host === rule.domain : under(host, rule.domain));
const activeLines = text => text.split(/\r?\n/).map((text, index) => ({ text: text.trim(), line: index + 1 }))
  .filter(row => row.text && !row.text.startsWith('#'));

function parseRules(text) {
  assert(!text.startsWith('\uFEFF'), 'Rules must use UTF-8 without BOM');
  const rules = activeLines(text).map(({ text, line }) => {
    const parts = text.split(',');
    assert(parts.length === 2, `Line ${line}: expected two columns, no policy`);
    const [type, domain] = parts;
    assert(['DOMAIN', 'DOMAIN-SUFFIX'].includes(type), `Line ${line}: unsupported rule type`);
    assert(fqdn(domain), `Line ${line}: invalid or non-normalized hostname`);
    assert(!broad.has(domain), `Line ${line}: public/broad suffix forbidden`);
    assert(!(type === 'DOMAIN-SUFFIX' && ['lloydsbanking.com', 'lloydsbankinggroup.com'].includes(domain)),
      `Line ${line}: group root suffix is intentionally scope-limited`);
    assert(!unrelated.some(parent => under(domain, parent)), `Line ${line}: unrelated bank/app domain`);
    const provider = shared.find(parent => under(domain, parent));
    if (provider) {
      assert(type === 'DOMAIN' && domain !== provider, `Line ${line}: shared services require an exact reviewed host`);
    }
    return { type, domain };
  });
  assert(rules.length > 0, 'Formal rule set must not be empty');
  const keys = rules.map(rule => `${rule.type},${rule.domain}`);
  assert(new Set(keys).size === keys.length, 'Duplicate rules');
  for (let i = 0; i < rules.length; i++) {
    for (let j = 0; j < rules.length; j++) {
      if (i !== j && rules[j].type === 'DOMAIN-SUFFIX') {
        assert(!under(rules[i].domain, rules[j].domain), 'Redundant rule already covered by a suffix');
      }
    }
  }
  return rules;
}

function selfCheck() {
  let count = 0;
  for (const bad of [
    'DOMAIN-KEYWORD,lloyds', 'PROCESS-NAME,Lloyds', 'USER-AGENT,Lloyds*',
    'IP-CIDR,192.0.2.0/24', 'DOMAIN-SUFFIX,co.uk', 'DOMAIN-SUFFIX,uk',
    'DOMAIN-SUFFIX,amazontrust.com', 'DOMAIN-SUFFIX,dynatrace.com',
    'DOMAIN-SUFFIX,online-metrix.net', 'DOMAIN-SUFFIX,threatmetrix.com',
    'DOMAIN-SUFFIX,lloydsbanking.com', 'DOMAIN-SUFFIX,lloydsbankinggroup.com',
    'DOMAIN-SUFFIX,dashboard.co.uk', 'DOMAIN-SUFFIX,qualtrics.com',
    'DOMAIN-SUFFIX,adobedc.net', 'DOMAIN-SUFFIX,tiqcdn.com',
    'DOMAIN-SUFFIX,h-lloydsbank.online-metrix.net', 'DOMAIN,online-metrix.net',
    'DOMAIN-SUFFIX,halifax.co.uk', 'DOMAIN-SUFFIX,tsb.co.uk',
    'DOMAIN-SUFFIX,bankofscotland.co.uk', 'DOMAIN-SUFFIX,monzo.com',
    'DOMAIN-SUFFIX,kraken.com', 'DOMAIN-SUFFIX,worldfirst.com',
    'DOMAIN,lloydsbank.com,UK', 'DOMAIN,https://lloydsbank.com',
    'DOMAIN,127.0.0.1', 'DOMAIN,LLoydsbank.com', '\uFEFFDOMAIN,lloydsbank.com',
    'DOMAIN,lloydsbank.com\nDOMAIN,lloydsbank.com',
    'DOMAIN,online.lloydsbank.co.uk\nDOMAIN-SUFFIX,lloydsbank.co.uk',
    'DOMAIN-SUFFIX,api.lloydsbank.co.uk\nDOMAIN-SUFFIX,lloydsbank.co.uk',
    'DOMAIN,lloydsbank.com\nDOMAIN-SUFFIX,lloydsbank.com',
  ]) { assert.throws(() => parseRules(bad)); count++; }
  const suffix = parseRules('DOMAIN-SUFFIX,lloydsbank.com');
  for (const host of ['lloydsbank.com', 'www.lloydsbank.com', 'a.b.lloydsbank.com']) {
    assert(matching(suffix, host)); count++;
  }
  for (const host of ['evil-lloydsbank.com', 'lloydsbank.com.example.net', 'notlloydsbank.com']) {
    assert(!matching(suffix, host)); count++;
  }
  const exact = parseRules('DOMAIN,h-lloydsbank.online-metrix.net');
  assert(matching(exact, 'h-lloydsbank.online-metrix.net')); count++;
  assert(!matching(exact, 'x.h-lloydsbank.online-metrix.net')); count++;
  const cdn = parseRules('DOMAIN-SUFFIX,cdn.lloydsbanking.com');
  assert(matching(cdn, 's16370.cdn.lloydsbanking.com')); count++;
  assert(!matching(cdn, 'developer.lloydsbanking.com')); count++;
  assert(!matching(cdn, 'cdn.lloydsbanking.com.example.net')); count++;
  assert.throws(() => parseRules('DOMAIN-SUFFIX,cdn.lloydsbanking.com\nDOMAIN,s5933.cdn.lloydsbanking.com')); count++;
  return count;
}

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (['.git', 'private', 'logs', 'node_modules', 'hosts.local.txt'].includes(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (entry.isFile()) files.push(path);
  }
  return files;
}

async function main() {
  const args = process.argv.slice(2);
  assert(args.length === 0 || (args.length === 2 && args[0] === '--hosts'),
    'Usage: node validate.mjs [--hosts reviewed-hostnames.txt]');
  const fixtureChecks = selfCheck();
  const ruleText = await readFile(join(root, 'Lloyds', 'Lloyds-UK.list'), 'utf8');
  const rules = parseRules(ruleText);
  const extensionText = await readFile(join(root, 'Lloyds', 'Lloyds-UK-Extended.list'), 'utf8');
  const extension = parseRules(extensionText);
  const combined = parseRules([...rules, ...extension].map(r => `${r.type},${r.domain}`).join('\n'));
  const candidates = await readFile(join(root, 'Lloyds', 'candidates.list'), 'utf8');
  assert(activeLines(candidates).length === 0, 'Candidate file must contain comments only');
  const evidence = JSON.parse(await readFile(join(root, 'Lloyds', 'sources.json'), 'utf8'));
  const sourceIds = new Set([...evidence.github_sources, ...evidence.official_sources,
    ...evidence.public_issue_sources, evidence.dns_observations].map(s => s.id));
  assert(new Set(evidence.domain_decisions.map(d => d.domain)).size === evidence.domain_decisions.length,
    'Duplicate domain decisions');
  for (const decision of evidence.domain_decisions) {
    assert(fqdn(decision.domain), 'Invalid audit hostname');
    assert(decision.sources.length && decision.sources.every(id => sourceIds.has(id)), 'Missing evidence reference');
    assert(typeof decision.ios_tested === 'boolean', 'Every review object needs an iOS verification flag');
    if (decision.ios_tested) assert(decision.ios_evidence, 'iOS verification needs explicit evidence');
    assert.equal(decision.core_covered, matching(rules, decision.domain), 'Stale core coverage flag');
    assert.equal(decision.extension_covered, matching(extension, decision.domain), 'Stale extension coverage flag');
  }
  const approved = evidence.domain_decisions.filter(d => d.decision === 'formal');
  assert.deepEqual(rules.map(r => `${r.type},${r.domain}`).sort(),
    approved.map(d => `${d.rule_type},${d.domain}`).sort(), 'Formal rules and reviewed evidence differ');
  const extensionApproved = evidence.domain_decisions.filter(d => d.decision === 'extension');
  assert.deepEqual(extension.map(r => `${r.type},${r.domain}`).sort(),
    extensionApproved.map(d => `${d.rule_type},${d.domain}`).sort(), 'Extension rules and evidence differ');
  for (const domain of ['lloydsbankinggroup.com', 'lloydsbanking.com', 'lloydsbank.info',
    ...shared, ...unrelated]) {
    assert(!matching(combined, domain), 'Candidate/shared/unrelated root must not match');
  }
  for (const host of ['online.lloydsbank.co.uk', 'www.lloydsbank.com',
    'check2.lloydsbank.co.uk', 'lloydsbank-online.co.uk',
    'authorise-api.lloydsbank.co.uk', 'secure-api.lloydsbank.com', 'secure-api-eidas.lloydsbank.com']) {
    assert(matching(rules, host), 'Expected official hostname is not covered');
  }
  for (const d of evidence.domain_decisions.filter(d => d.decision === 'candidate')) {
    assert(!matching(combined, d.domain), 'Candidate must not enter either subscription');
  }
  const summary = JSON.parse(await readFile(join(root, 'Lloyds', 'coverage-summary.json'), 'utf8'));
  const reviewedRegistrable = d => d.endsWith('.co.uk') ? d.split('.').slice(-3).join('.') : d.split('.').slice(-2).join('.');
  const expectedSummary = {
    inventory_fqdns: evidence.domain_decisions.length,
    reviewed_registrable_domains: new Set(evidence.domain_decisions.map(d => reviewedRegistrable(d.domain))).size,
    core_rules: rules.length, extension_rules: extension.length,
    independent_suffix_rules: combined.filter(r => r.type === 'DOMAIN-SUFFIX').length,
    exact_host_rules: combined.filter(r => r.type === 'DOMAIN').length,
    covered_by_core: evidence.domain_decisions.filter(d => matching(rules, d.domain)).length,
    additional_covered_by_extension: evidence.domain_decisions.filter(d => !matching(rules,d.domain) && matching(extension,d.domain)).length,
    uncovered_candidates: evidence.domain_decisions.filter(d => !matching(combined,d.domain) && d.decision === 'candidate').length,
    excluded_or_scope_limited: evidence.domain_decisions.filter(d => !matching(combined,d.domain) && d.decision !== 'candidate').length,
    ios_runtime_verified: evidence.domain_decisions.filter(d => d.ios_tested).length,
  };
  for (const [key, value] of Object.entries(expectedSummary)) assert.equal(summary[key], value, `Stale summary: ${key}`);
  assert.equal(summary.covered_by_core + summary.additional_covered_by_extension + summary.uncovered_candidates + summary.excluded_or_scope_limited,
    summary.inventory_fqdns, 'Inventory coverage partitions must sum to total');
  const example = await readFile(join(root, 'Lloyds', 'Loon-RemoteRule.example.conf'), 'utf8');
  const expectedUrls = ['Lloyds-UK.list', 'Lloyds-UK-Extended.list'].map(name =>
    `https://raw.githubusercontent.com/daixianglong199-dotcom/lloyds-rules/main/Lloyds/${name}`);
  const subscriptionLines = activeLines(example).filter(row => !row.text.startsWith('[')).map(row => row.text);
  assert.equal(subscriptionLines.length, 2, 'Expected core and optional extension subscription examples');
  for (let i = 0; i < subscriptionLines.length; i++) {
    assert(subscriptionLines[i].startsWith(expectedUrls[i] + ','), 'Incorrect subscription URL');
    assert(/, policy=Kraken英国固定, tag=Lloyds-UK(?:-Extended)?, enabled=true$/.test(subscriptionLines[i]),
      'Example must use the verified existing UK policy');
  }
  for (const file of await walk(root)) {
    assert(!/\.(?:log|har|pcap|pcapng|lcf|p12|pem|key)$/i.test(file),
      `Private data file must not be published: ${relative(root, file)}`);
    if (!/\.(?:md|json|mjs|list)$/.test(file)) continue;
    const content = await readFile(file, 'utf8');
    const sensitive = /gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|^\s*(?:Cookie|Authorization):\s*\S/im;
    assert(!sensitive.test(content), `Potential credentials in ${relative(root, file)}`);
  }
  const candidateDomains = evidence.domain_decisions.filter(d => d.decision === 'candidate').map(d => d.domain);
  console.log(JSON.stringify({ status: 'PASS', core_rule_count: rules.length, extension_rule_count: extension.length,
    combined_rule_count: combined.length, coverage: expectedSummary,
    types: [...new Set(combined.map(r => r.type))], candidate_count: candidateDomains.length,
    candidate_executable_lines: 0, github_files_read: evidence.github_sources.length,
    fixture_checks: fixtureChecks, duplicate_rules: 0, redundant_rules: 0,
    shared_suffix_rules: 0, unrelated_app_rules: 0,
    sha256: {core:createHash('sha256').update(ruleText).digest('hex'),
      extension:createHash('sha256').update(extensionText).digest('hex')},
    limitations: ['Offline static validation; not the Loon runtime or live App testing',
      'Credential scanning is a basic check, not a privacy guarantee'] }, null, 2));
  if (args.length) {
    // Review and strip all identifiers locally before giving this tool any data.
    const lines = (await readFile(resolve(args[1]), 'utf8')).split(/\r?\n/);
    const hosts = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('#')) continue;
      const host = line.toLowerCase().replace(/\.$/, '');
      assert(fqdn(host), `Host input line ${i + 1}: expected one reviewed hostname; raw logs and URLs are refused`);
      hosts.push(host);
    }
    const result = { core_covered: [], extension_covered: [], candidates: [], known_unrouted: [], unclassified: [] };
    for (const host of [...new Set(hosts)].sort()) {
      const category = matching(rules, host) ? 'core_covered' : matching(extension, host) ? 'extension_covered'
        : candidateDomains.includes(host) ? 'candidates'
        : evidence.domain_decisions.some(d=>d.domain===host) ? 'known_unrouted' : 'unclassified';
      result[category].push(host);
    }
    console.log(JSON.stringify({ hostname_comparison: result, rules_modified: false, network_requests: 0 }, null, 2));
  }
}

main().catch(error => { console.error(`FAIL: ${error.message}`); process.exitCode = 1; });
