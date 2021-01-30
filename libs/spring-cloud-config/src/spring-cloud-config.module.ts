import { DynamicModule, Module, Provider } from '@nestjs/common';
import { SpringCloudConfigFactory } from './config';
import { SpringCloudConfigModuleAsyncOptions, SpringCloudConfigModuleOptions, SpringCloudConfigModuleOptionsFactory, SpringCloudConfigProviderAsyncOptions } from './interfaces';

@Module({})
export class SpringCloudConfigModule {

  static register(options: SpringCloudConfigModuleOptions): DynamicModule {
    const SpringCloudConfig = (options || []).map(item => ({
      provide: item.name,
      useValue: SpringCloudConfigFactory.create(item),
    }));
    return {
      module: SpringCloudConfigModule,
      providers: SpringCloudConfig,
      exports: SpringCloudConfig,
    };
  }

  static registerAsync(options: SpringCloudConfigModuleAsyncOptions): DynamicModule {
    const providers: Provider[] = options.reduce(
      (accProviders: Provider[], item) =>
        accProviders
          .concat(this.createAsyncProviders(item))
          .concat(item.extraProviders || []),
      [],
    );
    const imports = options.reduce(
      (accImports, option) =>
        option.imports && !accImports.includes(option.imports)
          ? accImports.concat(option.imports)
          : accImports,
      [],
    );
    return {
      module: SpringCloudConfigModule,
      imports,
      providers: providers,
      exports: providers,
    };
  }

  private static createAsyncProviders(
    options: SpringCloudConfigProviderAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: SpringCloudConfigProviderAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: options.name,
        useFactory: this.createFactoryWrapper(options.useFactory),
        inject: options.inject || [],
      };
    }
    return {
      provide: options.name,
      useFactory: this.createFactoryWrapper(
        (optionsFactory: SpringCloudConfigModuleOptionsFactory) =>
          optionsFactory.createSpringCloudConfigOptions(),
      ),
      inject: [options.useExisting || options.useClass],
    };
  }

  private static createFactoryWrapper(
    useFactory: SpringCloudConfigProviderAsyncOptions['useFactory'],
  ) {
    return async (...args: any[]) => {
      const clientOptions = await useFactory(...args);
      return SpringCloudConfigFactory.create(clientOptions);
    };
  }

}
