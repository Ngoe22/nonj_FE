import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // React Hook Form không biểu diễn được field array lồng nhau trên
    // discriminated union (`sections[i].items[j].correct_answers`) bằng type.
    // Đường dẫn động buộc phải đi qua `any`; giới hạn đúng phạm vi này.
    files: [
      "src/components/question_preparation/preparation/modal/**/*.tsx",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);

export default eslintConfig;
