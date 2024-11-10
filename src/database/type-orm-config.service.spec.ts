import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmConfigService } from './type-orm-config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Form } from '../forms/entities/form.entity';
import { Field } from '../forms/entities/field.entity';

describe('TypeOrmConfigService', () => {
  let service: TypeOrmConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        TypeOrmConfigService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                'database.host': 'localhost',
                'database.port': 3306,
                'database.user': 'testuser',
                'database.password': 'testpassword',
                'database.name': 'testdb',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<TypeOrmConfigService>(TypeOrmConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create TypeOrm options', () => {
    const options = service.createTypeOrmOptions();
    expect(options).toEqual({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'testuser',
      password: 'testpassword',
      database: 'testdb',
      entities: [Form, Field],
      synchronize: true,
    });
  });
});
