import { Test, TestingModule } from '@nestjs/testing';
import { FormsController } from './forms.controller';
import { FormsService } from './forms.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Form } from './entities/form.entity';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';

describe('FormsController', () => {
  let controller: FormsController;
  let service: FormsService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormsController],
      providers: [
        FormsService,
        {
          provide: getRepositoryToken(Form),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<FormsController>(FormsController);
    service = module.get<FormsService>(FormsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a form', async () => {
    const createFormDto: CreateFormDto = {
      name: 'Test Form',
      description: 'Test Description',
      fields: [],
    };

    const form: Form = {
      id: 1,
      name: 'Test Form',
      description: 'Test Description',
      fields: [],
    };

    jest.spyOn(service, 'create').mockResolvedValue(form);

    expect(await controller.create(createFormDto)).toEqual(form);
    expect(service.create).toHaveBeenCalledWith(createFormDto);
  });

  it('should find all forms', async () => {
    const forms: Form[] = [
      { id: 1, name: 'Test Form', description: 'Test Description', fields: [] },
    ];
    jest.spyOn(service, 'findAll').mockResolvedValue(forms);

    expect(await controller.findAll()).toEqual(forms);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should find one form', async () => {
    const form: Form = {
      id: 1,
      name: 'Test Form',
      description: 'Test Description',
      fields: [],
    };

    jest.spyOn(service, 'findOne').mockResolvedValue(form);

    expect(await controller.findOne('1')).toEqual(form);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should update a form', async () => {
    const updateFormDto: UpdateFormDto = {
      name: 'Updated Form',
      description: 'Updated Description',
      fields: [],
    };

    const form: Form = {
      id: 1,
      name: 'Updated Form',
      description: 'Updated Description',
      fields: [],
    };

    jest.spyOn(service, 'update').mockResolvedValue(form);

    expect(await controller.update('1', updateFormDto)).toEqual(form);
    expect(service.update).toHaveBeenCalledWith(1, updateFormDto);
  });

  it('should remove a form', async () => {
    jest.spyOn(service, 'remove').mockResolvedValue(undefined);

    await controller.remove('1');
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
