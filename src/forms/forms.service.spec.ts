import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FormsService } from './forms.service';
import { Form } from './entities/form.entity';

describe('FormsService', () => {
  let service: FormsService;
  let repository: typeof mockRepository;

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
      providers: [
        FormsService,
        {
          provide: getRepositoryToken(Form),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<FormsService>(FormsService);
    repository = module.get<typeof mockRepository>(getRepositoryToken(Form));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a form', async () => {
    const formDto = {
      name: 'Test Form',
      description: 'Test Description',
      fields: [],
    };
    repository.create.mockReturnValue(formDto);
    repository.save.mockResolvedValue(formDto);

    expect(await service.create(formDto)).toEqual(formDto);
    expect(repository.create).toHaveBeenCalledWith(formDto);
    expect(repository.save).toHaveBeenCalledWith(formDto);
  });

  it('should find all forms', async () => {
    const forms = [
      { id: 1, name: 'Test Form', description: 'Test Description', fields: [] },
    ];
    repository.find.mockResolvedValue(forms);

    expect(await service.findAll()).toEqual(forms);
    expect(repository.find).toHaveBeenCalledWith({ relations: ['fields'] });
  });

  it('should find one form', async () => {
    const form = {
      id: 1,
      name: 'Test Form',
      description: 'Test Description',
      fields: [],
    };
    repository.findOne.mockResolvedValue(form);

    expect(await service.findOne(1)).toEqual(form);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['fields'],
    });
  });

  it('should update a form', async () => {
    const formDto = {
      name: 'Updated Form',
      description: 'Updated Description',
      fields: [],
    };
    const form = { id: 1, ...formDto };
    repository.update.mockResolvedValue(undefined);
    repository.findOne.mockResolvedValue(form);

    expect(await service.update(1, formDto)).toEqual(form);
    expect(repository.update).toHaveBeenCalledWith(1, formDto);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['fields'],
    });
  });

  it('should remove a form', async () => {
    repository.delete.mockResolvedValue(undefined);

    await service.remove(1);
    expect(repository.delete).toHaveBeenCalledWith(1);
  });
});
