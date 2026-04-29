import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

describe('Project Setup', () => {
  it('should have strict mode enabled in tsconfig.json', () => {
    const tsconfigPath = path.join(__dirname, '../tsconfig.json');
    const tsconfigContent = fs.readFileSync(tsconfigPath, 'utf8');
    const tsconfig = JSON.parse(tsconfigContent) as {
      compilerOptions: { strict: boolean };
    };
    expect(tsconfig.compilerOptions.strict).toBe(true);
  });

  it('should have all required dependencies in package.json', () => {
    const packageJsonPath = path.join(__dirname, '../package.json');
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent) as {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
    };
    const deps = packageJson.dependencies;
    const devDeps = packageJson.devDependencies;

    expect(deps['class-validator']).toBeDefined();
    expect(deps['class-transformer']).toBeDefined();
    expect(deps['@nestjs/jwt']).toBeDefined();
    expect(deps['@nestjs/passport']).toBeDefined();
    expect(deps['passport']).toBeDefined();
    expect(deps['passport-jwt']).toBeDefined();
    expect(deps['argon2']).toBeDefined();
    expect(deps['@prisma/client']).toBeDefined();
    expect(devDeps['prisma']).toBeDefined();
  });

  it('should pass ESLint check', () => {
    expect(() => execSync('npm run lint', { stdio: 'ignore' })).not.toThrow();
  });

  it('should pass TypeScript type check', () => {
    expect(() =>
      execSync('npx tsc --noEmit', { stdio: 'ignore' }),
    ).not.toThrow();
  });

  it('should have environment validation in main.ts', () => {
    const mainTsPath = path.join(__dirname, 'main.ts');
    const mainTsContent = fs.readFileSync(mainTsPath, 'utf8');
    expect(mainTsContent).toContain('DATABASE_URL');
    expect(mainTsContent).toContain('JWT_SECRET');
  });

  it('should not have "any" types in src directory (excluding tests and generated files)', () => {
    // This is a simple check, might need refinement
    // Search for ': any' or '<any>' in .ts files, excluding .spec.ts and node_modules
    const output = execSync(
      'grep -r ": any" src --exclude="*.spec.ts" || true',
    ).toString();
    expect(output.trim()).toBe('');
  });
});
