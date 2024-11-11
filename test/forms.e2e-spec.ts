import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppController } from './../src/app.controller';
import { AppService } from './../src/app.service';
import { FormsController } from './../src/forms/forms.controller';
import { FormsService } from './../src/forms/forms.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Form } from './../src/forms/entities/form.entity';
import { Answer } from './../src/forms/entities/answer.entity';
import { CreateFormDto } from './../src/forms/dto/create-form.dto';
import { UpdateFormDto } from './../src/forms/dto/update-form.dto';
import { SubmitFormDto } from './../src/forms/dto/submit-form.dto';

describe('FormsController (e2e)', () => {
  let app: INestApplication;
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
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController, FormsController],
      providers: [
        AppService,
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

    repository = moduleFixture.get<typeof mockRepository>(
      getRepositoryToken(Form),
    );

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('OK');
  });

  it('/forms (POST)', async () => {
    const createFormDto: CreateFormDto = {
      name: 'Test Form',
      description: 'Test Description',
      fields: [
        {
          name: 'Test Field',
          label: 'Test Label',
          type: 'text',
          required: true,
        },
      ],
    };

    repository.create.mockReturnValue(createFormDto);
    repository.save.mockResolvedValue(createFormDto);

    const response = await request(app.getHttpServer())
      .post('/forms')
      .send(createFormDto)
      .expect(201);

    expect(response.body).toEqual(createFormDto);
  });

  it('/forms/:id (POST)', async () => {
    const submitFormDto: SubmitFormDto = {
      answers: [{ fieldId: 1, value: 'Answer 1' }],
    };

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

    const answers = [{ field: form.fields[0], value: 'Answer 1' }];

    repository.findOne.mockResolvedValue(form);
    repository.save.mockResolvedValue(answers);

    const response = await request(app.getHttpServer())
      .post(`/forms/${form.id}`)
      .send(submitFormDto)
      .expect(201);

    expect(response.body).toEqual(form);
  });

  it('/forms (GET)', async () => {
    const forms = [
      { id: 1, name: 'Test Form', description: 'Test Description', fields: [] },
    ];

    repository.find.mockResolvedValue(forms);

    const response = await request(app.getHttpServer())
      .get('/forms')
      .expect(200);
    expect(response.body).toEqual(forms);
  });

  it('/forms/:id (GET)', async () => {
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

    repository.findOne.mockResolvedValue(form);

    const response = await request(app.getHttpServer())
      .get(`/forms/${form.id}`)
      .expect(200);

    expect(response.body).toEqual(form);
  });

  it('/forms/:id (PATCH)', async () => {
    const updateFormDto: UpdateFormDto = {
      name: 'Updated Form',
      description: 'Updated Description',
      fields: [],
    };

    const form = { id: 1, ...updateFormDto };

    repository.findOne.mockResolvedValue(form);
    repository.save.mockResolvedValue(form);

    const response = await request(app.getHttpServer())
      .patch(`/forms/${form.id}`)
      .send(updateFormDto)
      .expect(200);

    expect(response.body).toEqual(form);
  });

  it('/forms/:id (DELETE)', async () => {
    repository.delete.mockResolvedValue(undefined);

    await request(app.getHttpServer()).delete(`/forms/${1}`).expect(200);
  });
});
