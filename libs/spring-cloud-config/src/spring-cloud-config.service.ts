import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudConfigOptions, Config, ConfigObject } from 'spring-cloud-config';
import _ from 'lodash';

@Injectable()
export class SpringCloudConfigService {

  private logger: Logger = new Logger('ConfigurationService');

  private config: ConfigObject;

  constructor(
    private configService: ConfigService
  ) { }

  public async load(options: CloudConfigOptions): Promise<ConfigObject> {
    this.logger.log('Connection to server to recovery cloud configurations');
    return Config
      .load(options)
      .then((config: ConfigObject) => {
        try {
          this.logger.debug('Trying to sync cloud config envs with local envs');
          this.config = this.replaceTemplateStringWithEnv(config);
          this.logger.debug('Successfully sync envs');
        } catch (error) {
          this.logger.error('Error while trying to sync cloud config envs with local envs');
          throw error;
        }
        this.logger.log('Configurations successfully recovered');
        return this.config;
      })
      .catch((error: any) => {
        this.logger.error('Error while trying to recovery cloud configurations');
        this.logger.verbose(error);
        throw error;
      });
  }

  public getConfig(): ConfigObject {
    return this.config;
  }

  private replaceTemplateStringWithEnv(obj: ConfigObject): ConfigObject {
    let config = JSON.stringify(obj);
    const strings: Set<RegExpExecArray> = this.getAllTemplateStrings(config);
    strings.forEach((regex: RegExpExecArray) => {
      const values: Array<string> = regex[1].split(':');
      const item: any = {
        key: values[0],
        value: values[1]
      };
      let value = this.configService.get(item.key);
      if (value) {
        config = config.replace(regex[0], value);
      } else {
        value = _.get(obj, item.key) || item.value;
        if (!value) {
          throw new Error(`Missing env found: ${item.key}`);
        }
        config = config.replace(regex[0], value);
      }
    });
    return JSON.parse(config);
  }

  private getAllTemplateStrings(config: string): Set<RegExpExecArray> {
    const regex = new RegExp('\\${(.*?)}', 'g');
    let match: RegExpExecArray = regex.exec(config);
    const strings = new Set<RegExpExecArray>();
    while (match != null) {
      strings.add(match);
      match = regex.exec(config);
    }
    return strings;
  }

}
