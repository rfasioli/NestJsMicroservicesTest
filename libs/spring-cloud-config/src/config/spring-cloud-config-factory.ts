import { ConfigService } from "@nestjs/config";
import { SpringCloudConfigService } from "apps/client/src/app/service/spring-cloud-config.service";


export interface ISpringCloudConfigFactory {
  create(springCloudConfigOptions: ConfigService): SpringCloudConfigService;
}

export class SpringCloudConfigFactory {
  public static create(springCloudConfigOptions: ConfigService): SpringCloudConfigService;
  public static create(springCloudConfigOptions: ConfigService): SpringCloudConfigService {
    return new SpringCloudConfigService(springCloudConfigOptions);
  }
}
