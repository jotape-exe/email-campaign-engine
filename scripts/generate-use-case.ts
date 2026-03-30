import fs from "fs";
import path from "path";

const [, , context, useCaseName] = process.argv;

if (!context || !useCaseName) {
    console.error("❌ Uso: npm run generate:use-case <context> <use-case-name>");
    process.exit(1);
}

// =============================
// HELPERS
// =============================
const toPascal = (str: string) =>
    str
        .split("-")
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join("");

const toCamel = (str: string) => {
    const pascal = toPascal(str);
    return pascal[0].toLowerCase() + pascal.slice(1);
};

const pascalUseCase = toPascal(useCaseName);
const camelUseCase = toCamel(useCaseName);

const pascalContext = toPascal(context);
const camelContext = toCamel(context);

// =============================
// PATHS
// =============================
const useCasePath = path.resolve(
    "src/application/use-case",
    context,
    useCaseName
);

const portPath = path.resolve(
    "src/application/ports",
    `${context}.repository.ts`
);

const infraRepoPath = path.resolve(
    "src/infrastructure/database/repositories",
    `knex-${context}-repository.ts`
);

// =============================
// CREATE FOLDER
// =============================
fs.mkdirSync(useCasePath, { recursive: true });

// =============================
// SAFE WRITE
// =============================
const writeIfNotExists = (filePath: string, content: string) => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content.trim());
        console.log("✅ criado:", filePath);
    } else {
        console.log("⏭ já existe:", filePath);
    }
};

// =============================
// CREATE PORT (SE NÃO EXISTIR)
// =============================
writeIfNotExists(
    portPath,
    `
export interface ${pascalContext}Repository {
  create(data: any): Promise<any>;
  findById(id: string): Promise<any | null>;
}
`
);

// =============================
// CREATE INFRA REPOSITORY
// =============================
writeIfNotExists(
    infraRepoPath,
    `
import { ${pascalContext}Repository } from "@/application/ports/${context}.repository";

export class Knex${pascalContext}Repository implements ${pascalContext}Repository {
  async create(data: any): Promise<any> {
    throw new Error("Not implemented");
  }

  async findById(id: string): Promise<any | null> {
    throw new Error("Not implemented");
  }
}
`
);

// =============================
// USE CASE FILES
// =============================
const files: Record<string, string> = {
    [`${useCaseName}.use-case.ts`]: `
import { ${pascalContext}Repository } from "@/application/ports/${context}.repository";

export class ${pascalUseCase}UseCase {
  constructor(
    private readonly ${camelContext}Repository: ${pascalContext}Repository
  ) {}

  async execute(data: any) {
    return {};
  }
}
`,

    [`${useCaseName}.controller.ts`]: `
import { Request, Response } from "express";
import { ${pascalUseCase}UseCase } from "./${useCaseName}.use-case";

export class ${pascalUseCase}Controller {
  constructor(
    private readonly ${camelUseCase}UseCase: ${pascalUseCase}UseCase
  ) {}

  async handler(req: Request, res: Response) {
    const result = await this.${camelUseCase}UseCase.execute(req.body);
    return res.status(200).json(result);
  }
}
`,

    [`${useCaseName}.dto.ts`]: `
export interface ${pascalUseCase}DTO {}
`,

    [`${useCaseName}.schema.ts`]: `
import { z } from "zod";

export const ${pascalUseCase}Schema = z.object({});
`,

    [`index.ts`]: `
import { ${pascalUseCase}UseCase } from "./${useCaseName}.use-case";
import { ${pascalUseCase}Controller } from "./${useCaseName}.controller";
import { Knex${pascalContext}Repository } from "@/infrastructure/database/repositories/knex-${context}-repository";

const repository = new Knex${pascalContext}Repository();
const useCase = new ${pascalUseCase}UseCase(repository);
const controller = new ${pascalUseCase}Controller(useCase);

export { controller as ${camelUseCase}Controller };
`,
};

Object.entries(files).forEach(([file, content]) => {
    writeIfNotExists(path.join(useCasePath, file), content);
});

console.log(`\n🔥 Use case "${useCaseName}" criado com sucesso!\n`);