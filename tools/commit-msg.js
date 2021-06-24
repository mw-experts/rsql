const fs = require('fs');

const message = fs.readFileSync(process.env.HUSKY_GIT_PARAMS, 'utf-8');

if (
  !/^(?:build|ci|docs|feat|fix|perf|refactor|style|test)\([a-z0-9-]{3,}\):\s#\d+\s.{10,}/.test(message) &&
  !/^publish v\.\d+\.\d+\.\d+/.test(message)
) {
  console.log(`
    Commit message should follow the pattern:
    <TYPE>(<SCOPE>): #<ISSUE> <SUBJECT>

    Where is:
    TYPE - build|ci|docs|feat|fix|perf|refactor|style|test
    SCOPE - page or feature name [a-z0-9-] at least 3 characters
    ISSUE - issue number
    SUBJECT - short description of changes, at least 10 characters

    Example: feat(cart-page): #77 some beautiful feature implementation

    TYPE:
    build: Changes that affect the build system or external dependencies
    ci: Changes to our CI configuration files and scripts
    docs: Documentation only changes
    feat: A new feature
    fix: A bug fix
    perf: A code change that improves performance
    refactor: A code change that neither fixes a bug nor adds a feature
    style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
    test: Adding missing tests or correcting existing tests
  `);

  process.exit(1);
}


const { execSync } = require('child_process');

function getCurrentBranch() {
  const branches = execSync('git branch', { encoding: 'utf8' });
  return branches
    .split('\n')
    .find((b) => b.charAt(0) === '*')
    .trim()
    .substring(2);
}

if (
  !/^#\d+\/[a-z0-9-]{3,}/.test(getCurrentBranch()) &&
  !/^main$/
) {
  console.log(`
    Branch name should follow the pattern:
    #<ISSUE>/<SUBJECT>

    Where is:
    ISSUE - issue number
    SUBJECT - [a-z0-9-] at least 3 characters

    Example: #77/some-feature-implementation
  `);

  process.exit(1);
}
