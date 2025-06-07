#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function _toCamelCase(str) {
  return str.replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '');
}

/**
 * Convert string to PascalCase (e.g., "user-profile" -> "UserProfile")
 */
const _toPascalCase = (str) => {
  return str
    .split(/[-_\s]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
};

async function createCrudFeature() {
  console.log('🚀 CRUD-Feature Generator');
  console.log('==========================');

  // Prüfe ob wir im richtigen Verzeichnis sind
  if (!fs.existsSync('src/features')) {
    console.error('❌ Fehler: src/features Verzeichnis nicht gefunden!');
    console.error('   Bitte führe das Script aus dem Projekt-Root aus.');
    process.exit(1);
  }

  const featureName = await question('🧱 Feature-Name (z.B. todo, user): ');
  if (!featureName) {
    console.error('❌ Fehler: Kein Feature-Name angegeben.');
    process.exit(1);
  }

  const description = await question('📝 Beschreibung (optional): ');
  const entityFields = await question(
    '📊 Entity-Felder (z.B. title:string,completed:boolean): '
  );
  const hasAuth = await question('🔐 Authentifizierung erforderlich? (y/n): ');
  const apiEndpoint = await question('🌐 API-Endpoint (z.B. /api/todos): ');

  const featurePath = `src/features/${featureName}`;
  const _kebabName = featureName.toLowerCase().replace(/\s+/g, '-');
  const _camelName = featureName.replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '');
  const pascalName = featureName.charAt(0).toUpperCase() + _camelName.slice(1);
  const _upperSnakeName = featureName.toUpperCase().replace(/[-\s]+/g, '_');

  // Prüfe ob Feature bereits existiert
  if (fs.existsSync(featurePath)) {
    console.error(`❌ Fehler: Feature '${featureName}' existiert bereits!`);
    process.exit(1);
  }

  console.log(`📁 Erstelle CRUD-Feature: ${featureName}`);

  // Erstelle Ordnerstruktur
  const dirs = [
    'domain/entities',
    'domain/repositories',
    'domain/types',
    'application/use-cases',
    'application/services',
    'data/repository',
    'data/sources',
    'data/dto',
    'data/mappers',
    'presentation/components',
    'presentation/screens',
    'presentation/hooks',
    'presentation/store',
    '__tests__/application',
    '__tests__/data',
    '__tests__/domain',
    '__tests__/presentation',
  ];

  dirs.forEach(dir => {
    fs.mkdirSync(path.join(featurePath, dir), {recursive: true});
  });

  // Parse Entity-Felder
  const fields = entityFields
    ? entityFields.split(',').map(field => {
        const [name, type] = field.split(':');
        return {name: name.trim(), type: type?.trim() || 'string'};
      })
    : [{name: 'name', type: 'string'}];

  // 1. Entity erstellen
  const entityContent = `export interface ${pascalName} {
  id: string;
${fields.map(field => `  ${field.name}: ${field.type};`).join('\n')}
  createdAt: string;
  updatedAt: string;
}

export interface Create${pascalName}Request {
${fields.map(field => `  ${field.name}: ${field.type};`).join('\n')}
}

export interface Update${pascalName}Request {
${fields.map(field => `  ${field.name}?: ${field.type};`).join('\n')}
}

export interface ${pascalName}ListResponse {
  data: ${pascalName}[];
  total: number;
  page: number;
  limit: number;
}`;

  fs.writeFileSync(
    path.join(featurePath, `domain/entities/${pascalName}.ts`),
    entityContent
  );

  // 2. Repository Interface
  const repositoryContent = `import {${pascalName}, Create${pascalName}Request, Update${pascalName}Request, ${pascalName}ListResponse} from '../entities/${pascalName}';

export interface ${pascalName}Repository {
  findAll(page?: number, limit?: number): Promise<${pascalName}ListResponse>;
  findById(id: string): Promise<${pascalName} | null>;
  create(request: Create${pascalName}Request): Promise<${pascalName}>;
  update(id: string, request: Update${pascalName}Request): Promise<${pascalName}>;
  delete(id: string): Promise<void>;
}`;

  fs.writeFileSync(
    path.join(featurePath, `domain/repositories/${pascalName}Repository.ts`),
    repositoryContent
  );

  // 3. Use Cases
  const useCases = ['Get', 'Create', 'Update', 'Delete'];
  useCases.forEach(action => {
    const useCaseContent = `import {${pascalName}${action === 'Get' ? 'ListResponse' : action === 'Create' ? ', Create' + pascalName + 'Request' : action === 'Update' ? ', Update' + pascalName + 'Request' : ''}} from '../../domain/entities/${pascalName}';
import {${pascalName}Repository} from '../../domain/repositories/${pascalName}Repository';

export class ${action}${pascalName}${action === 'Get' ? 'List' : ''}UseCase {
  constructor(private readonly repository: ${pascalName}Repository) {}

  async execute(${action === 'Get' ? 'page = 1, limit = 10' : action === 'Create' ? `request: Create${pascalName}Request` : action === 'Update' ? `id: string, request: Update${pascalName}Request` : 'id: string'}): Promise<${action === 'Get' ? `${pascalName}ListResponse` : action === 'Delete' ? 'void' : pascalName}> {
    try {
      ${
        action === 'Get'
          ? 'return await this.repository.findAll(page, limit);'
          : action === 'Create'
            ? 'return await this.repository.create(request);'
            : action === 'Update'
              ? 'return await this.repository.update(id, request);'
              : 'await this.repository.delete(id);'
      }
    } catch (error) {
      throw new Error(\`Failed to ${action.toLowerCase()} ${featureName}: \${error.message}\`);
    }
  }
}`;

    fs.writeFileSync(
      path.join(
        featurePath,
        `application/use-cases/${action}${pascalName}${action === 'Get' ? 'List' : ''}UseCase.ts`
      ),
      useCaseContent
    );
  });

  // 4. Data Layer - DTO
  const dtoContent = `export interface ${pascalName}DTO {
  id: string;
${fields.map(field => `  ${field.name}: ${field.type};`).join('\n')}
  created_at: string;
  updated_at: string;
}

export interface Create${pascalName}DTO {
${fields.map(field => `  ${field.name}: ${field.type};`).join('\n')}
}`;

  fs.writeFileSync(
    path.join(featurePath, `data/dto/${pascalName}DTO.ts`),
    dtoContent
  );

  // 5. Mapper
  const mapperContent = `import {${pascalName}, Create${pascalName}Request} from '../../domain/entities/${pascalName}';
import {${pascalName}DTO, Create${pascalName}DTO} from '../dto/${pascalName}DTO';

export class ${pascalName}Mapper {
  static toDomain(dto: ${pascalName}DTO): ${pascalName} {
    return {
      id: dto.id,
${fields.map(field => `      ${field.name}: dto.${field.name},`).join('\n')}
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
    };
  }

  static toCreateDTO(request: Create${pascalName}Request): Create${pascalName}DTO {
    return {
${fields.map(field => `      ${field.name}: request.${field.name},`).join('\n')}
    };
  }
}`;

  fs.writeFileSync(
    path.join(featurePath, `data/mappers/${pascalName}Mapper.ts`),
    mapperContent
  );

  // 6. Repository Implementation
  const repoImplContent = `import {${pascalName}Repository} from '../../domain/repositories/${pascalName}Repository';
import {${pascalName}, Create${pascalName}Request, Update${pascalName}Request, ${pascalName}ListResponse} from '../../domain/entities/${pascalName}';
import {${pascalName}Mapper} from '../mappers/${pascalName}Mapper';
import {supabase} from '@core/config/supabase';

export class Supabase${pascalName}Repository implements ${pascalName}Repository {
  private readonly tableName = '${featureName}s';

  async findAll(page = 1, limit = 10): Promise<${pascalName}ListResponse> {
    const offset = (page - 1) * limit;
    
    const { data, error, count } = await supabase
      .from(this.tableName)
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return {
      data: data?.map(${pascalName}Mapper.toDomain) || [],
      total: count || 0,
      page,
      limit,
    };
  }

  async findById(id: string): Promise<${pascalName} | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }

    return data ? ${pascalName}Mapper.toDomain(data) : null;
  }

  async create(request: Create${pascalName}Request): Promise<${pascalName}> {
    const dto = ${pascalName}Mapper.toCreateDTO(request);
    
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(dto)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return ${pascalName}Mapper.toDomain(data);
  }

  async update(id: string, request: Update${pascalName}Request): Promise<${pascalName}> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(request)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return ${pascalName}Mapper.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
}`;

  fs.writeFileSync(
    path.join(
      featurePath,
      `data/repository/Supabase${pascalName}Repository.ts`
    ),
    repoImplContent
  );

  // 7. Store
  const storeContent = `import {create} from 'zustand';
import {${pascalName}, Create${pascalName}Request, Update${pascalName}Request} from '../../domain/entities/${pascalName}';

interface ${pascalName}State {
  // Data
  items: ${pascalName}[];
  currentItem: ${pascalName} | null;
  total: number;
  page: number;
  limit: number;
  
  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  
  // Error handling
  error: string | null;
  
  // Actions
  setItems: (items: ${pascalName}[], total: number, page: number) => void;
  setCurrentItem: (item: ${pascalName} | null) => void;
  addItem: (item: ${pascalName}) => void;
  updateItem: (item: ${pascalName}) => void;
  removeItem: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setCreating: (creating: boolean) => void;
  setUpdating: (updating: boolean) => void;
  setDeleting: (deleting: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  items: [],
  currentItem: null,
  total: 0,
  page: 1,
  limit: 10,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
};

export const use${pascalName}Store = create<${pascalName}State>((set, get) => ({
  ...initialState,
  
  setItems: (items, total, page) => set({ items, total, page }),
  setCurrentItem: (currentItem) => set({ currentItem }),
  addItem: (item) => set((state) => ({ items: [item, ...state.items], total: state.total + 1 })),
  updateItem: (item) => set((state) => ({
    items: state.items.map(i => i.id === item.id ? item : i),
    currentItem: state.currentItem?.id === item.id ? item : state.currentItem,
  })),
  removeItem: (id) => set((state) => ({
    items: state.items.filter(i => i.id !== id),
    currentItem: state.currentItem?.id === id ? null : state.currentItem,
    total: state.total - 1,
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setCreating: (isCreating) => set({ isCreating }),
  setUpdating: (isUpdating) => set({ isUpdating }),
  setDeleting: (isDeleting) => set({ isDeleting }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  reset: () => set(initialState),
}));`;

  fs.writeFileSync(
    path.join(featurePath, `presentation/store/use${pascalName}Store.ts`),
    storeContent
  );

  // 8. Hooks
  const hooksContent = `import {useCallback} from 'react';
import {use${pascalName}Store} from '../store/use${pascalName}Store';
import {Get${pascalName}ListUseCase} from '../../application/use-cases/Get${pascalName}ListUseCase';
import {Create${pascalName}UseCase} from '../../application/use-cases/Create${pascalName}UseCase';
import {Update${pascalName}UseCase} from '../../application/use-cases/Update${pascalName}UseCase';
import {Delete${pascalName}UseCase} from '../../application/use-cases/Delete${pascalName}UseCase';
import {Supabase${pascalName}Repository} from '../../data/repository/Supabase${pascalName}Repository';
import {Create${pascalName}Request, Update${pascalName}Request} from '../../domain/entities/${pascalName}';

// Repository instance
const repository = new Supabase${pascalName}Repository();

// Use cases
const get${pascalName}ListUseCase = new Get${pascalName}ListUseCase(repository);
const create${pascalName}UseCase = new Create${pascalName}UseCase(repository);
const update${pascalName}UseCase = new Update${pascalName}UseCase(repository);
const delete${pascalName}UseCase = new Delete${pascalName}UseCase(repository);

export const use${pascalName}Actions = () => {
  const store = use${pascalName}Store();

  const load${pascalName}s = useCallback(async (page = 1, limit = 10) => {
    try {
      store.setLoading(true);
      store.clearError();
      
      const result = await get${pascalName}ListUseCase.execute(page, limit);
      store.setItems(result.data, result.total, result.page);
    } catch (error) {
      store.setError(error.message);
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  const create${pascalName} = useCallback(async (request: Create${pascalName}Request) => {
    try {
      store.setCreating(true);
      store.clearError();
      
      const item = await create${pascalName}UseCase.execute(request);
      store.addItem(item);
      
      return item;
    } catch (error) {
      store.setError(error.message);
      throw error;
    } finally {
      store.setCreating(false);
    }
  }, [store]);

  const update${pascalName} = useCallback(async (id: string, request: Update${pascalName}Request) => {
    try {
      store.setUpdating(true);
      store.clearError();
      
      const item = await update${pascalName}UseCase.execute(id, request);
      store.updateItem(item);
      
      return item;
    } catch (error) {
      store.setError(error.message);
      throw error;
    } finally {
      store.setUpdating(false);
    }
  }, [store]);

  const delete${pascalName} = useCallback(async (id: string) => {
    try {
      store.setDeleting(true);
      store.clearError();
      
      await delete${pascalName}UseCase.execute(id);
      store.removeItem(id);
    } catch (error) {
      store.setError(error.message);
      throw error;
    } finally {
      store.setDeleting(false);
    }
  }, [store]);

  return {
    load${pascalName}s,
    create${pascalName},
    update${pascalName},
    delete${pascalName},
  };
};`;

  fs.writeFileSync(
    path.join(featurePath, `presentation/hooks/use${pascalName}Actions.ts`),
    hooksContent
  );

  // 9. List Screen
  const listScreenContent = `import React, {useEffect} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {Text, FAB, Card, IconButton, ActivityIndicator} from 'react-native-paper';
import {Screen} from '@shared/components/Screen';
import {useTheme} from '@shared/theme';
import {use${pascalName}Store} from '../store/use${pascalName}Store';
import {use${pascalName}Actions} from '../hooks/use${pascalName}Actions';
import {${pascalName}} from '../../domain/entities/${pascalName}';

interface ${pascalName}ListScreenProps {
  navigation: any;
}

export const ${pascalName}ListScreen = ({navigation}: ${pascalName}ListScreenProps) => {
  const {colors, spacing} = useTheme();
  const {items, isLoading, error} = use${pascalName}Store();
  const {load${pascalName}s, delete${pascalName}} = use${pascalName}Actions();

  useEffect(() => {
    load${pascalName}s();
  }, [load${pascalName}s]);

  const handleCreate = () => {
    navigation.navigate('Create${pascalName}');
  };

  const handleEdit = (item: ${pascalName}) => {
    navigation.navigate('Edit${pascalName}', {id: item.id});
  };

  const handleDelete = async (id: string) => {
    try {
      await delete${pascalName}(id);
    } catch (error) {
      // Error is handled by the store
    }
  };

  const renderItem = ({item}: {item: ${pascalName}}) => (
    <Card style={[styles.card, {backgroundColor: colors.surface}]} mode="outlined">
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text variant="titleMedium" style={{color: colors.onSurface}}>
            {item.${fields[0].name}}
          </Text>
          <View style={styles.actions}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => handleEdit(item)}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={() => handleDelete(item.id)}
            />
          </View>
        </View>
${fields
  .slice(1)
  .map(
    field => `        <Text variant="bodyMedium" style={{color: colors.onSurfaceVariant}}>
          ${capitalizeFirst(field.name)}: {item.${field.name}${field.type === 'boolean' ? ' ? "Yes" : "No"' : ''}}
        </Text>`
  )
  .join('\n')}
      </Card.Content>
    </Card>
  );

  if (isLoading && items.length === 0) {
    return (
      <Screen>
        <View style={[styles.centered, {backgroundColor: colors.background}]}>
          <ActivityIndicator size="large" />
          <Text style={{color: colors.onBackground, marginTop: spacing.md}}>
            Loading ${featureName}s...
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={[styles.container, {backgroundColor: colors.background}]}>
        {error && (
          <Text style={[styles.error, {color: colors.error}]}>
            {error}
          </Text>
        )}
        
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
        
        <FAB
          icon="plus"
          style={[styles.fab, {backgroundColor: colors.primary}]}
          onPress={handleCreate}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  error: {
    padding: 16,
    textAlign: 'center',
  },
});`;

  fs.writeFileSync(
    path.join(featurePath, `presentation/screens/${pascalName}ListScreen.tsx`),
    listScreenContent
  );

  // 10. Create Screen
  const createScreenContent = `import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Text, TextInput, Button} from 'react-native-paper';
import {Screen} from '@shared/components/Screen';
import {useTheme} from '@shared/theme';
import {use${pascalName}Actions} from '../hooks/use${pascalName}Actions';
import {use${pascalName}Store} from '../store/use${pascalName}Store';
import {Create${pascalName}Request} from '../../domain/entities/${pascalName}';

interface Create${pascalName}ScreenProps {
  navigation: any;
}

export const Create${pascalName}Screen = ({navigation}: Create${pascalName}ScreenProps) => {
  const {colors, spacing} = useTheme();
  const {isCreating} = use${pascalName}Store();
  const {create${pascalName}} = use${pascalName}Actions();

${fields.map(field => `  const [${field.name}, set${capitalizeFirst(field.name)}] = useState${field.type === 'string' ? "('')" : field.type === 'boolean' ? '(false)' : field.type === 'number' ? '(0)' : "('')"};`).join('\n')}

  const handleSubmit = async () => {
    try {
      const request: Create${pascalName}Request = {
${fields.map(field => `        ${field.name},`).join('\n')}
      };

      await create${pascalName}(request);
      navigation.goBack();
    } catch (error) {
      // Error is handled by the store
    }
  };

  const isValid = ${fields.map(field => (field.type === 'string' ? `${field.name}.trim().length > 0` : 'true')).join(' && ')};

  return (
    <Screen>
      <ScrollView style={[styles.container, {backgroundColor: colors.background}]}>
        <View style={styles.form}>
          <Text variant="headlineMedium" style={[styles.title, {color: colors.onBackground}]}>
            Create ${pascalName}
          </Text>

${fields
  .map(field => {
    if (field.type === 'boolean') {
      return `          <Button
            mode={${field.name} ? 'contained' : 'outlined'}
            onPress={() => set${capitalizeFirst(field.name)}(!${field.name})}
            style={styles.input}
          >
            ${capitalizeFirst(field.name)}: {${field.name} ? 'Yes' : 'No'}
          </Button>`;
    } else {
      return `          <TextInput
            label="${capitalizeFirst(field.name)}"
            value={${field.name}${field.type === 'number' ? '.toString()' : ''}}
            onChangeText={set${capitalizeFirst(field.name)}}
            style={styles.input}
            mode="outlined"
            ${field.type === 'number' ? 'keyboardType="numeric"' : ''}
          />`;
    }
  })
  .join('\n\n')}

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isCreating}
            disabled={!isValid || isCreating}
            style={styles.submitButton}
          >
            Create ${pascalName}
          </Button>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 24,
  },
});`;

  fs.writeFileSync(
    path.join(
      featurePath,
      `presentation/screens/Create${pascalName}Screen.tsx`
    ),
    createScreenContent
  );

  // 11. feature.json
  const featureJson = {
    name: featureName,
    description: description || `CRUD operations for ${featureName}`,
    type: 'crud',
    screens: [`${pascalName}ListScreen`, `Create${pascalName}Screen`],
    store: true,
    useCases: [
      `Get${pascalName}ListUseCase`,
      `Create${pascalName}UseCase`,
      `Update${pascalName}UseCase`,
      `Delete${pascalName}UseCase`,
    ],
    apiEndpoint: apiEndpoint || `/api/${featureName}s`,
    requiresAuth: hasAuth === 'y' || hasAuth === 'Y',
    entityFields: fields,
    createdAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(featurePath, 'feature.json'),
    JSON.stringify(featureJson, null, 2)
  );

  // Formatiere generierten Code
  console.log('✨ Formatiere generierten Code...');
  import {exec} from 'child_process';

  exec(`npx eslint ${featurePath} --fix`, error => {
    if (error) {
      console.warn('⚠️  ESLint Formatierung fehlgeschlagen:', error.message);
    }
  });

  exec(`npx prettier --write ${featurePath}`, error => {
    if (error) {
      console.warn('⚠️  Prettier Formatierung fehlgeschlagen:', error.message);
    }
  });

  console.log('');
  console.log('🎉 CRUD-Feature erfolgreich erstellt!');
  console.log('');
  console.log(`📁 Feature: ${featureName}`);
  console.log(
    `📊 Entity-Felder: ${fields.map(f => `${f.name}:${f.type}`).join(', ')}`
  );
  console.log(`🔐 Authentifizierung: ${hasAuth === 'y' ? 'Ja' : 'Nein'}`);
  console.log(`🌐 API-Endpoint: ${apiEndpoint || `/api/${featureName}s`}`);
  console.log('');
  console.log('📝 Nächste Schritte:');
  console.log('   1. Supabase-Tabelle erstellen');
  console.log('   2. Navigation konfigurieren');
  console.log('   3. API-Endpoints implementieren');
  console.log('   4. Tests schreiben');
  console.log('');
  console.log('📚 Siehe docs/EXAMPLES.md für Details!');

  rl.close();
}

createCrudFeature().catch(console.error);
