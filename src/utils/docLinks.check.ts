import assert from 'node:assert/strict';
import { classifyDocLink } from './docLinks';

const cloudNote = 'Cloud/1_Shared_Cloud_Concepts.md';

const sameFolder = classifyDocLink(
  './15_Org_IAM_And_Identity_Federation.md',
  'devops',
  cloudNote,
);
assert.equal(sameFolder.kind, 'doc');
assert.equal(
  sameFolder.kind === 'doc' ? sameFolder.href : '',
  '#/devops/Cloud/15_Org_IAM_And_Identity_Federation.md',
);

const bareName = classifyDocLink(
  '15_Org_IAM_And_Identity_Federation.md',
  'devops',
  cloudNote,
);
assert.equal(
  bareName.kind === 'doc' ? bareName.href : '',
  '#/devops/Cloud/15_Org_IAM_And_Identity_Federation.md',
);

const parent = classifyDocLink(
  '../Security/5_OIDC_CI_And_Least_Privilege.md',
  'devops',
  cloudNote,
);
assert.equal(
  parent.kind === 'doc' ? parent.href : '',
  '#/devops/Security/5_OIDC_CI_And_Least_Privilege.md',
);

const parentFolder = classifyDocLink(
  '../Datacenter/README.md',
  'devops',
  cloudNote,
);
assert.equal(
  parentFolder.kind === 'doc' ? parentFolder.href : '',
  '#/devops/Datacenter/README.md',
);

const twoLevelsUp = classifyDocLink(
  '../../README.md',
  'devops',
  'Cloud/Catalogs/AWS_Products.md',
);
assert.equal(
  twoLevelsUp.kind === 'doc' ? twoLevelsUp.href : '',
  '#/devops/README.md',
);

console.log('doc link checks passed');
