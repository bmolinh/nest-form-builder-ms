import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FormsService } from './forms.service';
import { Form } from './entities/form.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Answer } from './entities/answer.entity';
import { SubmitAnswerDto } from './dto/submit-form.dto';

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
        {
          provide: getRepositoryToken(Answer),
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

  it('should submit answers', async () => {
    const fields = [
      {
        id: 1,
        name: 'Field 1',
        label: 'Label 1',
        type: 'text',
        required: true,
      },
    ];

    const form = {
      id: 1,
      name: 'Test Form',
      description: 'Test Description',
      fields: [...fields],
    };

    const answersDto: SubmitAnswerDto[] = [{ fieldId: 1, value: 'Answer 1' }];
    const answers = [{ field: fields[0], value: 'Answer 1' }];

    repository.findOne.mockResolvedValue(form);
    repository.save.mockResolvedValue(answers);

    expect(await service.submit(form.id, answersDto)).toEqual(form);
    expect(repository.save).toHaveBeenCalledWith(answers);
  });

  it('should throw NotFoundException if form not found', async () => {
    const form = {
      id: 1,
      name: 'Test Form',
      description: 'Test Description',
      fields: [],
    };

    const answersDto: SubmitAnswerDto[] = [{ fieldId: 2, value: 'Answer 2' }];

    repository.findOne.mockResolvedValue(null);
    repository.save.mockResolvedValue(null);

    await expect(service.submit(form.id, answersDto)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw BadRequestException if field not found in form', async () => {
    const form = {
      id: 1,
      name: 'Test Form',
      description: 'Test Description',
      fields: [
        {
          id: 1,
          name: 'Field 1',
          label: 'Label 1',
          type: 'text',
          required: true,
        },
      ],
    };

    const answersDto: SubmitAnswerDto[] = [{ fieldId: 2, value: 'Answer 2' }];

    repository.findOne.mockResolvedValue(form);
    repository.save.mockResolvedValue(null);

    await expect(service.submit(form.id, answersDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should find all forms', async () => {
    const forms = [
      { id: 1, name: 'Test Form', description: 'Test Description', fields: [] },
    ];
    repository.find.mockResolvedValue(forms);

    expect(await service.findAll()).toEqual(forms);
    expect(repository.find).toHaveBeenCalledWith({
      relations: ['fields', 'fields.answers'],
    });
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
    repository.findOne.mockResolvedValue(form);
    repository.save.mockResolvedValue(form);

    expect(await service.update(1, formDto)).toEqual(form);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['fields'],
    });
    expect(repository.save).toHaveBeenCalledWith(form);
  });

  it('should throw NotFoundException if form does not exist', async () => {
    const formDto = {
      name: 'Updated Form',
      description: 'Updated Description',
      fields: [],
    };
    repository.findOne.mockResolvedValue(null);

    await expect(service.update(1, formDto)).rejects.toThrow(NotFoundException);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['fields'],
    });
  });

  it('should update a form with existing fields', async () => {
    const formDto = {
      name: 'Updated Form',
      description: 'Updated Description',
      fields: [
        {
          id: 1,
          name: 'Updated Field',
          label: 'Updated Label',
          type: 'text',
          required: true,
        },
      ],
    };

    const form = {
      id: 1,
      name: 'Test Form',
      description: 'Test Description',
      fields: [
        {
          id: 1,
          name: 'Test Field',
          label: 'Test Label',
          type: 'text',
          required: true,
        },
      ],
    };

    const updatedForm = {
      ...form,
      ...formDto,
    };

    repository.findOne.mockResolvedValue(form);
    repository.save.mockResolvedValue(updatedForm);

    expect(await service.update(1, formDto)).toEqual(updatedForm);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['fields'],
    });
    expect(repository.save).toHaveBeenCalledWith(updatedForm);
  });

  it('should update a form with new fields', async () => {
    const formDto = {
      id: 1,
      name: 'Updated Form',
      description: 'Updated Description',
      fields: [
        {
          id: 2,
          name: 'New Field',
          label: 'New Label',
          type: 'text',
          required: true,
        },
      ],
    };

    const form = {
      id: 1,
      name: 'Test Form',
      description: 'Test Description',
      fields: [
        {
          id: 1,
          name: 'Test Field',
          label: 'Test Label',
          type: 'text',
          required: true,
        },
      ],
    };

    const updatedForm = {
      ...form,
      ...formDto,
      fields: [...form.fields, ...formDto.fields],
    };

    repository.findOne.mockResolvedValue(form);
    repository.save.mockResolvedValue(updatedForm);

    expect(await service.update(1, formDto)).toEqual(updatedForm);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['fields'],
    });
    expect(repository.save).toHaveBeenCalledWith(formDto);
  });

  it('should remove a form', async () => {
    repository.delete.mockResolvedValue(undefined);

    await service.remove(1);
    expect(repository.delete).toHaveBeenCalledWith(1);
  });
});
