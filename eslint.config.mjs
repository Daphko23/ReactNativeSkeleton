import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default [
  // Base JavaScript recommendations
  js.configs.recommended,
  
  // TypeScript configuration
  ...tseslint.configs.recommended,
  
  // React configuration
  pluginReact.configs.flat.recommended,
  
  // File patterns and language options
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        ...globals.jest,
      },
      ecmaVersion: 2021,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // Console statements allowed for development/debugging
      "no-console": "off",
      
      // TypeScript rules - more relaxed for better DX
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn", 
        { 
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true 
        }
      ],
      "@typescript-eslint/no-require-imports": "off",
      
      // React rules
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      
      // General JavaScript rules - relaxed
      "no-case-declarations": "warn",
      "no-constant-condition": "warn", 
      "no-fallthrough": "warn",
      "no-useless-escape": "warn",
      "no-useless-catch": "off",
      
      // Allow some flexibility in development
      "prefer-const": "warn",
      "no-var": "warn",
    },
  },
  
  // Test files
  {
    files: ["**/__tests__/**/*", "**/*.test.{js,ts,tsx}", "**/*.spec.{js,ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Allow any in tests
      "no-console": "off", // Allow console in tests
      "@typescript-eslint/no-require-imports": "off", // Allow require in tests
    },
  },
  
  // Ignore patterns
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**",
      ".expo/**",
      "ios/**",
      "android/**",
      "scripts/**",
      "*.config.js",
      "*.config.mjs",
      "__mocks__/**",
    ],
  },
];
