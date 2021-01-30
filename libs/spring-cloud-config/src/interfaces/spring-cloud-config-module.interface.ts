import { Type, Provider, ModuleMetadata } from '@nestjs/common/interfaces';

export type SpringCloudConfigModuleOptions = Array<any>;

export interface SpringCloudConfigModuleOptionsFactory {
  createSpringCloudConfigOptions(): Promise<any> | any;
}

export interface SpringCloudConfigProviderAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<SpringCloudConfigModuleOptionsFactory>;
  useClass?: Type<SpringCloudConfigModuleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<any> | any;
  inject?: any[];
  extraProviders?: Provider[];
  name: string | symbol;
}

export type SpringCloudConfigModuleAsyncOptions = Array<SpringCloudConfigProviderAsyncOptions>;
